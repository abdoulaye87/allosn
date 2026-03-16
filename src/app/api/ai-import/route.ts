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
}

// Appel IA
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
        max_tokens: 3000
      })
    })

    if (!response.ok) return ''
    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  } catch {
    return ''
  }
}

// Scraper une page
async function scrapePage(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
      redirect: 'follow'
    })
    
    if (!response.ok) return ''
    return await response.text()
  } catch {
    return ''
  }
}

// Trouver TOUS les liens d'annonces
function findAllAdLinks(html: string, baseUrl: string): string[] {
  const links = new Set<string>()
  const base = new URL(baseUrl)

  // Capturer TOUS les href
  const allHrefs = html.matchAll(/href=["']([^"']+)["']/gi)
  
  for (const match of allHrefs) {
    let link = match[1]
    
    // Ignorer les liens indésirables
    const ignorePatterns = [
      /page=/i, /\/page\//i, /\?sort=/i, /\/login/i, /\/register/i,
      /\/contact/i, /\/about/i, /\/help/i, /javascript:/i, /mailto:/i, /tel:/i, /#/,
      /google/i, /facebook/i, /twitter/i, /instagram/i, /whatsapp/i,
      /\/ads\//i, /\/pub/i, /\/sponsor/i, /advert/i, /banner/i,
    ]
    
    if (ignorePatterns.some(p => p.test(link))) continue
    
    // LIENS D'ANNONCES = contiennent /annonce/ ET un ID numérique
    if (/\/annonce\//i.test(link) && /\d{4,}/.test(link)) {
      if (link.startsWith('/')) {
        link = `${base.origin}${link}`
      } else if (!link.startsWith('http')) {
        link = `${base.origin}/${link}`
      }
      links.add(link)
    }
  }

  return Array.from(links)
}

