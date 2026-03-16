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

// Extraire les liens d'annonces depuis une page de liste
function extractAdLinksFromListing(html: string, baseUrl: string): string[] {
  const links: Set<string> = new Set()
  const base = new URL(baseUrl)
  
  // Patterns pour les liens d'annonces - spécifiques et génériques
  const patterns = [
    // Expat-Dakar spécifique
    /href=["'](\/annonce\/[^"']+)["']/gi,
    /href=["'](\/annonces\/[^"']+\/\d+[^"']*)["']/gi,
    // Génériques
    /href=["']([^"']*\/annonce[^"']*)["']/gi,
    /href=["']([^"']*\/ad[^"']*)["']/gi,
    /href=["']([^"']*\/listing[^"']*)["']/gi,
    /href=["']([^"']*\/offer[^"']*)["']/gi,
    /href=["']([^"']*\/item[^"']*)["']/gi,
    // Data-href (certains sites l'utilisent)
    /data-href=["']([^"']+)["']/gi,
    // onclick avec URL
    /onclick=["'][^"']*window\.location=['"]([^'"]+)['"][^"']*["']/gi,
  ]

  for (const pattern of patterns) {
    const matches = html.matchAll(pattern)
    for (const match of matches) {
      let link = match[1]
      
      // Nettoyer le lien
      link = link.replace(/&amp;/g, '&')
      link = link.split('#')[0] // Enlever les ancres
      link = link.split('?')[1] ? link.split('?')[0] + '?' + link.split('?')[1] : link.split('?')[0]
      
      // Convertir en URL absolue
      if (link.startsWith('/')) {
        link = `${base.origin}${link}`
      } else if (!link.startsWith('http')) {
        link = `${base.origin}/${link}`
      }
      
      // Filtrer les liens qui ressemblent à des annonces (contiennent un ID ou un slug)
      if (link.includes('/annonce') || 
          link.includes('/ad/') || 
          link.includes('/listing') ||
          link.includes('/offer') ||
          /\d{4,}/.test(link)) { // Contient au moins 4 chiffres (probablement un ID)
        links.add(link)
      }
    }
  }

  // Filtrer les liens du même domaine ou domaines connexes
  const validLinks = Array.from(links).filter(link => {
    try {
      const linkUrl = new URL(link)
      // Accepter le même domaine ou sous-domaines
      return linkUrl.hostname.includes(base.hostname.replace('www.', '')) ||
             base.hostname.includes(linkUrl.hostname.replace('www.', ''))
    } catch {
      return false
    }
  })

  return validLinks
}

