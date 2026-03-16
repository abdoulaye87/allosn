import { NextRequest, NextResponse } from 'next/server'
import { firestore } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, where, limit } from 'firebase/firestore'

interface ScrapedAd {
  title: string
  description: string
  price: number | null
  city: string
  phone: string
  images: string[]
  category: string
  url?: string
}

// Fonction pour appeler l'IA via OpenAI
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

// Scrapper une page web avec gestion des headers
async function scrapeWebPage(url: string): Promise<{ content: string; finalUrl: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      redirect: 'follow'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const html = await response.text()
    return { content: html, finalUrl: response.url || url }
  } catch (error: any) {
    console.error('Scrape error:', error)
    return { content: '', finalUrl: url }
  }
}

// Extraire les liens de pagination
function extractPaginationLinks(html: string, baseUrl: string): string[] {
  const links: string[] = []
  
  // Patterns de pagination courants
  const patterns = [
    /href=["']([^"']*page[=\/]\d+[^"']*)["']/gi,
    /href=["']([^"']*p[=\/]\d+[^"']*)["']/gi,
    /href=["']([^"']*\d+[^"']*)["']/gi,
    /href=["']([^"']*pagination[^"']*)["']/gi,
  ]

  // Chercher les liens de pagination
  const paginationPatterns = [
    /page\s*(\d+)/gi,
    /p=(\d+)/gi,
    /p\/(\d+)/gi,
    /page\/(\d+)/gi,
    /offset=(\d+)/gi,
  ]

  // Extraire le nombre max de pages
  let maxPage = 1
  for (const pattern of paginationPatterns) {
    const matches = html.matchAll(pattern)
    for (const match of matches) {
      const pageNum = parseInt(match[1])
      if (pageNum > maxPage) maxPage = Math.min(pageNum, 50) // Limite à 50 pages
    }
  }

  // Générer les URLs de pagination
  try {
    const url = new URL(baseUrl)
    
    // Détecter le type de pagination
    if (url.searchParams.has('page')) {
      for (let i = 1; i <= maxPage; i++) {
        url.searchParams.set('page', i.toString())
        links.push(url.toString())
      }
    } else if (url.searchParams.has('p')) {
      for (let i = 1; i <= maxPage; i++) {
        url.searchParams.set('p', i.toString())
        links.push(url.toString())
      }
    } else if (url.pathname.includes('/page/')) {
      const basePath = url.pathname.replace(/\/page\/\d+/, '')
      for (let i = 1; i <= maxPage; i++) {
        url.pathname = `${basePath}/page/${i}`
        links.push(url.toString())
      }
    } else if (url.pathname.includes('/p-')) {
      const basePath = url.pathname.replace(/\/p-\d+/, '')
      for (let i = 1; i <= maxPage; i++) {
        url.pathname = `${basePath}/p-${i}`
        links.push(url.toString())
      }
    } else {
      // Pagination par paramètre 'page' par défaut
      for (let i = 1; i <= maxPage; i++) {
        url.searchParams.set('page', i.toString())
        links.push(url.toString())
      }
    }
  } catch {
    // Si erreur, retourner seulement l'URL de base
    links.push(baseUrl)
  }

  // Dédupliquer
  return [...new Set(links)]
}

// Extraire les liens d'annonces individuelles
function extractAdLinks(html: string, baseUrl: string): string[] {
  const links: string[] = []
  const base = new URL(baseUrl)
  
  // Patterns pour les liens d'annonces
  const patterns = [
    /href=["']([^"']*\/annonce[^"']*)["']/gi,
    /href=["']([^"']*\/ad[^"']*)["']/gi,
    /href=["']([^"']*\/item[^"']*)["']/gi,
    /href=["']([^"']*\/listing[^"']*)["']/gi,
    /href=["']([^"']*\/product[^"']*)["']/gi,
    /href=["']([^"']*\/detail[^"']*)["']/gi,
    /href=["']([^"']*\/offer[^"']*)["']/gi,
  ]

  for (const pattern of patterns) {
    const matches = html.matchAll(pattern)
    for (const match of matches) {
      let link = match[1]
      
      // Convertir en URL absolue
      if (link.startsWith('/')) {
        link = `${base.origin}${link}`
      } else if (!link.startsWith('http')) {
        link = `${base.origin}/${link}`
      }
      
      // Filtrer les liens valides
      if (link.includes(base.hostname) || base.hostname.includes(new URL(link).hostname)) {
        links.push(link)
      }
    }
  }

  return [...new Set(links)]
}

// Extraire le texte du HTML
function extractTextFromHTML(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .substring(0, 20000)
}

