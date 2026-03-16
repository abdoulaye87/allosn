import { firestore } from '@/lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { NextResponse } from 'next/server'

const citiesCollection = collection(firestore, 'cities')

export async function GET() {
  try {
    const q = query(citiesCollection, orderBy('name'))
    const snapshot = await getDocs(q)
    
    const cities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(cities)
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json([], { status: 500 })
  }
}
