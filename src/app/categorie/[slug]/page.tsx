'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import AdCard from '@/components/ads/AdCard'
import { ArrowLeft, Filter, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  children?: { id: string; name: string; slug: string }[]
}

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
  category: { name: string; slug: string }
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [category, setCategory] = useState<Category | null>(null)
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catRes = await fetch('/api/categories')
        const categories = await catRes.json()
        const foundCategory = categories.find((c: Category) => c.slug === slug)
        setCategory(foundCategory)

        if (foundCategory) {
          // Fetch ads for this category
          const adsRes = await fetch(`/api/ads?category=${foundCategory.id}&limit=20`)
          const adsData = await adsRes.json()
          setAds(adsData.ads || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  const filteredAds = ads
    .filter(ad => !selectedCity || ad.city === selectedCity)
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0)
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0)
      return 0
    })

  const cities = [...new Set(ads.map(ad => ad.city))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <MobileHeader />
        <div className="p-4">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl animate-pulse aspect-[3/4]" />
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

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
            <h1 className="text-xl font-bold text-gray-800">{category?.name || 'Catégorie'}</h1>
            <p className="text-sm text-gray-500">{ads.length} annonces</p>
          </div>
        </div>

        {/* Subcategories */}
        {category?.children && category.children.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href={`/categorie/${slug}`}
              className="flex-shrink-0 px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium"
            >
              Tout
            </Link>
            {category.children.map((sub) => (
              <Link
                key={sub.id}
                href={`/categorie/${sub.slug}`}
                className="flex-shrink-0 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:border-orange-500 hover:text-orange-600 transition-colors"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-orange-500"
            >
              <option value="">Toutes les villes</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
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
        {filteredAds.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredAds.map((ad) => (
              <AdCard key={ad.id} {...ad} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucune annonce dans cette catégorie</p>
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
