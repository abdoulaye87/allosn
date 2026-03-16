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
        max_tokens: 8000
      })
    })

    if (!response.ok) {
      throw new Error('AI API error')
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
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
      },
      redirect: 'follow'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    return await response.text()
  } catch (error: any) {
    console.error('Scrape error:', error)
    return ''
  }
}

// Extraire les liens d'annonces - AMÉLIORÉ pour expat-dakar.com
function extractAdLinksFromListing(html: string, baseUrl: string): string[] {
  const links: Set<string> = new Set()
  const base = new URL(baseUrl)
  
  console.log('Extracting ad links from:', baseUrl)

  // Patterns spécifiques pour expat-dakar.com
  const expatPatterns = [
    // Format: /annonce/titre-id
    /href=["'](\/annonce\/[^"']+)["']/gi,
    // Format: href=".../annonces/..." (pas les pages de liste)
    /href=["']([^"']*\/annonce\/[^"']+\d{4,}[^"']*)["']/gi,
    // Format avec ID numérique
    /href=["']([^"']*-\d{5,}[^"']*)["']/gi,
    // Format data-href
    /data-href=["'](\/annonce\/[^"']+)["']/gi,
    // Format onclick
    /onclick=["'][^"']*location\.href=['"]([^'"]+)['"]/gi,
  ]

  // Patterns génériques
  const genericPatterns = [
    /href=["']([^"']*\/annonce[^"']*)["']/gi,
    /href=["']([^"']*\/ad[^"']*)["']/gi,
    /href=["']([^"']*\/listing[^"']*)["']/gi,
    /href=["']([^"']*\/offer[^"']*)["']/gi,
    /href=["']([^"']*\/item[^"']*)["']/gi,
    /href=["']([^"']*\/detail[^"']*)["']/gi,
  ]

  // Combiner tous les patterns
  const allPatterns = [...expatPatterns, ...genericPatterns]

  for (const pattern of allPatterns) {
    try {
      const matches = html.matchAll(pattern)
      for (const match of matches) {
        let link = match[1]
        
        // Nettoyer le lien
        link = link.replace(/&amp;/g, '&')
        link = link.split('#')[0]
        
        // Ignorer les liens de navigation/pagination
        if (link.includes('page=') || 
            link.includes('/page/') ||
            link.includes('?sort=') ||
            link.includes('/login') ||
            link.includes('/register') ||
            link.includes('/contact') ||
            link.length < 10) {
          continue
        }
        
        // Convertir en URL absolue
        if (link.startsWith('/')) {
          link = `${base.origin}${link}`
        } else if (!link.startsWith('http')) {
          link = `${base.origin}/${link}`
        }
        
        // Vérifier que c'est bien un lien d'annonce (contient un ID ou un slug long)
        const isAdLink = 
          link.includes('/annonce') ||
          link.includes('/ad/') ||
          link.includes('/listing') ||
          link.includes('/offer') ||
          link.includes('/item') ||
          link.includes('/detail') ||
          /-\d{5,}/.test(link) || // ID numérique dans l'URL
          /\/\d{5,}/.test(link)   // ID numérique à la fin
          
        if (isAdLink) {
          links.add(link)
        }
      }
    } catch (e) {
      console.error('Pattern error:', e)
    }
  }

  // Si on n'a pas trouvé de liens, essayer d'extraire avec l'IA
  if (links.size === 0) {
    console.log('No links found with patterns, will try AI extraction')
  }

  console.log(`Found ${links.size} unique ad links`)
  return Array.from(links)
}

// Extraire les détails d'une annonce individuelle
async function extractAdDetails(html: string, url: string): Promise<DetailedAd | null> {
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .substring(0, 20000)

  // Extraire les images
  const imageUrls: string[] = []
  const imgPatterns = [
    /<img[^>]+src=["']([^"']+\.(jpg|jpeg|png|webp|gif)[^"']*)["']/gi,
    /<img[^>]+data-src=["']([^"']+\.(jpg|jpeg|png|webp|gif)[^"']*)["']/gi,
    /data-lazy-src=["']([^"']+\.(jpg|jpeg|png|webp|gif)[^"']*)["']/gi,
    /background-image:\s*url\(["']?([^"')]+)["']?\)/gi,
  ]
  
  for (const pattern of imgPatterns) {
    const matches = html.matchAll(pattern)
    for (const match of matches) {
      let imgUrl = match[1]
      if (imgUrl.startsWith('//')) {
        imgUrl = 'https:' + imgUrl
      } else if (imgUrl.startsWith('/')) {
        try {
          const baseUrl = new URL(url)
          imgUrl = `${baseUrl.origin}${imgUrl}`
        } catch {}
      }
      // Filtrer les images non pertinentes
      if (!imgUrl.includes('placeholder') && 
          !imgUrl.includes('logo') && 
          !imgUrl.includes('avatar') &&
          !imgUrl.includes('icon') &&
          !imgUrl.includes('banner') &&
          !imgUrl.includes('pub') &&
          !imgUrl.includes('ads/') &&
          imgUrl.length > 20) {
        imageUrls.push(imgUrl)
      }
    }
  }

  // Utiliser l'IA pour extraire les informations
  const extractionPrompt = `Tu es un expert en extraction de données d'annonces classées sénégalaises.

Analyse ce contenu d'annonce et extrait les informations:

CONTENU:
${textContent}

URL: ${url}

Extrait précisément:
1. **title**: Le titre exact
2. **description**: Description complète
3. **price**: Prix en NOMBRE SEUL (ex: 150000). Si pas de prix, null.
4. **city**: Ville (Dakar, Thiès, Saint-Louis, etc.)
5. **phone**: Numéro de téléphone (format: 77/78/76/70 XXX XX XX). Cherche partout, même dans les boutons.
6. **category**: Catégorie: immobilier, services, transport, vente, restauration, location, emploi, formation, evenementiel
7. **professionalName**: Nom de l'annonceur/agence
8. **address**: Adresse précise

IMPORTANT: Le téléphone est souvent caché. Cherche les patterns 77/78/76/70 suivis de 6 chiffres.

JSON uniquement:
{"title":"...","description":"...","price":N,"city":"...","phone":"...","category":"...","professionalName":"...","address":"..."}`

  const responseText = await callAI(extractionPrompt, 'Tu extrais des données d\'annonces. Réponds UNIQUEMENT en JSON valide.')
  
  if (!responseText) {
    return null
  }

  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0])
      
      return {
        title: data.title || 'Sans titre',
        description: data.description || '',
        price: data.price || null,
        city: data.city || '',
        phone: data.phone || '',
        images: [...new Set(imageUrls)].slice(0, 10),
        category: data.category || 'vente',
        url: url,
        professionalName: data.professionalName || '',
        address: data.address || ''
      }
    }
  } catch (e) {
    console.error('Parse error:', e)
  }
  
  return null
}

