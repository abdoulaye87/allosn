import { firestore } from '@/lib/firebase'
import { collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

// Create a pending announcement with reclamation link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, price, phone, email, images, city, category, sourceUrl, adminId } = body

    // Generate unique reclamation code
    const reclamationCode = Math.random().toString(36).substring(2, 10).toUpperCase()

    // Create pending announcement
    const pendingAd = {
      title,
      description,
      price: price || null,
      phone: phone || '',
      email: email || '',
      images: images || [],
      city: city || 'Dakar',
      category,
      sourceUrl: sourceUrl || '',
      status: 'pending_claim',
      reclamationCode,
      createdBy: adminId,
      createdAt: new Date().toISOString(),
      claimedBy: null,
      claimedAt: null
    }

    const docRef = await addDoc(collection(firestore, 'pending_ads'), pendingAd)

    // Generate reclamation link
    const reclamationLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://allosn.vercel.app'}/reclamation/${reclamationCode}`

    return NextResponse.json({
      success: true,
      id: docRef.id,
      reclamationCode,
      reclamationLink
    })

  } catch (error) {
    console.error('Error creating pending ad:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Get pending announcement by reclamation code
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ success: false, error: 'Code requis' }, { status: 400 })
    }

    const pendingAdsCollection = collection(firestore, 'pending_ads')
    const q = query(pendingAdsCollection, where('reclamationCode', '==', code))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return NextResponse.json({ success: false, error: 'Code invalide ou expiré' }, { status: 404 })
    }

    const doc = snapshot.docs[0]
    const data = doc.data()

    return NextResponse.json({
      success: true,
      pendingAd: {
        id: doc.id,
        ...data
      }
    })

  } catch (error) {
    console.error('Error fetching pending ad:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Claim an announcement
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { pendingAdId, userId, userName, userEmail, userPhone } = body

    // Get pending ad
    const pendingAdRef = doc(firestore, 'pending_ads', pendingAdId)
    const pendingAdDoc = await getDoc(pendingAdRef)

    if (!pendingAdDoc.exists()) {
      return NextResponse.json({ success: false, error: 'Annonce introuvable' }, { status: 404 })
    }

    const pendingAdData = pendingAdDoc.data()

    if (pendingAdData.status !== 'pending_claim') {
      return NextResponse.json({ success: false, error: 'Cette annonce a déjà été réclamée' }, { status: 400 })
    }

    // Create the actual ad
    const adData = {
      title: pendingAdData.title,
      description: pendingAdData.description,
      price: pendingAdData.price,
      phone: userPhone || pendingAdData.phone,
      email: userEmail || pendingAdData.email,
      images: pendingAdData.images,
      city: pendingAdData.city,
      category: pendingAdData.category,
      status: 'active',
      userId: userId,
      userName: userName,
      userEmail: userEmail,
      isPremium: false,
      isFeatured: false,
      views: 0,
      createdAt: new Date().toISOString(),
      claimedFrom: pendingAdId
    }

    const adRef = await addDoc(collection(firestore, 'ads'), adData)

    // Update pending ad status
    await updateDoc(pendingAdRef, {
      status: 'claimed',
      claimedBy: userId,
      claimedAt: new Date().toISOString(),
      adId: adRef.id
    })

    return NextResponse.json({
      success: true,
      adId: adRef.id,
      message: 'Annonce réclamée avec succès'
    })

  } catch (error) {
    console.error('Error claiming ad:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
