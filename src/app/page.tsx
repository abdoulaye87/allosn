'use client'

import { useEffect, useState } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import SearchBar from '@/components/home/SearchBar'
import CategoriesGrid from '@/components/home/CategoriesGrid'
import FeaturedAds from '@/components/home/FeaturedAds'
import { Sparkles, TrendingUp, ChevronRight, Zap, Car, Wrench, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [isSeeded, setIsSeeded] = useState(false)

  useEffect(() => {
    // Seed Firebase database on first load
    fetch('/api/firebase-seed')
      .then(res => res.json())
      .then(data => {
        if (data.success) setIsSeeded(true)
      })
      .catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader />

      <main className="px-4 py-4 space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-1">
              Bienvenue sur AlloSN
            </h1>
            <p className="text-orange-100 text-sm mb-4">
              La plateforme tout-en-un du Sénégal
            </p>
            
            <Link href="/publier" className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95">
              <Zap className="h-4 w-4" />
              Publier une annonce
            </Link>
          </div>
        </div>

        {/* 🔥 FEATURED: Covoiturage & Services - TRES VISIBLES */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
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

        {/* Search Bar */}
        <SearchBar />

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

        {/* All Cities Link */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">Toutes les villes du Sénégal</h3>
              <p className="text-blue-100 text-sm mt-1">14 régions, 46 départements</p>
            </div>
            <Link href="/villes">
              <button className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl font-medium text-sm">
                Explorer
              </button>
            </Link>
          </div>
        </section>

        {/* App Download Banner */}
        <section className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold mb-1">Bientôt disponible</h3>
              <p className="text-green-100 text-sm">
                Application mobile Android & iOS
              </p>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2 text-sm font-medium">
              Bientôt
            </div>
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
