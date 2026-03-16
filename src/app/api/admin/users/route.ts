import { firestore } from '@/lib/firebase'
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, where } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch all users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    const usersCollection = collection(firestore, 'users')
    let q = query(usersCollection)

    if (role && role !== 'all') {
      q = query(q, where('role', '==', role))
    }

    const snapshot = await getDocs(q)

    let users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      users = users.filter((user: any) =>
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({ success: true, users, total: users.length })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// PUT - Update a user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }

    const userRef = doc(firestore, 'users', id)
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true, message: 'Utilisateur mis à jour' })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// DELETE - Delete a user
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }

    await deleteDoc(doc(firestore, 'users', id))

    return NextResponse.json({ success: true, message: 'Utilisateur supprimé' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// POST - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const usersCollection = collection(firestore, 'users')
    const docRef = await addDoc(usersCollection, {
      ...body,
      role: body.role || 'user',
      status: body.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true, id: docRef.id, message: 'Utilisateur créé' })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
