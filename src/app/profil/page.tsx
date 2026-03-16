'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import AdCard from '@/components/ads/AdCard'
import { 
  User, Mail, Phone, MapPin, Calendar, Settings, LogOut, 
  Edit, Camera, Heart, FileText, ChevronRight, Shield,
  Package, Star, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UserData {
  id: string
  name: string
  email: string
  phone?: string
  city?: string
  avatar?: string
  role: string
  createdAt: string
  adsCount: number
  favoritesCount: number
}

export default function ProfilPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<'annonces' | 'favoris' | 'parametres'>('annonces')
  const [myAds, setMyAds] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', phone: '', city: '' })

  useEffect(() => {
    // Check if user is logged in
    const userLoggedIn = localStorage.getItem('userLoggedIn')
    const userEmail = localStorage.getItem('userEmail')
    const userName = localStorage.getItem('userName')

    if (userLoggedIn === 'true' && userEmail) {
      setIsLoggedIn(true)
      setUser({
        id: 'user-1',
        name: userName || 'Utilisateur',
        email: userEmail,
        phone: '+221 77 000 00 00',
        city: 'Dakar',
        role: 'user',
        createdAt: new Date().toISOString(),
        adsCount: 0,
        favoritesCount: 0
      })
      setEditForm({
        name: userName || 'Utilisateur',
        phone: '+221 77 000 00 00',
        city: 'Dakar'
      })
      fetchMyAds()
    }
    setLoading(false)
  }, [])

  const fetchMyAds = async () => {
    try {
      const res = await fetch('/api/firebase-ads?limit=20')
      const data = await res.json()
      // In production, filter by user ID
      setMyAds(data.ads?.slice(0, 4) || [])
    } catch (error) {
      console.error('Error fetching ads:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    router.push('/')
  }

  const handleSaveProfile = () => {
    localStorage.setItem('userName', editForm.name)
    if (user) {
      setUser({ ...user, ...editForm })
    }
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <MobileHeader />
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <BottomNav />
      </div>
    )
  }

  // Not logged in state
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <MobileHeader />
        <main className="px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-12 w-12 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Connectez-vous</h1>
            <p className="text-gray-500 mb-8">
              Connectez-vous pour accéder à votre profil, gérer vos annonces et vos favoris.
            </p>
            
            <div className="space-y-3">
              <Link href="/connexion" className="block">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold">
                  Se connecter
                </Button>
              </Link>
              <Link href="/inscription" className="block">
                <Button variant="outline" className="w-full py-3 rounded-xl font-semibold border-orange-500 text-orange-600">
                  Créer un compte
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Avantages du compte</h3>
              <div className="space-y-3 text-left">
                {[
                  { icon: FileText, text: 'Publier des annonces gratuites' },
                  { icon: Heart, text: 'Sauvegarder vos favoris' },
                  { icon: Eye, text: 'Voir vos statistiques' },
                  { icon: Star, text: 'Mettre en avant vos annonces' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-orange-500" />
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    )
  }

  // Logged in state
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader />

      <main className="px-4 py-4 space-y-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-24" />
          <div className="px-4 pb-4 -mt-12">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-3xl font-bold text-orange-500">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">{user?.name}</h1>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => setEditing(true)}
                    className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center"
                  >
                    <Edit className="h-5 w-5 text-orange-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-gray-800">{myAds.length}</p>
                <p className="text-xs text-gray-500">Annonces</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-gray-800">{favorites.length}</p>
                <p className="text-xs text-gray-500">Favoris</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-gray-800">124</p>
                <p className="text-xs text-gray-500">Vues</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-1 flex">
          {[
            { id: 'annonces', label: 'Mes annonces', icon: FileText },
            { id: 'favoris', label: 'Favoris', icon: Heart },
            { id: 'parametres', label: 'Paramètres', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'annonces' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Mes annonces ({myAds.length})</h2>
              <Link href="/publier">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Package className="h-4 w-4 mr-1" /> Nouvelle
                </Button>
              </Link>
            </div>

            {myAds.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {myAds.map((ad) => (
                  <div key={ad.id} className="relative">
                    <AdCard {...ad} images={JSON.stringify(ad.images)} />
                    <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow">
                      <button className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-orange-500">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Vous n'avez pas encore d'annonces</p>
                <Link href="/publier">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Publier ma première annonce
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favoris' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-800">Mes favoris</h2>

            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {favorites.map((ad) => (
                  <AdCard key={ad.id} {...ad} images={JSON.stringify(ad.images)} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Aucune annonce dans vos favoris</p>
                <Link href="/">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Explorer les annonces
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'parametres' && (
          <div className="space-y-4">
            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Informations du compte</h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-gray-800">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Téléphone</p>
                      <p className="text-gray-800">{user?.phone || 'Non renseigné'}</p>
                    </div>
                  </div>
                  <Edit className="h-5 w-5 text-gray-400" />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Ville</p>
                      <p className="text-gray-800">{user?.city || 'Non renseigné'}</p>
                    </div>
                  </div>
                  <Edit className="h-5 w-5 text-gray-400" />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Membre depuis</p>
                      <p className="text-gray-800">{new Date(user?.createdAt || '').toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                <Link href="/publier" className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-800">Publier une annonce</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                <Link href="/admin/login" className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-800">Administration</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center gap-2 text-red-500 font-medium hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Se déconnecter
            </button>
          </div>
        )}
      </main>

      <BottomNav />

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Modifier le profil</h2>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <Input
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setEditing(false)}>
                Annuler
              </Button>
              <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSaveProfile}>
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
