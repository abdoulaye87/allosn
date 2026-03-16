'use client'

import { Home, Grid3X3, PlusCircle, Heart, User, Sparkles } from 'lucide-react'
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-inset-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {/* Senegal flag line */}
      <div className="h-0.5 bg-gradient-to-r from-green-600 via-yellow-400 to-red-600" />
      
      <div className="flex items-center justify-around py-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          if (item.isMain) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-5 relative"
              >
                {/* Glow effect */}
                <div className="absolute -inset-2 bg-orange-400/20 rounded-full blur-xl" />
                
                {/* Main button */}
                <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-full p-4 shadow-lg shadow-orange-500/40 border-4 border-white">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <span className="text-xs text-orange-600 font-semibold mt-1">{item.label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-4 transition-all ${
                isActive ? 'scale-105' : ''
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-green-50' : ''}`}>
                <Icon className={`h-6 w-6 transition-colors ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <span className={`text-xs mt-0.5 font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
