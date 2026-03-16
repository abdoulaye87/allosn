'use client'

import Link from 'next/link'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import { ArrowLeft, Home, Wrench, Truck, ShoppingBag, Utensils, Package, Briefcase, GraduationCap, PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'

const allCategories = [
  { name: 'Immobilier', icon: Home, slug: 'immobilier', color: 'text-blue-500', bgColor: 'bg-blue-50', description: 'Vente et location de biens immobiliers', count: 156 },
  { name: 'Services', icon: Wrench, slug: 'services', color: 'text-emerald-500', bgColor: 'bg-emerald-50', description: 'Artisans et professionnels', count: 234 },
  { name: 'Transport', icon: Truck, slug: 'transport', color: 'text-amber-500', bgColor: 'bg-amber-50', description: 'Covoiturage, livraison, thiak thiak', count: 189 },
  { name: 'Vente', icon: ShoppingBag, slug: 'vente', color: 'text-violet-500', bgColor: 'bg-violet-50', description: 'Achetez et vendez des articles', count: 412 },
  { name: 'Restauration', icon: Utensils, slug: 'restauration', color: 'text-red-500', bgColor: 'bg-red-50', description: 'Plats, traiteurs, restaurants', count: 87 },
  { name: 'Location', icon: Package, slug: 'location', color: 'text-cyan-500', bgColor: 'bg-cyan-50', description: 'Location de matériel et véhicules', count: 65 },
  { name: 'Emploi', icon: Briefcase, slug: 'emploi', color: 'text-indigo-500', bgColor: 'bg-indigo-50', description: 'Offres et demandes d\'emploi', count: 198 },
  { name: 'Formation', icon: GraduationCap, slug: 'formation', color: 'text-pink-500', bgColor: 'bg-pink-50', description: 'Cours et formations', count: 76 },
  { name: 'Événementiel', icon: PartyPopper, slug: 'evenementiel', color: 'text-orange-500', bgColor: 'bg-orange-50', description: 'Organisation d\'événements', count: 54 },
]

export default function CategoriesPage() {
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
            <h1 className="text-xl font-bold text-gray-800">Toutes les catégories</h1>
            <p className="text-sm text-gray-500">9 catégories disponibles</p>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-3">
          {allCategories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.slug}
                href={`/categorie/${category.slug}`}
                className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-98"
              >
                <div className={`w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-7 w-7 ${category.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-600">{category.count}</span>
                  <p className="text-xs text-gray-400">annonces</p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
          <h3 className="font-bold mb-1">Vous ne trouvez pas votre catégorie ?</h3>
          <p className="text-orange-100 text-sm mb-3">
            Contactez-nous pour suggérer une nouvelle catégorie
          </p>
          <Link href="/contact" className="inline-block bg-white text-orange-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-50">
            Nous contacter
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
