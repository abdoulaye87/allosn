'use client'

import { Home, Grid3X3, PlusCircle, Heart, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', icon: Home, label: 'Accueil' },
  { href: '/categories', icon: Grid3X3, label: 'Catégories' },
  { href: '/publier', icon: PlusCircle, label: 'Publier', isMain: true },
  { href: '/favoris', icon: Heart, label: 'Favoris' },
  { href: '/profil', icon: User, label: 'Profil' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around py-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          if (item.isMain) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-4"
              >
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full p-3 shadow-lg shadow-orange-500/30">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <span className="text-xs text-orange-600 font-medium mt-1">{item.label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-4 transition-colors ${
                isActive ? 'text-orange-600' : 'text-gray-500'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-orange-600' : 'text-gray-400'}`} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