// Extraire les images
function extractImages(html: string, url: string): string[] {
  const images: string[] = []
  const base = new URL(url)
  
  const imgMatches = html.matchAll(/<img[^>]+(?:src|data-src)=["']([^"']+)["']/gi)
  for (const match of imgMatches) {
    let imgUrl = match[1]
    if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl
    else if (imgUrl.startsWith('/')) imgUrl = `${base.origin}${imgUrl}`
    
    const lower = imgUrl.toLowerCase()
    if ((lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png') || lower.includes('.webp') || lower.includes('image')) &&
        !lower.includes('logo') && !lower.includes('avatar') && !lower.includes('icon') &&
        !lower.includes('banner') && !lower.includes('pub') && !lower.includes('ad') &&
        !lower.includes('pixel') && !lower.includes('tracking')) {
      images.push(imgUrl)
    }
  }
  
  return [...new Set(images)].slice(0, 10)
}

// Extraire le contenu textuel
function getTextContent(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Extraire les détails d'une annonce - VERSION ROBUSTE
async function extractAdDetails(html: string, url: string): Promise<DetailedAd | null> {
  try {
    const textContent = getTextContent(html)
    const images = extractImages(html, url)
    
    // APPROCHE 1: Extraction directe du HTML
    let title = ''
    let description = ''
    let price: number | null = null
    let phone = ''
    let city = ''
    let category = 'vente'

    // Titre - plusieurs méthodes
    const titleMatch = 
      html.match(/<h1[^>]*>([^<]{5,200})<\/h1>/i) ||
      html.match(/<title>([^<]{5,200})<\/title>/i) ||
      html.match(/class=["'][^"']*title[^"']*["'][^>]*>([^<]{5,200})</i) ||
      html.match(/class=["'][^"']*annonce[^"']*["'][^>]*>([^<]{5,200})</i)
    
    if (titleMatch) {
      title = titleMatch[1].trim().replace(/\s+/g, ' ')
      // Nettoyer le titre (enlever le nom du site)
      title = title.split('|')[0].split('-')[0].trim()
    }

    // Prix - chercher les patterns FCFA
    const priceMatch = html.match(/(\d[\d\s\.]*)\s*(?:FCFA|CFA|F\s)/i) ||
                       html.match(/prix[^<]*[:\s]*(\d[\d\s\.]*)/i)
    if (priceMatch) {
      price = parseInt(priceMatch[1].replace(/\s/g, '').replace(/\./g, ''))
      if (isNaN(price) || price < 100) price = null
    }

    // Téléphone - chercher les numéros sénégalais
    const phonePatterns = [
      /(7[0-8][\s\.]?\d{2}[\s\.]?\d{2}[\s\.]?\d{2}[\s\.]?\d{2})/g,
      /(33[\s\.]?\d{2}[\s\.]?\d{2}[\s\.]?\d{2}[\s\.]?\d{2})/g,
      /(\+221[\s\.]?7[0-8][\s\.]?\d{2}[\s\.]?\d{2}[\s\.]?\d{2}[\s\.]?\d{2})/g,
      /(\+221[\s\.]?33[\s\.]?\d{2}[\s\.]?\d{2}[\s\.]?\d{2}[\s\.]?\d{2})/g,
    ]
    
    for (const pattern of phonePatterns) {
      const matches = textContent.matchAll(pattern)
      for (const match of matches) {
        let p = match[1].replace(/[\s\.]/g, '')
        if (p.length >= 9 && p.length <= 14) {
          phone = p
          break
        }
      }
      if (phone) break
    }

    // Ville - chercher dans le texte
    const senegalCities = ['Dakar', 'Thiès', 'Saint-Louis', 'Mbour', 'Kaolack', 'Rufisque', 'Touba', 
                           'Ziguinchor', 'Diourbel', 'Louga', 'Tambacounda', 'Kolda', 'Matam',
                           'Fatick', 'Kaffrine', 'Kédougou', 'Sédhiou', 'Podor', 'Richard Toll',
                           'Tivaouane', 'Mbao', 'Guédiawaye', 'Pikine', 'Diamniadio', 'Saly']
    
    for (const city_name of senegalCities) {
      if (textContent.toLowerCase().includes(city_name.toLowerCase())) {
        city = city_name
        break
      }
    }

    // Description - prendre un extrait du texte
    const descMatch = html.match(/class=["'][^"']*(?:description|content|detail)[^"']*["'][^>]*>([\s\S]{50,2000}?)<\/(?:div|p|span)>/i)
    if (descMatch) {
      description = descMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    }

    // Catégorie basée sur le contenu
    const lower = textContent.toLowerCase()
    if (lower.includes('appartement') || lower.includes('maison') || lower.includes('terrain') || 
        lower.includes('villa') || lower.includes('studio') || lower.includes('immobilier') ||
        lower.includes('location') || lower.includes('louer') || lower.includes('vendre')) {
      category = 'immobilier'
    } else if (lower.includes('voiture') || lower.includes('moto') || lower.includes('véhicule') || 
               lower.includes('auto') || lower.includes('camion')) {
      category = 'transport'
    } else if (lower.includes('emploi') || lower.includes('recrutement') || lower.includes('travail') ||
               lower.includes('poste') || lower.includes('candidature')) {
      category = 'emploi'
    }

    // APPROCHE 2: Si pas de titre, utiliser l'IA
    if (!title || title.length < 5) {
      const aiPrompt = `Extrait les informations de cette annonce sénégalaise:

${textContent.substring(0, 6000)}

Retourne uniquement un JSON:
{"title":"titre","description":"description","price":150000,"phone":"771234567","city":"Dakar","category":"immobilier"}`

      const aiResponse = await callAI(aiPrompt, 'Tu extrais des données. Réponds uniquement en JSON.')
      
      if (aiResponse) {
        try {
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0])
            title = data.title || title
            description = data.description || description
            price = data.price || price
            phone = data.phone || phone
            city = data.city || city
            category = data.category || category
          }
        } catch {}
      }
    }

    // Dernier recours: extraire du texte brut
    if (!title || title.length < 3) {
      // Prendre les premiers mots significatifs
      const words = textContent.split(/\s+/).filter(w => w.length > 2).slice(0, 10)
      title = words.join(' ')
    }

    // Vérification finale
    if (!title || title.length < 3) {
      return null
    }

    return {
      title: title.substring(0, 200),
      description: description.substring(0, 2000),
      price,
      city,
      phone,
      images,
      category,
      url
    }
  } catch (error) {
    console.error('Error in extractAdDetails:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, action, ads, maxAds } = body

    // SCRAPE DEEP
    if (action === 'scrape-deep' || action === 'scrape-all') {
      if (!url) {
        return NextResponse.json({ error: 'URL requise' }, { status: 400 })
      }

      const limit = maxAds || 50
      const allAds: DetailedAd[] = []
      const processed = new Set<string>()

      console.log(`📄 Scraping: ${url}`)
      
      const listingHtml = await scrapePage(url)
      if (!listingHtml) {
        return NextResponse.json({ error: 'Impossible d\'accéder à la page' }, { status: 400 })
      }

      // Trouver les liens
      let adLinks = findAllAdLinks(listingHtml, url)
      console.log(`🔗 ${adLinks.length} liens trouvés`)

      adLinks = adLinks.slice(0, limit)
      console.log(`🎯 ${adLinks.length} liens à scraper`)

      // Scraper chaque annonce
      for (let i = 0; i < adLinks.length; i++) {
        const adUrl = adLinks[i]
        
        if (processed.has(adUrl)) continue
        processed.add(adUrl)

        console.log(`📍 [${i + 1}/${adLinks.length}] ${adUrl}`)

        const adHtml = await scrapePage(adUrl)
        if (!adHtml) {
          console.log(`   ❌ Page non accessible`)
          continue
        }

        const adDetails = await extractAdDetails(adHtml, adUrl)
        if (adDetails) {
          allAds.push(adDetails)
          console.log(`   ✅ ${adDetails.title.substring(0, 50)}...`)
        } else {
          console.log(`   ❌ Extraction échouée`)
        }

        await new Promise(r => setTimeout(r, 100))
      }

      console.log(`\n✅ TOTAL: ${allAds.length} annonces`)

      return NextResponse.json({
        success: true,
        siteName: new URL(url).hostname,
        totalFound: allAds.length,
        totalLinksFound: adLinks.length,
        ads: allAds,
        sourceUrl: url
      })
    }

    // SCRAPE SIMPLE
    if (action === 'scrape') {
      if (!url) {
        return NextResponse.json({ error: 'URL requise' }, { status: 400 })
      }

      const html = await scrapePage(url)
      if (!html) {
        return NextResponse.json({ error: 'Impossible de récupérer' }, { status: 400 })
      }

      const adLinks = findAllAdLinks(html, url).slice(0, 10)
      const ads: DetailedAd[] = []

      for (const adUrl of adLinks) {
        const adHtml = await scrapePage(adUrl)
        if (adHtml) {
          const details = await extractAdDetails(adHtml, adUrl)
          if (details) ads.push(details)
        }
        await new Promise(r => setTimeout(r, 100))
      }

      return NextResponse.json({
        success: true,
        siteName: new URL(url).hostname,
        totalFound: ads.length,
        totalLinksFound: adLinks.length,
        ads,
        sourceUrl: url,
        allAdLinks: adLinks
      })
    }

    // CREATE AD
    if (action === 'create-ad') {
      const { ad } = body
      
      const categoryMap: Record<string, string> = {
        'immobilier': 'immobilier', 'services': 'services', 'transport': 'transport',
        'vente': 'vente', 'restauration': 'restauration', 'location': 'location',
        'emploi': 'emploi', 'formation': 'formation', 'evenementiel': 'evenementiel'
      }

      const slug = categoryMap[ad.category?.toLowerCase()] || 'vente'
      const cats = await getDocs(query(collection(firestore, 'categories'), where('slug', '==', slug), limit(1)))
      const catId = cats.empty ? 'default' : cats.docs[0].id

      const reclamCode = `REC-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      const docRef = await addDoc(collection(firestore, 'ads'), {
        title: ad.title,
        description: ad.description || '',
        price: ad.price || null,
        images: ad.images || [],
        city: ad.city || 'Dakar',
        phone: ad.phone || '',
        whatsapp: ad.phone || '',
        categoryId: catId,
        categorySlug: slug,
        status: 'active',
        isPremium: false,
        isFeatured: false,
        views: 0,
        sourceUrl: ad.url || null,
        reclamCode,
        importedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      return NextResponse.json({ success: true, adId: docRef.id, reclamCode })
    }

    // BULK IMPORT
    if (action === 'bulk-import') {
      if (!ads) return NextResponse.json({ error: 'Liste requise' }, { status: 400 })

      const results = []
      const categoryMap: Record<string, string> = {
        'immobilier': 'immobilier', 'services': 'services', 'transport': 'transport',
        'vente': 'vente', 'restauration': 'restauration', 'location': 'location',
        'emploi': 'emploi', 'formation': 'formation', 'evenementiel': 'evenementiel'
      }

      const cats = await getDocs(collection(firestore, 'categories'))
      const catIds: Record<string, string> = {}
      cats.docs.forEach(d => { catIds[d.data().slug] = d.id })

      for (const ad of ads) {
        try {
          const slug = categoryMap[ad.category?.toLowerCase()] || 'vente'
          const reclamCode = `REC-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

          const docRef = await addDoc(collection(firestore, 'ads'), {
            title: ad.title,
            description: ad.description || '',
            price: ad.price || null,
            images: ad.images || [],
            city: ad.city || 'Dakar',
            phone: ad.phone || '',
            whatsapp: ad.phone || '',
            categoryId: catIds[slug] || 'default',
            categorySlug: slug,
            status: 'active',
            isPremium: false,
            isFeatured: false,
            views: 0,
            sourceUrl: ad.url || null,
            reclamCode,
            importedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
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

    // CHAT
    if (action === 'chat') {
      const { message } = body
      const response = await callAI(message, 'Tu es l\'assistant AlloSN.')
      return NextResponse.json({ success: true, response: response || 'Erreur' })
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })

  } catch (error: any) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
