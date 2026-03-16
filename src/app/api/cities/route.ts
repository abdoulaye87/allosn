import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cities = await db.city.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(cities)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 })
  }
}
