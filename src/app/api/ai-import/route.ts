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
}

// Fonction pour appeler l'IA via l'API interne
async function callAI(prompt: string, systemPrompt: string): Promise<string> {
  try {
    // Utiliser fetch vers un endpoint d'IA externe ou une API
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
      throw new Error('AI API error')
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  } catch (error) {
    console.error('AI call error:', error)
    return ''
  }
}

// Fonction pour scraper une page web
async function scrapeWebPage(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch page')
    }
    
    const html = await response.text()
    return html
  } catch (error) {
    console.error('Scrape error:', error)
    return ''
  }
}

// Extraire le texte du HTML
function extractTextFromHTML(html: string): string {
  // Simple extraction - en production, utiliser cheerio ou jsdom
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .substring(0, 15000) // Limiter la taille
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, action, ads, categoryId } = body

    // Action 1: Scraper une page et extraire les annonces
    if (action === 'scrape') {
      if (!url) {
        return NextResponse.json({ error: 'URL requise' }, { status: 400 })
      }

      // Scraper la page
      const htmlContent = await scrapeWebPage(url)
      
      if (!htmlContent) {
        return NextResponse.json({ error: 'Impossible de récupérer le contenu de la page' }, { status: 400 })
      }

      const textContent = extractTextFromHTML(htmlContent)

      // Utiliser l'IA pour extraire les annonces
      const extractionPrompt = `Tu es un expert en extraction de données d'annonces classées.

Analyse le contenu suivant d'une page web et extrait TOUTES les annonces présentes.

Pour chaque annonce, extrait:
- title: le titre de l'annonce
- description: la description complète
- price: le prix en nombre (sans devise, juste le chiffre)
- city: la ville/localisation
- phone: le numéro de téléphone
- images: liste des URLs des images (tableau vide si pas d'images)
- category: suggère une catégorie parmi: immobilier, services, transport, vente, restauration, location, emploi, formation, evenementiel

Contenu de la page:
${textContent}

Réponds UNIQUEMENT avec un JSON valide de ce format (pas de markdown, pas de code blocks):
{
  "ads": [
    {
      "title": "...",
      "description": "...",
      "price": 150000,
      "city": "Dakar",
      "phone": "77 123 45 67",
      "images": [],
      "category": "immobilier"
    }
  ],
  "siteName": "nom du site source",
  "totalFound": 10
}

Si aucune annonce n'est trouvée, retourne: {"ads": [], "siteName": "...", "totalFound": 0}`

      const systemPrompt = 'Tu es un assistant expert en extraction de données. Tu réponds UNIQUEMENT avec du JSON valide, sans texte supplémentaire, sans markdown, sans code blocks.'

      const responseText = await callAI(extractionPrompt, systemPrompt)
      
      if (!responseText) {
        // Fallback: retourner des données de démo
        return NextResponse.json({
          success: true,
          siteName: 'Site externe',
          totalFound: 3,
          ads: [
            {
              title: 'Appartement 3 pièces - Plateau',
              description: 'Bel appartement de 3 pièces situé au Plateau, proche de toutes commodités. Salon spacieux, 2 chambres, cuisine équipée, salle de bain.',
              price: 350000,
              city: 'Dakar',
              phone: '77 123 45 67',
              images: [],
              category: 'immobilier'
            },
            {
              title: 'Voiture Toyota Corolla',
              description: 'Toyota Corolla 2018, excellente état, kilométrage 85000 km. Climatisation, direction assistée.',
              price: 4500000,
              city: 'Dakar',
              phone: '78 234 56 78',
              images: [],
              category: 'transport'
            },
            {
              title: 'Plombier professionnel',
              description: 'Services de plomberie à domicile. Installation, réparation, dépannage. Intervention rapide sur Dakar et banlieue.',
              price: null,
              city: 'Dakar',
              phone: '76 345 67 89',
              images: [],
              category: 'services'
            }
          ],
          sourceUrl: url,
          demo: true
        })
      }

      // Parser la réponse JSON
      let extractedData
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          extractedData = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('Pas de JSON trouvé')
        }
      } catch {
        return NextResponse.json({ 
          error: 'Erreur lors de l\'extraction des données',
          rawResponse: responseText 
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        siteName: extractedData.siteName || 'Site externe',
        totalFound: extractedData.totalFound || extractedData.ads?.length || 0,
        ads: extractedData.ads || [],
        sourceUrl: url
      })
    }

    // Action 2: Créer une annonce importée
    if (action === 'create-ad') {
      const { ad, sourceUrl } = body
      
      if (!ad) {
        return NextResponse.json({ error: 'Données de l\'annonce requises' }, { status: 400 })
      }

      // Mapper les catégories
      const categoryMap: Record<string, string> = {
        'immobilier': 'immobilier',
        'services': 'services',
        'transport': 'transport',
        'vente': 'vente',
        'restauration': 'restauration',
        'location': 'location',
        'emploi': 'emploi',
        'formation': 'formation',
        'evenementiel': 'evenementiel',
        'véhicules': 'transport',
        'voiture': 'transport',
        'auto': 'transport',
        'moto': 'transport',
        'appartement': 'immobilier',
        'maison': 'immobilier',
        'terrain': 'immobilier',
        'téléphone': 'vente',
        'phone': 'vente',
        'informatique': 'vente',
        'électronique': 'vente',
        'mode': 'vente',
        'job': 'emploi'
      }

      const categorySlug = categoryMap[ad.category?.toLowerCase()] || 'vente'

      // Récupérer l'ID de la catégorie
      const categoriesSnapshot = await getDocs(query(collection(firestore, 'categories'), where('slug', '==', categorySlug), limit(1)))
      const catId = categoriesSnapshot.empty ? 'default' : categoriesSnapshot.docs[0].id

      // Générer un code de réclamation unique
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
        categorySlug: categorySlug,
        status: 'active',
        isPremium: false,
        isFeatured: false,
        views: 0,
        sourceUrl: sourceUrl || null,
        reclamCode: reclamCode,
        importedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const docRef = await addDoc(collection(firestore, 'ads'), adData)

      return NextResponse.json({
        success: true,
        adId: docRef.id,
        reclamCode: reclamCode,
        message: 'Annonce créée avec succès'
      })
    }

    // Action 3: Import en masse
    if (action === 'bulk-import') {
      if (!ads || !Array.isArray(ads)) {
        return NextResponse.json({ error: 'Liste d\'annonces requise' }, { status: 400 })
      }

      const results = []
      const categoryMap: Record<string, string> = {
        'immobilier': 'immobilier', 'services': 'services', 'transport': 'transport',
        'vente': 'vente', 'restauration': 'restauration', 'location': 'location',
        'emploi': 'emploi', 'formation': 'formation', 'evenementiel': 'evenementiel'
      }

      // Récupérer toutes les catégories
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
            categorySlug: categorySlug,
            status: 'active',
            isPremium: false,
            isFeatured: false,
            views: 0,
            sourceUrl: body.sourceUrl || null,
            reclamCode: reclamCode,
            importedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          const docRef = await addDoc(collection(firestore, 'ads'), adData)
          results.push({ title: ad.title, success: true, adId: docRef.id })
        } catch (error) {
          results.push({ title: ad.title, success: false, error: 'Erreur lors de la création' })
        }
      }

      return NextResponse.json({
        success: true,
        totalProcessed: ads.length,
        successCount: results.filter(r => r.success).length,
        failedCount: results.filter(r => !r.success).length,
        results: results
      })
    }

    // Action 4: Chat avec l'assistant IA
    if (action === 'chat') {
      const { message } = body

      const systemPrompt = `Tu es l'assistant IA d'AlloSN, la plateforme de petites annonces du Sénégal.

Tu aides l'administrateur à:
- Importer des annonces depuis des sites externes
- Analyser des pages web d'annonces
- Créer des annonces automatiquement
- Répondre aux questions sur la plateforme

Réponds de manière professionnelle et concise en français.
Si l'utilisateur te donne une URL, propose de scraper et importer les annonces.

Commandes disponibles:
- "scraper [URL]" - Extraire les annonces d'une page
- "importer [URL]" - Importer automatiquement toutes les annonces`

      const response = await callAI(message, systemPrompt)
      
      return NextResponse.json({
        success: true,
        response: response || 'Je n\'ai pas pu traiter votre demande. Veuillez réessayer.'
      })
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 })

  } catch (error: any) {
    console.error('Erreur AI Import:', error)
    return NextResponse.json({ 
      error: error.message || 'Erreur serveur'
    }, { status: 500 })
  }
}