// Extraire les liens avec l'IA si les patterns échouent
async function extractLinksUsingAI(html: string, baseUrl: string): Promise<string[]> {
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .substring(0, 15000)

  const prompt = `Analyse ce contenu HTML et trouve TOUS les liens vers des annonces individuelles.

Contenu de la page: ${textContent}
URL de base: ${baseUrl}

Retourne un JSON avec tous les liens d'annonces trouvés:
{"links": ["url1", "url2", ...]}

Les liens doivent être des URLs complètes vers des annonces individuelles (pas des pages de liste).`

  const response = await callAI(prompt, 'Tu extrais des URLs. Réponds en JSON uniquement.')
  
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0])
      return data.links || []
    }
  } catch {}
  
  return []
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, action, ads, maxPages, maxAds } = body

    // Action principale: Scraper avec entrée dans chaque annonce
    if (action === 'scrape-deep' || action === 'scrape-all') {
      if (!url) {
        return NextResponse.json({ error: 'URL requise' }, { status: 400 })
      }

      const maxPagesToScrape = maxPages || 5
      const maxAdsToScrape = maxAds || 30
      const allAds: DetailedAd[] = []
      let scrapedPages = 0
      const processedUrls = new Set<string>()
      let allAdLinks: string[] = []

      // Étape 1: Scraper la page de liste
      const listingHtml = await scrapeWebPage(url)
      if (!listingHtml) {
        return NextResponse.json({ error: 'Impossible d\'accéder à la page' }, { status: 400 })
      }

      // Extraire les liens d'annonces
      allAdLinks = extractAdLinksFromListing(listingHtml, url)

      // Si pas de liens trouvés, essayer avec l'IA
      if (allAdLinks.length === 0) {
        console.log('Trying AI link extraction...')
        allAdLinks = await extractLinksUsingAI(listingHtml, url)
      }

      // Dédupliquer et limiter
      allAdLinks = [...new Set(allAdLinks)].slice(0, maxAdsToScrape)

      console.log(`Total unique ad links to scrape: ${allAdLinks.length}`)

      // Étape 2: Scraper chaque annonce individuelle
      for (let i = 0; i < allAdLinks.length; i++) {
        const adUrl = allAdLinks[i]
        
        if (processedUrls.has(adUrl)) continue
        processedUrls.add(adUrl)

        console.log(`Scraping ad ${i + 1}/${allAdLinks.length}: ${adUrl}`)

        try {
          const adHtml = await scrapeWebPage(adUrl)
          if (!adHtml) continue

          const adDetails = await extractAdDetails(adHtml, adUrl)
          if (adDetails && adDetails.title && adDetails.title !== 'Sans titre') {
            allAds.push(adDetails)
            console.log(`Successfully extracted: ${adDetails.title}`)
          }
          
          // Petit délai
          await new Promise(resolve => setTimeout(resolve, 300))
          
        } catch (error) {
          console.error(`Error scraping ad ${adUrl}:`, error)
        }
      }

      scrapedPages = 1

      return NextResponse.json({
        success: true,
        siteName: new URL(url).hostname,
        totalFound: allAds.length,
        totalPagesScraped: scrapedPages,
        totalAdLinksFound: allAdLinks.length,
        ads: allAds,
        sourceUrl: url,
        debug: {
          linksFound: allAdLinks.slice(0, 5)
        }
      })
    }

    // Action: Scraper simple
    if (action === 'scrape') {
      if (!url) {
        return NextResponse.json({ error: 'URL requise' }, { status: 400 })
      }

      const html = await scrapeWebPage(url)
      if (!html) {
        return NextResponse.json({ error: 'Impossible de récupérer le contenu' }, { status: 400 })
      }

      let adLinks = extractAdLinksFromListing(html, url)
      
      // Fallback IA
      if (adLinks.length === 0) {
        adLinks = await extractLinksUsingAI(html, url)
      }

      // Scraper quelques annonces
      const ads: DetailedAd[] = []
      const maxToScrape = Math.min(adLinks.length, 5)
      
      for (let i = 0; i < maxToScrape; i++) {
        try {
          const adHtml = await scrapeWebPage(adLinks[i])
          if (adHtml) {
            const adDetails = await extractAdDetails(adHtml, adLinks[i])
            if (adDetails) {
              ads.push(adDetails)
            }
          }
          await new Promise(resolve => setTimeout(resolve, 300))
        } catch (error) {
          console.error('Error:', error)
        }
      }

      return NextResponse.json({
        success: true,
        siteName: new URL(url).hostname,
        totalFound: ads.length,
        totalLinksFound: adLinks.length,
        ads: ads,
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
        professionalName: ad.professionalName || null,
        address: ad.address || null,
        reclamCode,
        importedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const docRef = await addDoc(collection(firestore, 'ads'), adData)

      return NextResponse.json({
        success: true,
        adId: docRef.id,
        reclamCode,
        message: 'Annonce créée'
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
            professionalName: ad.professionalName || null,
            address: ad.address || null,
            reclamCode,
            importedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          const docRef = await addDoc(collection(firestore, 'ads'), adData)
          results.push({ title: ad.title, success: true, adId: docRef.id })
        } catch (error) {
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
      const systemPrompt = `Tu es l'assistant IA d'AlloSN. Tu aides à importer des annonces.
Commandes: "scraper-deep [URL]" pour un scraping complet.`

      const response = await callAI(message, systemPrompt)
      
      return NextResponse.json({
        success: true,
        response: response || 'Erreur'
      })
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })

  } catch (error: any) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