// Extraire les données structurées (JSON-LD)
function extractStructuredData(html: string): any[] {
  const structuredData: any[] = []
  const jsonLdPattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  
  const matches = html.matchAll(jsonLdPattern)
  for (const match of matches) {
    try {
      const data = JSON.parse(match[1])
      structuredData.push(data)
    } catch {}
  }
  
  return structuredData
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, action, ads, categoryId, maxPages, scrapeAll } = body

    // Action 1: Scraper TOUTES les pages avec pagination
    if (action === 'scrape-all') {
      if (!url) {
        return NextResponse.json({ error: 'URL requise' }, { status: 400 })
      }

      const maxPagesToScrape = maxPages || 10
      let allAds: ScrapedAd[] = []
      let scrapedPages = 0
      let siteName = 'Site externe'

      // 1. Scraper la première page pour détecter la pagination
      const { content: firstPageHtml, finalUrl } = await scrapeWebPage(url)
      
      if (!firstPageHtml) {
        return NextResponse.json({ error: 'Impossible d\'accéder à la page' }, { status: 400 })
      }

      // Extraire les liens de pagination
      const paginationLinks = extractPaginationLinks(firstPageHtml, finalUrl)
      const pagesToScrape = paginationLinks.slice(0, maxPagesToScrape)

      // 2. Scraper chaque page
      for (let i = 0; i < pagesToScrape.length; i++) {
        const pageUrl = pagesToScrape[i]
        
        try {
          const { content: pageHtml } = i === 0 ? { content: firstPageHtml } : await scrapeWebPage(pageUrl)
          
          if (!pageHtml) continue

          const textContent = extractTextFromHTML(pageHtml)
          const structuredData = extractStructuredData(pageHtml)

          // Utiliser l'IA pour extraire les annonces de cette page
          const extractionPrompt = `Tu es un expert en extraction de données d'annonces classées.

Analyse le contenu suivant d'une page d'annonces et extrait TOUTES les annonces présentes.

Pour chaque annonce, extrait:
- title: le titre de l'annonce
- description: la description complète
- price: le prix en nombre (sans devise)
- city: la ville/localisation
- phone: le numéro de téléphone
- images: liste des URLs des images (tableau)
- category: catégorie parmi: immobilier, services, transport, vente, restauration, location, emploi, formation, evenementiel
- url: URL de l'annonce si disponible

Contenu de la page:
${textContent}

Données structurées: ${JSON.stringify(structuredData).substring(0, 2000)}

Réponds UNIQUEMENT avec un JSON valide:
{
  "ads": [...],
  "siteName": "nom du site",
  "totalFound": 10
}`

          const systemPrompt = 'Tu es un assistant expert en extraction de données. Tu réponds UNIQUEMENT avec du JSON valide, sans texte supplémentaire.'

          const responseText = await callAI(extractionPrompt, systemPrompt)

          if (responseText) {
            try {
              const jsonMatch = responseText.match(/\{[\s\S]*\}/)
              if (jsonMatch) {
                const data = JSON.parse(jsonMatch[0])
                if (data.ads && Array.isArray(data.ads)) {
                  // Ajouter l'URL source à chaque annonce
                  const adsWithUrl = data.ads.map((ad: ScrapedAd) => ({ ...ad, sourcePage: pageUrl }))
                  allAds = [...allAds, ...adsWithUrl]
                  siteName = data.siteName || siteName
                }
              }
            } catch (e) {
              console.error('Parse error:', e)
            }
          }

          scrapedPages++
          
        } catch (error) {
          console.error(`Error scraping page ${i + 1}:`, error)
        }
      }

      // Dédupliquer par titre
      const uniqueAds = allAds.filter((ad, index, self) =>
        index === self.findIndex(a => a.title === ad.title)
      )

      return NextResponse.json({
        success: true,
        siteName,
        totalFound: uniqueAds.length,
        totalPagesScraped: scrapedPages,
        ads: uniqueAds,
        sourceUrl: url
      })
    }

    // Action 2: Scraper une seule page
    if (action === 'scrape') {
      if (!url) {
        return NextResponse.json({ error: 'URL requise' }, { status: 400 })
      }

      const { content: html, finalUrl } = await scrapeWebPage(url)
      
      if (!html) {
        return NextResponse.json({ error: 'Impossible de récupérer le contenu' }, { status: 400 })
      }

      const textContent = extractTextFromHTML(html)
      const structuredData = extractStructuredData(html)
      const paginationLinks = extractPaginationLinks(html, finalUrl)

      const extractionPrompt = `Tu es un expert en extraction de données d'annonces.

Analyse ce contenu et extrait TOUTES les annonces:
${textContent}

Pour chaque annonce: title, description, price (nombre), city, phone, images (array), category.

JSON uniquement:
{"ads": [...], "siteName": "...", "totalFound": N}`

      const responseText = await callAI(extractionPrompt, 'Tu réponds uniquement en JSON valide.')

      let extractedData = { ads: [], siteName: 'Site externe', totalFound: 0 }
      
      if (responseText) {
        try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            extractedData = JSON.parse(jsonMatch[0])
          }
        } catch {}
      }

      return NextResponse.json({
        success: true,
        siteName: extractedData.siteName || 'Site externe',
        totalFound: extractedData.ads?.length || 0,
        ads: extractedData.ads || [],
        sourceUrl: url,
        paginationDetected: paginationLinks.length > 1,
        totalPages: paginationLinks.length
      })
    }

    // Action 3: Créer une annonce
    if (action === 'create-ad') {
      const { ad, sourceUrl } = body
      
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
        sourceUrl: sourceUrl || null,
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

    // Action 4: Import en masse
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
            sourceUrl: body.sourceUrl || null,
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

    // Action 5: Chat
    if (action === 'chat') {
      const { message } = body
      const systemPrompt = `Tu es l'assistant IA d'AlloSN (petites annonces Sénégal).
Tu aides l'admin à importer des annonces, analyser des pages, créer des annonces.
Réponds en français de façon concise.
Commandes: "scraper [URL]" pour une page, "scraper-all [URL]" pour toutes les pages.`

      const response = await callAI(message, systemPrompt)
      
      return NextResponse.json({
        success: true,
        response: response || 'Erreur de traitement'
      })
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })

  } catch (error: any) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
