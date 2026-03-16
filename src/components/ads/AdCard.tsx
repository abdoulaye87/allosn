'use client'

import { Eye, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

interface AdCardProps {
  id: string
  title: string
  description: string
  price: number | null
  images: string
  city: string
  views: number
  isPremium?: boolean
  isFeatured?: boolean
  createdAt: string
  category?: { name: string; slug: string }
}

export default function AdCard({
  id,
  title,
  description,
  price,
  images,
  city,
  views,
  isPremium,
  isFeatured,
  createdAt,
  category
}: AdCardProps) {
  const imageList = JSON.parse(images || '[]')
  const mainImage = imageList[0] || 'https://via.placeholder.com/400x300?text=AlloSN'
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    return date.toLocaleDateString('fr-FR')
  }

  const formatPrice = (p: number | null) => {
    if (p === null) return 'Sur devis'
    return new Intl.NumberFormat('fr-SN', { 
      style: 'currency', 
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(p)
  }

  return (
    <Link href={`/annonce/${id}`}>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100">
          <img
            src={mainImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          {isPremium && (
            <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              ⭐ PREMIUM
            </span>
          )}
          {isFeatured && !isPremium && (
            <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              VEDETTE
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight mb-1">
            {title}
          </h3>
          
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
            {description}
          </p>

          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-orange-600 text-lg">
              {formatPrice(price)}
            </span>
            {category && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {category.name}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{city}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
