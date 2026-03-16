import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = { status: 'active' }
    
    if (category) {
      where.categoryId = category
    }
    
    if (city) {
      where.city = city
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }
    
    if (featured === 'true') {
      where.isFeatured = true
    }

    const ads = await db.ad.findMany({
      where,
      include: {
        category: true,
        user: { select: { name: true, phone: true } }
      },
      orderBy: [
        { isPremium: 'desc' },
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset
    })

    const total = await db.ad.count({ where })

    return NextResponse.json({ ads, total })
  } catch (error) {
    console.error('Error fetching ads:', error)
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, price, images, city, phone, whatsapp, categoryId } = body

    // For demo, use the test user
    const user = await db.user.findFirst()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }

    const ad = await db.ad.create({
      data: {
        title,
        description,
        price: price ? parseFloat(price) : null,
        images: JSON.stringify(images || []),
        city,
        phone,
        whatsapp,
        userId: user.id,
        categoryId,
        status: 'active'
      }
    })

    return NextResponse.json(ad)
  } catch (error) {
    console.error('Error creating ad:', error)
    return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 })
  }
}
