'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import AdCard from '@/components/ads/AdCard'
import { ArrowLeft, Search, X, ChevronDown, MapPin, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { popularCities } from '@/lib/senegal-geo'

function RechercheContent() {
  const [query, setQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [showFilters, setShowFilters] = useState(false)
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    // Fetch categories
    fetch('/api/firebase-categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    performSearch()
  }, [selectedCity, selectedCategory, sortBy])

  const performSearch = async () => {
    setLoading(true)
    try {
      let url = '/api/firebase-ads?limit=20'
      if (selectedCategory) url += `&category=${selectedCategory}`
      if (selectedCity) url += `&city=${encodeURIComponent(selectedCity)}`
      
      const res = await fetch(url)
      const data = await res.json()
      
      // Filter by query if provided
      let filteredAds = data.ads || []
      if (query) {
        const lowerQuery = query.toLowerCase()
        filteredAds = filteredAds.filter((ad: any) => 
          ad.title.toLowerCase().includes(lowerQuery) ||
          ad.description.toLowerCase().includes(lowerQuery)
        )
      }
      
      setAds(filteredAds)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const clearFilters = () => {
    setQuery('')
    setSelectedCity('')
    setSelectedCategory('')
    setSortBy('recent')
  }

  return (
    <main className="px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Recherche</h1>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Que recherchez-vous ?"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-orange-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-orange-500"
            >
              <option value="">Toutes les villes</option>
              {popularCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative flex-1">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-orange-500"
            >
              <option value="">Toutes catégories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* More Filters Toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-gray-600"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Plus de filtres
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {showFilters && (
          <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-200">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Trier par</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'recent', label: 'Plus récents' },
                  { value: 'price-asc', label: 'Prix croissant' },
                  { value: 'price-desc', label: 'Prix décroissant' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSortBy(option.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      sortBy === option.value
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="submit"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-medium"
          >
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
          {(query || selectedCity || selectedCategory) && (
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="px-4"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading ? 'Recherche...' : `${ads.length} résultat${ads.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
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
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun résultat</h3>
          <p className="text-gray-500 mb-4">Essayez de modifier vos critères de recherche</p>
          <Link href="/publier">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Publier une annonce
            </Button>
          </Link>
        </div>
      )}
    </main>
  )
}

export default function RecherchePage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader />
      <Suspense fallback={
        <div className="px-4 py-4">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse mb-4" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl animate-pulse aspect-[3/4]" />
            ))}
          </div>
        </div>
      }>
        <RechercheContent />
      </Suspense>
      <BottomNav />
    </div>
  )
}
