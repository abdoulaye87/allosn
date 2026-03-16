'use client'

import { Menu, Search, Bell, User } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const menuItems = [
  { href: '/', label: 'Accueil' },
  { href: '/categorie/immobilier', label: 'Immobilier' },
  { href: '/categorie/services', label: 'Services' },
  { href: '/categorie/transport', label: 'Transport / Thiak Thiak' },
  { href: '/categorie/vente', label: 'Vente / Commerce' },
  { href: '/categorie/restauration', label: 'Restauration' },
  { href: '/categorie/location', label: 'Location' },
  { href: '/categorie/emploi', label: 'Emploi' },
  { href: '/categorie/formation', label: 'Formation' },
  { href: '/categorie/evenementiel', label: 'Événementiel' },
]

export default function MobileHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-6 w-6 text-gray-700" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <div className="flex flex-col h-full">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                <h1 className="text-2xl font-bold text-white">AlloSN</h1>
                <p className="text-orange-100 text-sm mt-1">Votre plateforme au Sénégal</p>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-6 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="border-t p-4 space-y-2">
                <Link href="/connexion">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
                <Link href="/inscription">
                  <Button variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-50">
                    Créer un compte
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="text-2xl font-bold">
            <span className="text-orange-500">Allo</span>
            <span className="text-green-600">SN</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>
          <Link href="/recherche">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Search className="h-5 w-5 text-gray-600" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
