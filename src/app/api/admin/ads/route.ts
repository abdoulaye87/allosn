import { firestore } from '@/lib/firebase'
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, where, limit } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch all ads with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const search = searchParams.get('search')
    const limitParam = searchParams.get('limit')

    const adsCollection = collection(firestore, 'ads')
    let q = query(adsCollection)

    if (status && status !== 'all') {
      q = query(q, where('status', '==', status))
    }

    if (category) {
      q = query(q, where('categoryId', '==', category))
    }

    if (city) {
      q = query(q, where('city', '==', city))
    }

    if (limitParam) {
      q = query(q, limit(parseInt(limitParam)))
    }

    const snapshot = await getDocs(q)

    let ads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      ads = ads.filter((ad: any) =>
        ad.title?.toLowerCase().includes(searchLower) ||
        ad.description?.toLowerCase().includes(searchLower) ||
        ad.city?.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({ success: true, ads, total: ads.length })
  } catch (error) {
    console.error('Error fetching ads:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// PUT - Update an ad
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }

    const adRef = doc(firestore, 'ads', id)
    await updateDoc(adRef, {
      ...data,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true, message: 'Annonce mise à jour' })
  } catch (error) {
    console.error('Error updating ad:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// DELETE - Delete an ad
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }

    await deleteDoc(doc(firestore, 'ads', id))

    return NextResponse.json({ success: true, message: 'Annonce supprimée' })
  } catch (error) {
    console.error('Error deleting ad:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// POST - Create a new ad
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const adsCollection = collection(firestore, 'ads')
    const docRef = await addDoc(adsCollection, {
      ...body,
      status: body.status || 'active',
      views: 0,
      isPremium: body.isPremium || false,
      isFeatured: body.isFeatured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true, id: docRef.id, message: 'Annonce créée' })
  } catch (error) {
    console.error('Error creating ad:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
