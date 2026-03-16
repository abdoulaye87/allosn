'use client'

import { Menu, Search, Bell, User, Plus, MessageCircle, Heart, ChevronDown } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'

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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn')
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('adminEmail')
    
    if (userLoggedIn === 'true' || adminLoggedIn === 'true') {
      setIsLoggedIn(true)
      setUserName(userEmail?.split('@')[0] || 'Utilisateur')
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar - Senegal colors */}
      <div className="h-1 bg-gradient-to-r from-green-600 via-yellow-400 to-red-600" />
      
      <div className="flex items-center justify-between px-4 py-2">
        {/* Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <div className="flex flex-col h-full">
              {/* Menu Header with Senegal gradient */}
              <div className="bg-gradient-to-br from-green-600 via-green-500 to-yellow-500 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold">
                      <span className="text-orange-500">Allo</span>
                      <span className="text-green-600">SN</span>
                    </span>
                  </div>
                </div>
                {isLoggedIn ? (
                  <div className="text-white">
                    <p className="font-semibold">Bonjour, {userName}</p>
                    <p className="text-green-100 text-sm">Bienvenue sur AlloSN</p>
                  </div>
                ) : (
                  <div className="text-white">
                    <p className="font-semibold text-lg">Bienvenue !</p>
                    <p className="text-green-100 text-sm">Connectez-vous pour profiter de toutes les fonctionnalités</p>
                  </div>
                )}
              </div>
              
              <nav className="flex-1 overflow-y-auto py-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-6 py-3.5 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-l-4 hover:border-green-500 transition-all"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              <div className="border-t p-4 space-y-2 bg-gray-50">
                {isLoggedIn ? (
                  <>
                    <Link href="/profil">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <User className="h-4 w-4 mr-2" />
                        Mon Profil
                      </Button>
                    </Link>
                    <Link href="/publier">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Publier une annonce
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/connexion">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <User className="h-4 w-4 mr-2" />
                        Se connecter
                      </Button>
                    </Link>
                    <Link href="/inscription">
                      <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50">
                        Créer un compte
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo - Leboncoin style */}
        <Link href="/" className="flex items-center">
          <div className="flex items-center bg-gradient-to-r from-orange-500 to-orange-400 px-3 py-1.5 rounded-xl shadow-sm">
            <span className="text-2xl font-bold text-white tracking-tight">
              Allo<span className="text-yellow-300">SN</span>
            </span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link href="/favoris" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Heart className="h-5 w-5 text-gray-600" />
          </Link>
          {isLoggedIn ? (
            <Link href="/profil" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </Link>
          ) : (
            <Link href="/connexion" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="h-5 w-5 text-gray-600" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