// Extraire les liens de pagination
function extractPaginationLinks(html: string, baseUrl: string): string[] {
  const links: string[] = []
  
  try {
    const url = new URL(baseUrl)
    
    // Chercher le nombre max de pages
    const pagePatterns = [
      /page[=\s]+(\d+)/gi,
      /p[=\s]+(\d+)/gi,
      /p\/(\d+)/gi,
      /page\/(\d+)/gi,
      /offset=(\d+)/gi,
    ]
    
    let maxPage = 1
    for (const pattern of pagePatterns) {
      const matches = html.matchAll(pattern)
      for (const match of matches) {
        let num = parseInt(match[1])
        if (pattern.source.includes('offset')) {
          num = Math.ceil(num / 20) // Supposons 20 items par page
        }
        if (num > maxPage) maxPage = Math.min(num, 100)
      }
    }
    
    // Chercher les liens de pagination dans le HTML
    const paginationLinkPatterns = [
      /href=["']([^"']*page[=\s]*\d+[^"']*)["']/gi,
      /href=["']([^"']*[\?&]p=\d+[^"']*)["']/gi,
      /href=["']([^"']*\/page\/\d+[^"']*)["']/gi,
    ]
    
    const foundLinks = new Set<string>()
    for (const pattern of paginationLinkPatterns) {
      const matches = html.matchAll(pattern)
      for (const match of matches) {
        let link = match[1].replace(/&amp;/g, '&')
        if (link.startsWith('/')) {
          link = `${url.origin}${link}`
        } else if (!link.startsWith('http')) {
          link = `${url.origin}/${link}`
        }
        foundLinks.add(link)
      }
    }
    
    if (foundLinks.size > 0) {
      links.push(...Array.from(foundLinks))
    } else if (maxPage > 1) {
      // Générer les URLs de pagination
      if (url.searchParams.has('page')) {
        for (let i = 1; i <= maxPage; i++) {
          const newUrl = new URL(baseUrl)
          newUrl.searchParams.set('page', i.toString())
          links.push(newUrl.toString())
        }
      } else {
        for (let i = 1; i <= maxPage; i++) {
          const newUrl = new URL(baseUrl)
          newUrl.searchParams.set('page', i.toString())
          links.push(newUrl.toString())
        }
      }
    }
    
    if (links.length === 0) {
      links.push(baseUrl)
    }
    
  } catch {
    links.push(baseUrl)
  }
  
  return [...new Set(links)]
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
    .substring(0, 15000)

  // Extraire les images
  const imageUrls: string[] = []
  const imgPatterns = [
    /<img[^>]+src=["']([^"']+\.(jpg|jpeg|png|webp|gif)[^"']*)["']/gi,
    /<img[^>]+data-src=["']([^"']+\.(jpg|jpeg|png|webp|gif)[^"']*)["']/gi,
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
      // Filtrer les images trop petites ou des placeholders
      if (!imgUrl.includes('placeholder') && 
          !imgUrl.includes('logo') && 
          !imgUrl.includes('avatar') &&
          !imgUrl.includes('icon') &&
          imgUrl.length > 20) {
        imageUrls.push(imgUrl)
      }
    }
  }

  // Utiliser l'IA pour extraire les informations structurées
  const extractionPrompt = `Tu es un expert en extraction de données d'annonces classées.

Analyse le contenu suivant d'une page d'annonce et extrait les informations:

CONTENU:
${textContent}

URL de l'annonce: ${url}

Extrait ces informations précises:
1. **title**: Le titre exact de l'annonce
2. **description**: La description complète (tout le texte descriptif)
3. **price**: Le prix en nombre SEULEMENT (ex: 150000 pour "150 000 FCFA"). Si pas de prix, mettre null.
4. **city**: La ville/localisation
5. **phone**: Le numéro de téléphone (format: 77 XXX XX XX ou 78 XXX XX XX etc). Cherche dans le logo orange, les boutons contact, les liens tel:, etc.
6. **category**: La catégorie parmi: immobilier, services, transport, vente, restauration, location, emploi, formation, evenementiel
7. **professionalName**: Le nom du professionnel/entreprise si mentionné
8. **address**: L'adresse complète si mentionnée

IMPORTANT: 
- Le téléphone est souvent caché derrière un bouton "Afficher le numéro" ou dans un logo orange à droite
- Cherche les patterns: 77, 78, 76, 70 suivi de 6 chiffres
- Si plusieurs numéros, prends le principal

Réponds UNIQUEMENT avec un JSON valide:
{
  "title": "...",
  "description": "...",
  "price": 150000,
  "city": "Dakar",
  "phone": "77 123 45 67",
  "category": "immobilier",
  "professionalName": "Agence XYZ",
  "address": "Plateau, Dakar"
}`

  const systemPrompt = 'Tu es un assistant expert en extraction de données d\'annonces. Tu réponds UNIQUEMENT avec du JSON valide, sans texte avant ou après.'

  const responseText = await callAI(extractionPrompt, systemPrompt)
  
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
        images: imageUrls.slice(0, 10), // Max 10 images
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, action, ads, maxPages, maxAds } = body

    // Action principale: Scraper toutes les annonces avec détails
    if (action === 'scrape-deep' || action === 'scrape-all') {
      if (!url) {
        return NextResponse.json({ error: 'URL requise' }, { status: 400 })
      }

      const maxPagesToScrape = maxPages || 5
      const maxAdsToScrape = maxAds || 50
      const allAds: DetailedAd[] = []
      let scrapedPages = 0
      let scrapedAds = 0
      const processedUrls = new Set<string>()

      // Étape 1: Scraper les pages de liste pour trouver les liens d'annonces
      const listingHtml = await scrapeWebPage(url)
      if (!listingHtml) {
        return NextResponse.json({ error: 'Impossible d\'accéder à la page' }, { status: 400 })
      }

      const paginationLinks = extractPaginationLinks(listingHtml, url)
      const pagesToScrape = paginationLinks.slice(0, maxPagesToScrape)

      // Étape 2: Collecter tous les liens d'annonces
      let allAdLinks: string[] = []
      
      for (const pageUrl of pagesToScrape) {
        const pageHtml = pageUrl === url ? listingHtml : await scrapeWebPage(pageUrl)
        if (!pageHtml) continue
        
        const adLinks = extractAdLinksFromListing(pageHtml, pageUrl)
        allAdLinks = [...allAdLinks, ...adLinks]
        scrapedPages++
        
        // Limiter le nombre d'annonces
        if (allAdLinks.length >= maxAdsToScrape) break
      }

      // Dédupliquer les liens
      allAdLinks = [...new Set(allAdLinks)].slice(0, maxAdsToScrape)

      // Étape 3: Scraper chaque annonce individuelle
      for (const adUrl of allAdLinks) {
        if (processedUrls.has(adUrl)) continue
        processedUrls.add(adUrl)

        try {
          const adHtml = await scrapeWebPage(adUrl)
          if (!adHtml) continue

          const adDetails = await extractAdDetails(adHtml, adUrl)
          if (adDetails && adDetails.title) {
            allAds.push(adDetails)
            scrapedAds++
          }
          
          // Petit délai pour ne pas surcharger le serveur
          await new Promise(resolve => setTimeout(resolve, 500))
          
        } catch (error) {
          console.error(`Error scraping ad ${adUrl}:`, error)
        }
      }

      return NextResponse.json({
        success: true,
        siteName: new URL(url).hostname,
        totalFound: allAds.length,
        totalPagesScraped: scrapedPages,
        totalAdLinksFound: allAdLinks.length,
        ads: allAds,
        sourceUrl: url
      })
    }

    // Action: Scraper une seule page de liste
    if (action === 'scrape') {
      if (!url) {
        return NextResponse.json({ error: 'URL requise' }, { status: 400 })
      }

      const html = await scrapeWebPage(url)
      if (!html) {
        return NextResponse.json({ error: 'Impossible de récupérer le contenu' }, { status: 400 })
      }

      const adLinks = extractAdLinksFromListing(html, url)
      const paginationLinks = extractPaginationLinks(html, url)

      // Scraper les premières annonces
      const ads: DetailedAd[] = []
      const maxAdsToScrape = Math.min(adLinks.length, 10)
      
      for (let i = 0; i < maxAdsToScrape; i++) {
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
        paginationDetected: paginationLinks.length > 1,
        totalPages: paginationLinks.length,
        allAdLinks: adLinks.slice(0, 20) // Retourner quelques liens pour debug
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
      const systemPrompt = `Tu es l'assistant IA d'AlloSN (petites annonces Sénégal).
Tu aides l'admin à importer des annonces.

Commandes disponibles:
- "scraper [URL]" - Scraper une page et extraire les annonces
- "scraper-deep [URL]" - Scraper en profondeur (entre dans chaque annonce)

Réponds en français de façon concise.`

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
