import { NextRequest, NextResponse } from 'next/server'
import { firestore } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, where, limit } from 'firebase/firestore'

interface DetailedAd {
  title: string
  description: string
  price: number | null
  city: string
  phone: string
  images: string[]
  category: string
  url?: string
  sourcePage?: string
  professionalName?: string
  address?: string
}

// Fonction pour appeler l'IA
async function callAI(prompt: string, systemPrompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      console.error('AI API error:', response.status)
      return ''
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  } catch (error) {
    console.error('AI call error:', error)
    return ''
  }
}

// Scraper une page web
async function scrapeWebPage(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
      },
      redirect: 'follow'
    })
    
    if (!response.ok) {
      console.error(`HTTP ${response.status} for ${url}`)
      return ''
    }
    
    return await response.text()
  } catch (error: any) {
    console.error('Scrape error:', error.message)
    return ''
  }
}

// Extraire les liens d'annonces
function extractAdLinksFromListing(html: string, baseUrl: string): string[] {
  const links: Set<string> = new Set()
  const base = new URL(baseUrl)

  // Patterns pour expat-dakar.com
  const patterns = [
    /href=["'](\/annonce\/[^"']+)["']/gi,
    /href=["']([^"']*\/annonce\/[^"']+\d{5,}[^"']*)["']/gi,
    /data-href=["'](\/annonce\/[^"']+)["']/gi,
  ]

  for (const pattern of patterns) {
    try {
      const matches = html.matchAll(pattern)
      for (const match of matches) {
        let link = match[1]
        
        link = link.replace(/&amp;/g, '&')
        link = link.split('#')[0]
        
        if (link.includes('page=') || link.includes('/page/') || link.length < 10) {
          continue
        }
        
        if (link.startsWith('/')) {
          link = `${base.origin}${link}`
        } else if (!link.startsWith('http')) {
          link = `${base.origin}/${link}`
        }
        
        if (link.includes('/annonce') && !link.includes('/annonces?')) {
          links.add(link)
        }
      }
    } catch (e) {
      console.error('Pattern error:', e)
    }
  }

  return Array.from(links)
}

// Extraire les images du HTML
function extractImages(html: string, url: string): string[] {
  const images: string[] = []
  const base = new URL(url)
  
  // Patterns pour les images
  const patterns = [
    /<img[^>]+src=["']([^"']+)["']/gi,
    /<img[^>]+data-src=["']([^"']+)["']/gi,
    /data-lazy-src=["']([^"']+)["']/gi,
    /srcset=["']([^"']+)["']/gi,
  ]
  
  for (const pattern of patterns) {
    const matches = html.matchAll(pattern)
    for (const match of matches) {
      let imgUrl = match[1]
      
      // Prendre la première image du srcset
      if (imgUrl.includes(' ')) {
        imgUrl = imgUrl.split(' ')[0]
      }
      
      if (imgUrl.startsWith('//')) {
        imgUrl = 'https:' + imgUrl
      } else if (imgUrl.startsWith('/')) {
        imgUrl = `${base.origin}${imgUrl}`
      }
      
      // Filtrer
      const ext = imgUrl.toLowerCase()
      if ((ext.includes('.jpg') || ext.includes('.jpeg') || ext.includes('.png') || ext.includes('.webp')) &&
          !imgUrl.includes('logo') &&
          !imgUrl.includes('avatar') &&
          !imgUrl.includes('icon') &&
          !imgUrl.includes('banner') &&
          !imgUrl.includes('pub') &&
          !imgUrl.includes('ads/') &&
          imgUrl.length > 20) {
        images.push(imgUrl)
      }
    }
  }
  
  return [...new Set(images)].slice(0, 10)
}

// Extraire les détails d'une annonce - VERSION SIMPLIFIÉE
async function extractAdDetails(html: string, url: string): Promise<DetailedAd | null> {
  try {
    // 1. Extraire le titre
    let title = ''
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) ||
                       html.match(/<title>([^<]+)<\/title>/i) ||
                       html.match(/class=["'][^"']*title[^"']*["'][^>]*>([^<]+)</i)
    if (titleMatch) {
      title = titleMatch[1].trim().replace(/\s+/g, ' ')
    }

    // 2. Extraire la description
    let description = ''
    const descMatch = html.match(/class=["'][^"']*description[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|p|span)>/i) ||
                      html.match(/id=["']description[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
                      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    if (descMatch) {
      description = descMatch[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 2000)
    }

    // 3. Extraire le prix
    let price: number | null = null
    const priceMatch = html.match(/(\d[\d\s\.]*)\s*(?:FCFA|CFA|F|€|EUR)/i) ||
                       html.match(/prix[^<]*[:\s]+(\d[\d\s\.]*)/i) ||
                       html.match(/(\d{4,})/)
    if (priceMatch) {
      price = parseInt(priceMatch[1].replace(/\s/g, '').replace(/\./g, ''))
    }

    // 4. Extraire le téléphone - IMPORTANT
    let phone = ''
    // Chercher les numéros sénégalais (77, 78, 76, 70, 75, 33)
    const phonePatterns = [
      /(7[0-8]\s?[\d\s]{7,9})/g,
      /(33\s?[\d\s]{7,9})/g,
      /(\+221\s?7[0-8][\d\s]{7})/g,
      /(\+221\s?33[\d\s]{7})/g,
      /tel:([0-9+\s]+)/gi,
      /t[eé]l[^<]*[:\s]+([0-9\s]+)/i,
    ]
    
    for (const pattern of phonePatterns) {
      const matches = html.matchAll(pattern)
      for (const match of matches) {
        let p = match[1].replace(/\s/g, '')
        if (p.length >= 9 && p.length <= 14) {
          phone = p
          break
        }
      }
      if (phone) break
    }

    // 5. Extraire la ville/localisation
    let city = ''
    const cityMatch = html.match(/class=["'][^"']*(?:location|ville|city|localisation)[^"']*["'][^>]*>([^<]+)</i) ||
                      html.match(/(?:ville|city|localisation)[^<]*[:\s]+([^<,\n]+)/i)
    if (cityMatch) {
      city = cityMatch[1].trim()
    }

    // 6. Extraire les images
    const images = extractImages(html, url)

    // 7. Si pas de titre trouvé, essayer avec l'IA
    if (!title || title.length < 5) {
      const textContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .substring(0, 5000)

      const aiPrompt = `Extrait les informations de cette annonce:

${textContent}

Retourne un JSON avec: title, description, price (nombre), city, phone, category (immobilier/services/transport/vente/location/emploi).

JSON uniquement:
{"title":"...","description":"...","price":N,"city":"...","phone":"...","category":"..."}`

      const aiResponse = await callAI(aiPrompt, 'Tu extrais des données. JSON uniquement.')
      
      if (aiResponse) {
        try {
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0])
            title = data.title || title
            description = data.description || description
            price = data.price || price
            city = data.city || city
            phone = data.phone || phone
          }
        } catch {}
      }
    }

    // Déterminer la catégorie
    let category = 'vente'
    const lowerHtml = html.toLowerCase()
    if (lowerHtml.includes('appartement') || lowerHtml.includes('maison') || lowerHtml.includes('terrain') || lowerHtml.includes('immobilier')) {
      category = 'immobilier'
    } else if (lowerHtml.includes('voiture') || lowerHtml.includes('moto') || lowerHtml.includes('véhicule') || lowerHtml.includes('auto')) {
      category = 'transport'
    } else if (lowerHtml.includes('emploi') || lowerHtml.includes('recrutement') || lowerHtml.includes('travail')) {
      category = 'emploi'
    } else if (lowerHtml.includes('service') || lowerHtml.includes('prestation')) {
      category = 'services'
    }

    // Vérifier qu'on a au minimum un titre
    if (!title || title.length < 3) {
      console.log('No title found for:', url)
      return null
    }

    return {
      title,
      description,
      price,
      city,
      phone,
      images,
      category,
      url
    }
  } catch (error) {
    console.error('Error extracting details:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, action, ads, maxAds } = body

    // Action: Scraping en profondeur
    if (action === 'scrape-deep' || action === 'scrape-all') {
      if (!url) {
        return NextResponse.json({ error: 'URL requise' }, { status: 400 })
      }

      const maxAdsToScrape = maxAds || 20
      const allAds: DetailedAd[] = []
      const processedUrls = new Set<string>()

      // 1. Scraper la page de liste
      console.log('Scraping listing page:', url)
      const listingHtml = await scrapeWebPage(url)
      if (!listingHtml) {
        return NextResponse.json({ error: 'Impossible d\'accéder à la page' }, { status: 400 })
      }

      // 2. Extraire les liens
      let adLinks = extractAdLinksFromListing(listingHtml, url)
      console.log('Found links:', adLinks.length)

      // Si pas de liens, utiliser l'IA pour en trouver
      if (adLinks.length === 0) {
        const textContent = listingHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 10000)
        const aiPrompt = `Trouve tous les liens vers des annonces dans ce contenu. Retourne un JSON: {"links": ["url1", "url2"]}

Contenu: ${textContent}
Base URL: ${url}`

        const aiResponse = await callAI(aiPrompt, 'JSON uniquement.')
        if (aiResponse) {
          try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              const data = JSON.parse(jsonMatch[0])
              if (data.links && Array.isArray(data.links)) {
                const base = new URL(url)
                adLinks = data.links.map((l: string) => {
                  if (l.startsWith('/')) return `${base.origin}${l}`
                  return l
                })
              }
            }
          } catch {}
        }
      }

      adLinks = [...new Set(adLinks)].slice(0, maxAdsToScrape)
      console.log('Unique links to scrape:', adLinks.length)

      // 3. Scraper chaque annonce
      for (let i = 0; i < adLinks.length; i++) {
        const adUrl = adLinks[i]
        if (processedUrls.has(adUrl)) continue
        processedUrls.add(adUrl)

        console.log(`Scraping ${i + 1}/${adLinks.length}:`, adUrl)

        const adHtml = await scrapeWebPage(adUrl)
        if (!adHtml) {
          console.log('Failed to fetch:', adUrl)
          continue
        }

        const adDetails = await extractAdDetails(adHtml, adUrl)
        if (adDetails) {
          allAds.push(adDetails)
          console.log('✅ Extracted:', adDetails.title)
        } else {
          console.log('❌ Failed to extract from:', adUrl)
        }

        await new Promise(resolve => setTimeout(resolve, 200))
      }

      return NextResponse.json({
        success: true,
        siteName: new URL(url).hostname,
        totalFound: allAds.length,
        totalAdLinksFound: adLinks.length,
        ads: allAds,
        sourceUrl: url
      })
    }

    // Action: Scraping simple
    if (action === 'scrape') {
      if (!url) {
        return NextResponse.json({ error: 'URL requise' }, { status: 400 })
      }

      const html = await scrapeWebPage(url)
      if (!html) {
        return NextResponse.json({ error: 'Impossible de récupérer le contenu' }, { status: 400 })
      }

      let adLinks = extractAdLinksFromListing(html, url)
      const ads: DetailedAd[] = []

      for (let i = 0; i < Math.min(adLinks.length, 5); i++) {
        const adHtml = await scrapeWebPage(adLinks[i])
        if (adHtml) {
          const adDetails = await extractAdDetails(adHtml, adLinks[i])
          if (adDetails) {
            ads.push(adDetails)
          }
        }
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      return NextResponse.json({
        success: true,
        siteName: new URL(url).hostname,
        totalFound: ads.length,
        totalLinksFound: adLinks.length,
        ads,
        sourceUrl: url,
        allAdLinks: adLinks.slice(0, 10)
      })
    }

    // Action: Créer une annonce
    if (action === 'create-ad') {
      const { ad } = body
      
      const categoryMap: Record<string, string> = {
        'immobilier': 'immobilier', 'services': 'services', 'transport': 'transport',
        'vente': 'vente', 'restauration': 'restauration', 'location': 'location',
        'emploi': 'emploi', 'formation': 'formation', 'evenementiel': 'evenementiel'
      }

      const categorySlug = categoryMap[ad.category?.toLowerCase()] || 'vente'

      const categoriesSnapshot = await getDocs(query(collection(firestore, 'categories'), where('slug', '==', categorySlug), limit(1)))
      const catId = categoriesSnapshot.empty ? 'default' : categoriesSnapshot.docs[0].id

      const reclamCode = `REC-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      const adData = {
        title: ad.title || 'Sans titre',
        description: ad.description || '',
        price: ad.price || null,
        images: ad.images || [],
        city: ad.city || 'Dakar',
        phone: ad.phone || '',
        whatsapp: ad.phone || '',
        categoryId: catId,
        categorySlug,
        status: 'active',
        isPremium: false,
        isFeatured: false,
        views: 0,
        sourceUrl: ad.url || null,
        reclamCode,
        importedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const docRef = await addDoc(collection(firestore, 'ads'), adData)

      return NextResponse.json({
        success: true,
        adId: docRef.id,
        reclamCode
      })
    }

    // Action: Import en masse
    if (action === 'bulk-import') {
      if (!ads || !Array.isArray(ads)) {
        return NextResponse.json({ error: 'Liste requise' }, { status: 400 })
      }

      const results = []
      const categoryMap: Record<string, string> = {
        'immobilier': 'immobilier', 'services': 'services', 'transport': 'transport',
        'vente': 'vente', 'restauration': 'restauration', 'location': 'location',
        'emploi': 'emploi', 'formation': 'formation', 'evenementiel': 'evenementiel'
      }

      const categoriesSnapshot = await getDocs(collection(firestore, 'categories'))
      const categoryIds: Record<string, string> = {}
      categoriesSnapshot.docs.forEach(doc => {
        categoryIds[doc.data().slug] = doc.id
      })

      for (const ad of ads) {
        try {
          const categorySlug = categoryMap[ad.category?.toLowerCase()] || 'vente'
          const catId = categoryIds[categorySlug] || 'default'
          const reclamCode = `REC-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

          const adData = {
            title: ad.title || 'Sans titre',
            description: ad.description || '',
            price: ad.price || null,
            images: ad.images || [],
            city: ad.city || 'Dakar',
            phone: ad.phone || '',
            whatsapp: ad.phone || '',
            categoryId: catId,
            categorySlug,
            status: 'active',
            isPremium: false,
            isFeatured: false,
            views: 0,
            sourceUrl: ad.url || null,
            reclamCode,
            importedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          const docRef = await addDoc(collection(firestore, 'ads'), adData)
          results.push({ title: ad.title, success: true, adId: docRef.id })
        } catch {
          results.push({ title: ad.title, success: false })
        }
      }

      return NextResponse.json({
        success: true,
        totalProcessed: ads.length,
        successCount: results.filter(r => r.success).length,
        failedCount: results.filter(r => !r.success).length,
        results
      })
    }

    // Action: Chat
    if (action === 'chat') {
      const { message } = body
      const response = await callAI(message, 'Tu es l\'assistant AlloSN. Réponds en français.')
      return NextResponse.json({ success: true, response: response || 'Erreur' })
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })

  } catch (error: any) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
