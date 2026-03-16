import { firestore } from '@/lib/firebase'
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch all categories and subcategories
export async function GET() {
  try {
    const categoriesCollection = collection(firestore, 'categories')
    const subcategoriesCollection = collection(firestore, 'subcategories')

    const [categoriesSnap, subcategoriesSnap] = await Promise.all([
      getDocs(categoriesCollection),
      getDocs(subcategoriesCollection)
    ])

    const categories = categoriesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    const subcategories = subcategoriesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ success: true, categories, subcategories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// PUT - Update a category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, type, ...data } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }

    const collectionName = type === 'subcategory' ? 'subcategories' : 'categories'
    const docRef = doc(firestore, collectionName, id)
    await updateDoc(docRef, data)

    return NextResponse.json({ success: true, message: 'Mis à jour' })
  } catch (error) {
    console.error('Error updating:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// DELETE - Delete a category
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const type = searchParams.get('type')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }

    const collectionName = type === 'subcategory' ? 'subcategories' : 'categories'
    await deleteDoc(doc(firestore, collectionName, id))

    return NextResponse.json({ success: true, message: 'Supprimé' })
  } catch (error) {
    console.error('Error deleting:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    const collectionName = type === 'subcategory' ? 'subcategories' : 'categories'
    const collectionRef = collection(firestore, collectionName)
    const docRef = await addDoc(collectionRef, data)

    return NextResponse.json({ success: true, id: docRef.id, message: 'Créé' })
  } catch (error) {
    console.error('Error creating:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
