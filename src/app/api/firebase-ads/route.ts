import { firestore } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limitParam = searchParams.get('limit')
    const city = searchParams.get('city')
    
    const adsCollection = collection(firestore, 'ads')
    const categoriesCollection = collection(firestore, 'categories')
    
    // Build query
    let q = query(adsCollection, where('status', '==', 'active'))
    
    if (categoryId) {
      q = query(q, where('categoryId', '==', categoryId))
    }
    
    if (featured === 'true') {
      q = query(q, where('isFeatured', '==', true))
    }
    
    if (city) {
      q = query(q, where('city', '==', city))
    }
    
    if (limitParam) {
      q = query(q, limit(parseInt(limitParam)))
    }
    
    const adsSnapshot = await getDocs(q)
    
    // Get categories for mapping
    const categoriesSnapshot = await getDocs(categoriesCollection)
    const categoryMap: Record<string, { name: string; slug: string }> = {}
    categoriesSnapshot.docs.forEach(doc => {
      const data = doc.data()
      categoryMap[doc.id] = { name: data.name, slug: data.slug }
    })
    
    const ads = adsSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        price: data.price,
        images: data.images || [],
        city: data.city,
        phone: data.phone,
        whatsapp: data.whatsapp,
        views: data.views || 0,
        isPremium: data.isPremium || false,
        isFeatured: data.isFeatured || false,
        status: data.status,
        createdAt: data.createdAt,
        categoryId: data.categoryId,
        category: data.categoryId ? categoryMap[data.categoryId] : null
      }
    })
    
    // Sort by date (newest first) - doing this client-side since Firestore requires indexes
    ads.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()
      return dateB - dateA
    })
    
    return NextResponse.json({ ads, total: ads.length })
  } catch (error) {
    console.error('Error fetching ads:', error)
    return NextResponse.json({ ads: [], error: String(error) }, { status: 500 })
  }
}
