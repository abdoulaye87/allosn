'use client'

import { useEffect, useState } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import FeaturedAds from '@/components/home/FeaturedAds'
import { 
  Search, ChevronRight, Home as HomeIcon, Car, Briefcase, Wrench, 
  ShoppingBag, Utensils, Package, GraduationCap, PartyPopper,
  MapPin, TrendingUp, Star, Sparkles, Plus, ArrowRight,
  Users, Phone, Shield, Clock
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Catégories style Leboncoin avec couleurs sénégalaises
const mainCategories = [
  { 
    name: 'Immobilier', 
    icon: HomeIcon, 
    href: '/categorie/immobilier',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    count: '2 450+'
  },
  { 
    name: 'Véhicules', 
    icon: Car, 
    href: '/categorie/transport',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    count: '1 820+'
  },
  { 
    name: 'Emploi', 
    icon: Briefcase, 
    href: '/categorie/emploi',
    color: 'bg-green-600',
    lightColor: 'bg-green-50',
    textColor: 'text-green-600',
    count: '3 150+'
  },
  { 
    name: 'Services', 
    icon: Wrench, 
    href: '/categorie/services',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    count: '980+'
  },
]

const allCategories = [
  { name: 'Immobilier', icon: HomeIcon, href: '/categorie/immobilier', color: 'bg-blue-500', count: '2 450+' },
  { name: 'Véhicules', icon: Car, href: '/categorie/transport', color: 'bg-purple-500', count: '1 820+' },
  { name: 'Emploi', icon: Briefcase, href: '/categorie/emploi', color: 'bg-green-600', count: '3 150+' },
  { name: 'Services', icon: Wrench, href: '/categorie/services', color: 'bg-orange-500', count: '980+' },
  { name: 'Ventes', icon: ShoppingBag, href: '/categorie/vente', color: 'bg-pink-500', count: '1 540+' },
  { name: 'Restauration', icon: Utensils, href: '/categorie/restauration', color: 'bg-amber-500', count: '320+' },
  { name: 'Locations', icon: Package, href: '/categorie/location', color: 'bg-teal-500', count: '890+' },
  { name: 'Formation', icon: GraduationCap, href: '/categorie/formation', color: 'bg-indigo-500', count: '450+' },
  { name: 'Événements', icon: PartyPopper, href: '/categorie/evenementiel', color: 'bg-rose-500', count: '280+' },
]

const popularCities = [
  { name: 'Dakar', count: '12 450' },
  { name: 'Thiès', count: '3 200' },
  { name: 'Saint-Louis', count: '2 100' },
  { name: 'Mbour', count: '1 850' },
  { name: 'Kaolack', count: '1 420' },
  { name: 'Rufisque', count: '1 180' },
  { name: 'Touba', count: '980' },
  { name: 'Ziguinchor', count: '650' },
]

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [isSeeded, setIsSeeded] = useState(false)

  useEffect(() => {
    fetch('/api/firebase-seed')
      .then(res => res.json())
      .then(data => { if (data.success) setIsSeeded(true) })
      .catch(console.error)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery)
    if (location.trim()) params.set('ville', location)
    router.push(`/recherche?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader />

      {/* Hero Section - Style Leboncoin */}
      <section className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 text-white">
        <div className="px-4 pt-8 pb-10">
          {/* Tagline */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">
              Des milliers d'annonces
            </h1>
            <p className="text-green-100 text-lg">
              au Sénégal, près de chez vous
            </p>
          </div>

          {/* Search Box - Style Leboncoin */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-4 space-y-3">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Que recherchez-vous ?"
                className="w-full bg-gray-100 rounded-xl px-4 py-3.5 pl-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            {/* Location input */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Toutes les villes"
                className="w-full bg-gray-100 rounded-xl px-4 py-3.5 pl-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-orange-500/30"
            >
              Rechercher
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {['Voiture', 'Appartement', 'Emploi', 'Phone'].map((tag) => (
              <Link
                key={tag}
                href={`/recherche?q=${tag}`}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full text-sm transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Categories - Style Leboncoin */}
      <section className="px-4 -mt-4 relative z-10">
        <div className="grid grid-cols-4 gap-2">
          {mainCategories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm`}>
                <cat.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-center text-sm font-semibold text-gray-800">{cat.name}</p>
              <p className="text-center text-xs text-gray-400 mt-0.5">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Catégories</h2>
          <Link href="/categories" className="text-green-600 font-medium flex items-center gap-1 text-sm">
            Voir tout <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {allCategories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 group"
            >
              <div className={`w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <cat.icon className="h-5 w-5 text-white" />
              </div>
              <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
              <p className="text-xs text-gray-400">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Ads */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-800">Annonces en vedette</h2>
          </div>
          <Link href="/annonces?featured=true" className="text-green-600 font-medium flex items-center gap-1 text-sm">
            Voir tout <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <FeaturedAds title="" featured={true} />
      </section>

      {/* Recent Ads */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Annonces récentes</h2>
          </div>
          <Link href="/annonces" className="text-green-600 font-medium flex items-center gap-1 text-sm">
            Voir tout <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <FeaturedAds title="" featured={false} />
      </section>

      {/* Popular Cities */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Villes populaires</h2>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="grid grid-cols-2 gap-2">
            {popularCities.map((city, idx) => (
              <Link
                key={city.name}
                href={`/annonces?ville=${city.name}`}
                className={`flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors ${idx < popularCities.length - 2 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${idx === 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-gray-800">{city.name}</span>
                </div>
                <span className="text-sm text-gray-400">{city.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Publier */}
      <section className="px-4 mt-8">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">Publiez votre annonce</h3>
              <p className="text-orange-100 text-sm">C'est gratuit et rapide !</p>
            </div>
            <Link 
              href="/publier"
              className="bg-white text-orange-600 px-5 py-2.5 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-md"
            >
              <Plus className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-4 mt-8 mb-8">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-800">Sécurisé</p>
            <p className="text-xs text-gray-400 mt-1">Paiements protégés</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-sm font-semibold text-gray-800">50K+</p>
            <p className="text-xs text-gray-400 mt-1">Utilisateurs</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-800">Support</p>
            <p className="text-xs text-gray-400 mt-1">7j/7</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-3 py-1.5 rounded-lg">
              <span className="text-xl font-bold text-white">AlloSN</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            La plateforme de petites annonces du Sénégal
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-400">
            <Link href="/connexion" className="hover:text-white">Connexion</Link>
            <span>•</span>
            <Link href="/publier" className="hover:text-white">Publier</Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-gray-600">Admin</Link>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-gray-500 text-xs">
              © 2024 AlloSN - Tous droits réservés
            </p>
          </div>
        </div>
      </footer>

      <BottomNav />
    </div>
  )
}
