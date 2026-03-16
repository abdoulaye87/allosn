import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ad = await db.ad.findUnique({
      where: { id },
      include: {
        category: true,
        user: { select: { name: true, phone: true } }
      }
    })
    
    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }
    
    return NextResponse.json(ad)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ad' }, { status: 500 })
  }
}
