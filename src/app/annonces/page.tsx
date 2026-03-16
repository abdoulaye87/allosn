'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import AdCard from '@/components/ads/AdCard'
import { ArrowLeft, ChevronDown, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Ad {
  id: string
  title: string
  description: string
  price: number | null
  images: string[]
  city: string
  views: number
  isPremium: boolean
  isFeatured: boolean
  createdAt: string
  category?: { name: string; slug: string }
}

export default function AnnoncesPage() {
  const searchParams = useSearchParams()
  const city = searchParams.get('ville')
  const region = searchParams.get('region')
  const featured = searchParams.get('featured')
  
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState(city || '')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true)
      try {
        let url = '/api/firebase-ads?limit=50'
        if (featured === 'true') url += '&featured=true'
        
        const res = await fetch(url)
        const data = await res.json()
        
        let filteredAds = data.ads || []
        
        // Filter by city
        if (selectedCity) {
          filteredAds = filteredAds.filter((ad: Ad) => ad.city === selectedCity)
        }
        
        // Filter by region (approximate - would need proper region data in ads)
        if (region) {
          // For now, we just show all ads - in production, ads would have region field
        }
        
        // Sort
        filteredAds.sort((a: Ad, b: Ad) => {
          if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0)
          if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0)
          return 0
        })
        
        setAds(filteredAds)
      } catch (error) {
        console.error('Error fetching ads:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAds()
  }, [featured, selectedCity, sortBy, region])

  const cities = [...new Set(ads.map(ad => ad.city))]

  const pageTitle = city 
    ? `Annonces à ${city}` 
    : region 
      ? `Annonces en ${region}`
      : featured === 'true'
        ? 'Annonces en vedette'
        : 'Toutes les annonces'

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader />

      <main className="px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{pageTitle}</h1>
            <p className="text-sm text-gray-500">{ads.length} annonces</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-orange-500"
            >
              <option value="">Toutes les villes</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-orange-500"
            >
              <option value="recent">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Ads Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : ads.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {ads.map((ad) => (
              <AdCard key={ad.id} {...ad} images={JSON.stringify(ad.images)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucune annonce trouvée</p>
            <Link href="/publier">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Publier une annonce
              </Button>
            </Link>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
