import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL requise' }, { status: 400 })
    }

    // Simulate scraping - in production, use a real scraper
    // For now, we'll extract basic info from the URL and generate placeholder content
    
    const urlObj = new URL(url)
    const domain = urlObj.hostname

    // Simulated scraped data based on domain
    const scrapedData = {
      title: '',
      description: '',
      price: null,
      phone: '',
      email: '',
      images: [] as string[],
      city: 'Dakar',
      category: 'services',
      sourceUrl: url,
      scrapedAt: new Date().toISOString()
    }

    // In production, you would use a real scraper like Puppeteer or Cheerio
    // For demonstration, we'll return simulated data based on the URL
    
    // Try to fetch the page
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      const html = await response.text()
      
      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      if (titleMatch) {
        scrapedData.title = titleMatch[1].substring(0, 100)
      }

      // Extract meta description
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
      if (descMatch) {
        scrapedData.description = descMatch[1].substring(0, 500)
      }

      // Extract phone numbers (Senegal format)
      const phoneMatches = html.match(/(\+221|221)?[\s-]?[0-9]{2}[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}/g)
      if (phoneMatches && phoneMatches.length > 0) {
        scrapedData.phone = phoneMatches[0].replace(/\s/g, '')
      }

      // Extract emails
      const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
      if (emailMatch) {
        scrapedData.email = emailMatch[0]
      }

      // Extract images
      const imgMatches = html.match(/<img[^>]*src=["']([^"']+\.(jpg|jpeg|png|webp))["']/gi)
      if (imgMatches) {
        scrapedData.images = imgMatches
          .slice(0, 5)
          .map((m: string) => {
            const srcMatch = m.match(/src=["']([^"']+)["']/i)
            if (srcMatch) {
              const src = srcMatch[1]
              if (src.startsWith('http')) return src
              if (src.startsWith('//')) return 'https:' + src
              return urlObj.origin + src
            }
            return null
          })
          .filter(Boolean) as string[]
      }

      // Detect category from content
      const lowerHtml = html.toLowerCase()
      if (lowerHtml.includes('immobilier') || lowerHtml.includes('maison') || lowerHtml.includes('appartement')) {
        scrapedData.category = 'immobilier'
      } else if (lowerHtml.includes('voiture') || lowerHtml.includes('auto') || lowerHtml.includes('véhicule')) {
        scrapedData.category = 'vente'
      } else if (lowerHtml.includes('covoiturage') || lowerHtml.includes('transport')) {
        scrapedData.category = 'transport'
      } else if (lowerHtml.includes('plombier') || lowerHtml.includes('électricien') || lowerHtml.includes('maçon')) {
        scrapedData.category = 'services'
      } else if (lowerHtml.includes('emploi') || lowerHtml.includes('recrutement')) {
        scrapedData.category = 'emploi'
      }

      // Extract price
      const priceMatch = html.match(/(\d[\d\s]*(?:\.\d{2})?)\s*(?:FCFA|CFA|F|€|EUR)/i)
      if (priceMatch) {
        scrapedData.price = parseInt(priceMatch[1].replace(/\s/g, ''))
      }

    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      // Continue with empty data
    }

    // If no title found, use domain
    if (!scrapedData.title) {
      scrapedData.title = `Annonce depuis ${domain}`
    }

    return NextResponse.json({
      success: true,
      data: scrapedData
    })

  } catch (error) {
    console.error('Scrape error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
