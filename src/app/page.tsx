'use client'

import { useEffect, useState } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import CategoriesGrid from '@/components/home/CategoriesGrid'
import FeaturedAds from '@/components/home/FeaturedAds'
import { Search, Sparkles, TrendingUp, ChevronRight, Zap, Users, Wrench, ArrowRight, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSeeded, setIsSeeded] = useState(false)

  useEffect(() => {
    fetch('/api/firebase-seed')
      .then(res => res.json())
      .then(data => { if (data.success) setIsSeeded(true) })
      .catch(console.error)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader />

      <main className="px-4 py-4 space-y-5">
        {/* 🔥 SEARCH BAR - CENTRAL & TRES VISIBLE */}
        <section className="bg-white rounded-3xl shadow-lg p-6 -mt-2">
          <h1 className="text-center text-2xl font-bold text-gray-800 mb-1">
            Que recherchez-vous ?
          </h1>
          <p className="text-center text-gray-500 text-sm mb-5">
            Trouvez ce dont vous avez besoin au Sénégal
          </p>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une annonce, un service..."
              className="w-full bg-gray-100 border-2 border-gray-200 focus:border-orange-500 rounded-2xl px-5 py-4 pl-12 pr-24 text-base focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-medium text-sm transition-colors"
            >
              Rechercher
            </button>
          </form>

          {/* Quick tags */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {['Covoiturage', 'Plombier', 'Immobilier', 'Voiture', 'Emploi'].map((tag) => (
              <Link
                key={tag}
                href={`/recherche?q=${tag}`}
                className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm hover:bg-orange-100 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>

        {/* Hero compact */}
        <section className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Bienvenue sur AlloSN</p>
              <p className="text-orange-100 text-xs">Publiez votre annonce gratuitement</p>
            </div>
          </div>
          <Link href="/publier" className="bg-white text-orange-600 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-orange-50 active:scale-95 transition-all">
            Publier
          </Link>
        </section>

        {/* 🔥 Covoiturage & Services - POPULAIRES */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-orange-500" />
            Populaires
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Covoiturage Card */}
            <Link 
              href="/categorie/transport" 
              className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 text-white relative overflow-hidden group shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg">Covoiturage</h3>
                <p className="text-white/80 text-xs mt-1">Partagez vos trajets</p>
                <div className="flex items-center gap-1 mt-2 text-white/90 text-sm font-medium">
                  Voir <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Services Card */}
            <Link 
              href="/categorie/services" 
              className="bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl p-4 text-white relative overflow-hidden group shadow-lg shadow-green-500/20 active:scale-95 transition-transform"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <Wrench className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg">Services</h3>
                <p className="text-white/80 text-xs mt-1">Artisans & Pros</p>
                <div className="flex items-center gap-1 mt-2 text-white/90 text-sm font-medium">
                  Voir <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              Catégories
            </h2>
            <Link href="/categories" className="text-orange-600 text-sm font-medium flex items-center gap-1">
              Voir tout <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <CategoriesGrid />
        </section>

        {/* Featured Ads */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Annonces en vedette
            </h2>
            <Link href="/annonces?featured=true" className="text-orange-600 text-sm font-medium flex items-center gap-1">
              Voir tout <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <FeaturedAds title="" featured={true} />
        </section>

        {/* Recent Ads */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800">
              Annonces récentes
            </h2>
            <Link href="/annonces" className="text-orange-600 text-sm font-medium flex items-center gap-1">
              Voir tout <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <FeaturedAds title="" featured={false} />
        </section>

        {/* Popular Cities */}
        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            Villes populaires
          </h2>
          <div className="flex flex-wrap gap-2">
            {['Dakar', 'Thiès', 'Saint-Louis', 'Mbour', 'Kaolack', 'Rufisque', 'Touba', 'Ziguinchor'].map((city) => (
              <Link
                key={city}
                href={`/annonces?ville=${city}`}
                className="px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </section>

        {/* Admin link (subtle) */}
        <div className="text-center pt-4">
          <Link href="/admin/login" className="text-gray-300 text-xs hover:text-gray-500">
            Admin
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
