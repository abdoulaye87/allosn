'use client'

import { 
  Home, Wrench, Truck, ShoppingBag, Utensils, 
  Package, Briefcase, GraduationCap, PartyPopper 
} from 'lucide-react'
import Link from 'next/link'

const categories = [
  { name: 'Immobilier', icon: Home, slug: 'immobilier', color: 'bg-blue-500', bgColor: 'bg-blue-50' },
  { name: 'Services', icon: Wrench, slug: 'services', color: 'bg-emerald-500', bgColor: 'bg-emerald-50' },
  { name: 'Transport', icon: Truck, slug: 'transport', color: 'bg-amber-500', bgColor: 'bg-amber-50' },
  { name: 'Vente', icon: ShoppingBag, slug: 'vente', color: 'bg-violet-500', bgColor: 'bg-violet-50' },
  { name: 'Restauration', icon: Utensils, slug: 'restauration', color: 'bg-red-500', bgColor: 'bg-red-50' },
  { name: 'Location', icon: Package, slug: 'location', color: 'bg-cyan-500', bgColor: 'bg-cyan-50' },
  { name: 'Emploi', icon: Briefcase, slug: 'emploi', color: 'bg-indigo-500', bgColor: 'bg-indigo-50' },
  { name: 'Formation', icon: GraduationCap, slug: 'formation', color: 'bg-pink-500', bgColor: 'bg-pink-50' },
  { name: 'Événementiel', icon: PartyPopper, slug: 'evenementiel', color: 'bg-orange-500', bgColor: 'bg-orange-50' },
]

export default function CategoriesGrid() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <Link
            key={category.slug}
            href={`/categorie/${category.slug}`}
            className="flex flex-col items-center p-3 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center mb-2`}>
              <Icon className={`h-6 w-6 ${category.color.replace('bg-', 'text-')}`} />
            </div>
            <span className="text-xs text-gray-700 text-center font-medium leading-tight">
              {category.name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
