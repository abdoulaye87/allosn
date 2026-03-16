'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import { 
  ArrowLeft, Heart, Share2, Phone, MessageCircle, 
  MapPin, Clock, Eye, Shield, ChevronLeft, ChevronRight 
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AdCard from '@/components/ads/AdCard'

interface Ad {
  id: string
  title: string
  description: string
  price: number | null
  images: string[]
  city: string
  phone: string | null
  whatsapp: string | null
  views: number
  isPremium: boolean
  isFeatured: boolean
  createdAt: string
  category?: { name: string; slug: string; id: string }
  categoryId?: string
}

export default function AdDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const [ad, setAd] = useState<Ad | null>(null)
  const [similarAds, setSimilarAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchAd = async () => {
      try {
        // Fetch all ads and find the one with matching ID
        const res = await fetch('/api/firebase-ads?limit=100')
        const data = await res.json()
        const foundAd = data.ads?.find((a: Ad) => a.id === id)
        
        if (foundAd) {
          setAd(foundAd)
          
          // Find similar ads from same category
          const similar = data.ads?.filter((a: Ad) => 
            a.categoryId === foundAd.categoryId && a.id !== id
          ).slice(0, 4) || []
          setSimilarAds(similar)
        }
      } catch (error) {
        console.error('Error fetching ad:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAd()
  }, [id])

  const formatPrice = (p: number | null) => {
    if (p === null) return 'Sur devis'
    return new Intl.NumberFormat('fr-SN', { 
      style: 'currency', 
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(p)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <MobileHeader />
        <div className="bg-gray-200 aspect-[4/3] animate-pulse" />
        <div className="p-4 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <BottomNav />
      </div>
    )
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <MobileHeader />
        <div className="p-4 text-center">
          <p className="text-gray-500">Annonce non trouvée</p>
          <Link href="/">
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
        <BottomNav />
      </div>
    )
  }

  const images = ad.images || []
  const mainImage = images[currentImageIndex] || 'https://via.placeholder.com/800x600?text=AlloSN'

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <MobileHeader />

      {/* Image Gallery */}
      <div className="relative bg-black">
        <img
          src={mainImage}
          alt={ad.title}
          className="w-full aspect-[4/3] object-cover"
        />
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 rounded-full px-3 py-1 text-white text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Top actions */}
        <div className="absolute top-3 left-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/90 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 bg-white/90 rounded-full"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/90 rounded-full">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <main className="px-4 py-4 space-y-4">
        {/* Title & Price */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h1 className="text-xl font-bold text-gray-800 leading-tight">{ad.title}</h1>
            {ad.isPremium && (
              <span className="flex-shrink-0 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                ⭐ PREMIUM
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-orange-600">{formatPrice(ad.price)}</p>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{ad.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDate(ad.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{ad.views} vues</span>
          </div>
        </div>

        {/* Seller info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-lg">A</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Annonceur</p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <Shield className="h-3 w-3" />
                <span>Vérifié</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
            {ad.description}
          </p>
        </div>

        {/* Category */}
        {ad.category && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <Link 
              href={`/categorie/${ad.category.slug}`}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-gray-400 uppercase">Catégorie</p>
                <p className="font-medium text-gray-800">{ad.category.name}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          </div>
        )}

        {/* Similar ads */}
        {similarAds.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-800 mb-3">Annonces similaires</h2>
            <div className="grid grid-cols-2 gap-3">
              {similarAds.slice(0, 4).map((similarAd) => (
                <AdCard key={similarAd.id} {...similarAd} images={JSON.stringify(similarAd.images)} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Fixed bottom contact bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 z-50">
        {ad.phone && (
          <a href={`tel:${ad.phone}`} className="flex-1">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3">
              <Phone className="h-5 w-5 mr-2" />
              Appeler
            </Button>
          </a>
        )}
        {ad.whatsapp && (
          <a 
            href={`https://wa.me/${ad.whatsapp.replace(/[^0-9]/g, '')}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3">
              <MessageCircle className="h-5 w-5 mr-2" />
              WhatsApp
            </Button>
          </a>
        )}
        {!ad.phone && !ad.whatsapp && (
          <Link href="/" className="flex-1">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3">
              Contacter
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
