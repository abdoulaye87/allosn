'use client'

import { useEffect, useState } from 'react'
import AdCard from '@/components/ads/AdCard'

interface Ad {
  id: string
  title: string
  description: string
  price: number | null
  images: string
  city: string
  views: number
  isPremium: boolean
  isFeatured: boolean
  createdAt: string
  category?: { name: string; slug: string }
}

interface FeaturedAdsProps {
  title?: string
  featured?: boolean
}

export default function FeaturedAds({ title = 'Annonces en vedette', featured = true }: FeaturedAdsProps) {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const url = featured ? '/api/ads?featured=true&limit=6' : '/api/ads?limit=6'
        const res = await fetch(url)
        const data = await res.json()
        setAds(data.ads || [])
      } catch (error) {
        console.error('Error fetching ads:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAds()
  }, [featured])

  if (loading) {
    return (
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3">{title}</h2>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl animate-pulse aspect-[3/4]" />
          ))}
        </div>
      </div>
    )
  }

  if (ads.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-3">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {ads.map((ad) => (
          <AdCard key={ad.id} {...ad} />
        ))}
      </div>
    </div>
  )
}
