'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import AdCard from '@/components/ads/AdCard'
import { Heart, Trash2, ArrowLeft, Search } from 'lucide-react'
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
}

export default function FavorisPage() {
  const [favorites, setFavorites] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn')
    setIsLoggedIn(userLoggedIn === 'true')
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      const favIds = JSON.parse(savedFavorites)
      // Fetch ads by IDs
      fetchFavoritesAds(favIds)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchFavoritesAds = async (ids: string[]) => {
    if (ids.length === 0) {
      setLoading(false)
      return
    }
    try {
      const res = await fetch('/api/firebase-ads?limit=100')
      const data = await res.json()
      const favAds = (data.ads || []).filter((ad: Ad) => ids.includes(ad.id))
      setFavorites(favAds)
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = (adId: string) => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      const favIds = JSON.parse(savedFavorites)
      const newFavs = favIds.filter((id: string) => id !== adId)
      localStorage.setItem('favorites', JSON.stringify(newFavs))
      setFavorites(favorites.filter(f => f.id !== adId))
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <MobileHeader />
        <main className="px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Mes Favoris</h1>
            <p className="text-gray-500 mb-8">
              Connectez-vous pour sauvegarder vos annonces favorites
            </p>
            <div className="space-y-3">
              <Link href="/connexion" className="block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold">
                  Se connecter
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full py-3 rounded-xl font-semibold">
                  Explorer les annonces
                </Button>
              </Link>
            </div>
          </div>
        </main>
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
            <h1 className="text-xl font-bold text-gray-800">Mes Favoris</h1>
            <p className="text-sm text-gray-500">{favorites.length} annonce{favorites.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Favorites */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {favorites.map((ad) => (
              <div key={ad.id} className="relative">
                <AdCard {...ad} images={JSON.stringify(ad.images)} />
                <button
                  onClick={() => removeFavorite(ad.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun favori</h3>
            <p className="text-gray-500 mb-4">
              Parcourez les annonces et ajoutez-les à vos favoris
            </p>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Explorer les annonces
              </Button>
            </Link>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
