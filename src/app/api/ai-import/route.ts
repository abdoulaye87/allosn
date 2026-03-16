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
        max_tokens: 4000
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

// Trouver TOUS les liens d'annonces sur la page de liste
function findAllAdLinks(html: string, baseUrl: string): string[] {
  const links = new Set<string>()
  const base = new URL(baseUrl)

  // APPROCHE 1: Regex simples pour les liens
  // Capture tous les href
  const allHrefs = html.matchAll(/href=["']([^"']+)["']/gi)
  
  for (const match of allHrefs) {
    let link = match[1]
    
    // Ignorer les liens de navigation, pagination, etc.
    const ignorePatterns = [
      /page=/i, /\/page\//i, /\?sort=/i, /\/login/i, /\/register/i,
      /\/contact/i, /\/about/i, /\/help/i, /\/terms/i, /\/privacy/i,
      /javascript:/i, /mailto:/i, /tel:/i, /#/, /\?filter=/i,
      /google/i, /facebook/i, /twitter/i, /instagram/i, /whatsapp/i,
      /\/ads\//i, /\/pub/i, /\/sponsor/i, /advert/i, /banner/i,
    ]
    
    if (ignorePatterns.some(p => p.test(link))) continue
    
    // Chercher les liens qui ressemblent à des annonces
    // Pattern pour expat-dakar: /annonce/titre-id
    const isAdLink = 
      /\/annonce\//i.test(link) ||
      /-\d{5,}/.test(link) || // ID numérique dans l'URL
      /\/ad\//i.test(link) ||
      /\/listing\//i.test(link) ||
      /\/offer\//i.test(link) ||
      /\/item\//i.test(link)
    
    // Ignorer les liens de liste (pas des annonces individuelles)
    const isListPage = 
      /\/annonces\?/i.test(link) ||
      /\/annonces\/?$/i.test(link) ||
      link === '/' ||
      link === baseUrl ||
      link.length < 15
    
    if (isAdLink && !isListPage) {
      // Convertir en URL absolue
      if (link.startsWith('/')) {
        link = `${base.origin}${link}`
      } else if (!link.startsWith('http')) {
        link = `${base.origin}/${link}`
      }
      
      // Vérifier que c'est bien une annonce (contient un ID)
      if (/\d{4,}/.test(link)) {
        links.add(link)
      }
    }
  }

  // APPROCHE 2: Chercher dans les structures HTML spécifiques
  // Pour expat-dakar, les annonces sont souvent dans des div avec des classes spécifiques
  
  // Chercher les liens dans les conteneurs d'annonces (pas de pub)
  const adContainerPatterns = [
    /<div[^>]*class=["'][^"']*annonce[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
    /<div[^>]*class=["'][^"']*listing[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
    /<div[^>]*class=["'][^"']*item[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
    /<article[^>]*>([\s\S]*?)<\/article>/gi,
  ]
  
  for (const pattern of adContainerPatterns) {
    const containers = html.matchAll(pattern)
    for (const container of containers) {
      const containerHtml = container[1]
      const hrefMatches = containerHtml.matchAll(/href=["']([^"']+)["']/gi)
      for (const hrefMatch of hrefMatches) {
        let link = hrefMatch[1]
        if (link.startsWith('/')) {
          link = `${base.origin}${link}`
        }
        if (/\/annonce\//i.test(link) || /\d{5,}/.test(link)) {
          links.add(link)
        }
      }
    }
  }

  return Array.from(links)
}

// Filtrer les publicités dans le contenu
function filterAdsFromContent(html: string): string {
  // Supprimer les blocs de publicité
  const adPatterns = [
    /<div[^>]*class=["'][^"']*(?:ad|ads|pub|sponsor|banner|promo)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,
    /<aside[^>]*>[\s\S]*?<\/aside>/gi,
    /<div[^>]*id=["'][^"']*(?:ad|ads|pub|sidebar)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /<style[^>]*>[\s\S]*?<\/style>/gi,
    /<!--[\s\S]*?-->/g,
  ]
  
  let cleanHtml = html
  for (const pattern of adPatterns) {
    cleanHtml = cleanHtml.replace(pattern, '')
  }
  return cleanHtml
}

// Extraire les détails d'une annonce individuelle
async function extractAdDetails(html: string, url: string): Promise<DetailedAd | null> {
  // Filtrer les pub
  const cleanHtml = filterAdsFromContent(html)
  
  // Texte brut pour l'IA
  const textContent = cleanHtml
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Extraire les images
  const images: string[] = []
  const base = new URL(url)
  const imgMatches = html.matchAll(/<img[^>]+(?:src|data-src)=["']([^"']+)["']/gi)
  for (const match of imgMatches) {
    let imgUrl = match[1]
    if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl
    else if (imgUrl.startsWith('/')) imgUrl = `${base.origin}${imgUrl}`
    
    const lower = imgUrl.toLowerCase()
    if ((lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png') || lower.includes('.webp')) &&
        !lower.includes('logo') && !lower.includes('avatar') && !lower.includes('icon') &&
        !lower.includes('banner') && !lower.includes('pub') && !lower.includes('ad')) {
      images.push(imgUrl)
    }
  }

  // Utiliser l'IA pour extraire les infos
  const prompt = `Tu es un expert en extraction de données d'annonces sénégalaises.

Analyse cette annonce et extrait les informations:

${textContent.substring(0, 8000)}

URL: ${url}

IMPORTANT:
- Le téléphone peut être caché derrière un bouton "Afficher le numéro". Cherche les patterns: 77, 78, 76, 70, 33 suivis de 6-7 chiffres
- Le prix est en FCFA, extrait le nombre uniquement
- Ignore les publicités

Retourne un JSON uniquement:
{"title":"...","description":"...","price":150000,"city":"Dakar","phone":"771234567","category":"immobilier"}`

  const response = await callAI(prompt, 'Tu extrais des données d\'annonces. Réponds uniquement en JSON valide.')

  if (!response) return null

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null
    
    const data = JSON.parse(jsonMatch[0])
    
    if (!data.title || data.title.length < 3) return null

    return {
      title: data.title,
      description: data.description || '',
      price: data.price || null,
      city: data.city || '',
      phone: data.phone || '',
      images: [...new Set(images)].slice(0, 8),
      category: data.category || 'vente',
      url
    }
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, action, ads, maxAds } = body

    // SCRAPE DEEP - Entrer dans chaque annonce
    if (action === 'scrape-deep' || action === 'scrape-all') {
      if (!url) {
        return NextResponse.json({ error: 'URL requise' }, { status: 400 })
      }

      const limit = maxAds || 50 // Augmenté à 50 par défaut
      const allAds: DetailedAd[] = []
      const processed = new Set<string>()

      // 1. Scraper la page de liste
      console.log(`📄 Scraping page de liste: ${url}`)
      const listingHtml = await scrapePage(url)
      
      if (!listingHtml) {
        return NextResponse.json({ error: 'Impossible d\'accéder à la page' }, { status: 400 })
      }

      // 2. Trouver TOUS les liens d'annonces
      let adLinks = findAllAdLinks(listingHtml, url)
      console.log(`🔗 ${adLinks.length} liens d'annonces trouvés`)

      // 3. Si pas assez de liens, utiliser l'IA pour en trouver plus
      if (adLinks.length < 5) {
        const text = listingHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 10000)
        const aiPrompt = `Trouve tous les liens vers des annonces individuelles dans ce contenu.
Ignore les publicités et les liens de navigation.
Retourne un JSON: {"links": ["url1", "url2", ...]}

Contenu: ${text}
URL de base: ${url}`
        
        const aiResponse = await callAI(aiPrompt, 'JSON uniquement.')
        try {
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0])
            if (data.links) {
              const base = new URL(url)
              const aiLinks = data.links.map((l: string) => {
                if (l.startsWith('/')) return `${base.origin}${l}`
                return l
              })
              adLinks = [...new Set([...adLinks, ...aiLinks])]
            }
          }
        } catch {}
      }

      // 4. Limiter le nombre
      adLinks = adLinks.slice(0, limit)
      console.log(`🎯 ${adLinks.length} liens à scraper`)

      // 5. Entrer dans CHAQUE annonce
      for (let i = 0; i < adLinks.length; i++) {
        const adUrl = adLinks[i]
        
        if (processed.has(adUrl)) continue
        processed.add(adUrl)

        console.log(`📍 [${i + 1}/${adLinks.length}] Scraping: ${adUrl}`)

        const adHtml = await scrapePage(adUrl)
        if (!adHtml) {
          console.log(`   ❌ Impossible de charger`)
          continue
        }

        const adDetails = await extractAdDetails(adHtml, adUrl)
        if (adDetails) {
          allAds.push(adDetails)
          console.log(`   ✅ ${adDetails.title}`)
        } else {
          console.log(`   ❌ Extraction échouée`)
        }

        // Petit délai
        await new Promise(r => setTimeout(r, 150))
      }

      console.log(`\n✅ TOTAL: ${allAds.length} annonces extraites`)

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
        await new Promise(r => setTimeout(r, 150))
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
