import { firestore } from '@/lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { NextResponse } from 'next/server'

const categoriesCollection = collection(firestore, 'categories')

export async function GET() {
  try {
    const q = query(categoriesCollection, orderBy('name'))
    const snapshot = await getDocs(q)
    
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json([], { status: 500 })
  }
}
