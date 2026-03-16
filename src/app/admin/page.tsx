'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, Users, FileText, Settings, Shield, 
  BarChart3, MessageSquare, Flag, DollarSign, Bell,
  LogOut, Menu, X, ChevronRight, Search, Plus,
  Trash2, Edit, Eye, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

// Types
interface Ad {
  id: string
  title: string
  status: string
  city: string
  createdAt: string
  isPremium: boolean
}

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface Stats {
  totalAds: number
  totalUsers: number
  pendingAds: number
  premiumAds: number
}

// Admin Navigation
const adminNav = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Annonces', icon: FileText, href: '/admin/annonces' },
  { name: 'Utilisateurs', icon: Users, href: '/admin/users' },
  { name: 'Catégories', icon: Settings, href: '/admin/categories' },
  { name: 'Villes', icon: Shield, href: '/admin/villes' },
  { name: 'Statistiques', icon: BarChart3, href: '/admin/stats' },
  { name: 'Signalements', icon: Flag, href: '/admin/signalements' },
  { name: 'Paiements', icon: DollarSign, href: '/admin/paiements' },
  { name: 'Notifications', icon: Bell, href: '/admin/notifications' },
  { name: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  { name: 'Paramètres', icon: Settings, href: '/admin/parametres' },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalAds: 0,
    totalUsers: 0,
    pendingAds: 0,
    premiumAds: 0
  })
  const [recentAds, setRecentAds] = useState<Ad[]>([])
  const [recentUsers, setRecentUsers] = useState<User[]>([])

  useEffect(() => {
    // Check admin access
    const adminEmail = localStorage.getItem('adminEmail')
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    
    if (adminLoggedIn === 'true' && adminEmail) {
      const superAdminEmails = ['Abdoulayegueye87@gmail.com', 'abdoulayegueye87@gmail.com']
      if (superAdminEmails.includes(adminEmail.toLowerCase())) {
        setIsAdmin(true)
        fetchData()
      } else {
        router.push('/admin/login')
      }
    } else {
      router.push('/admin/login')
    }
    setLoading(false)
  }, [router])

  const fetchData = async () => {
    try {
      // Fetch stats
      const adsRes = await fetch('/api/firebase-ads?limit=1000')
      const adsData = await adsRes.json()
      
      setStats({
        totalAds: adsData.ads?.length || 0,
        totalUsers: 156,
        pendingAds: adsData.ads?.filter((a: Ad) => a.status === 'pending').length || 0,
        premiumAds: adsData.ads?.filter((a: Ad) => a.isPremium).length || 0
      })
      
      setRecentAds(adsData.ads?.slice(0, 5) || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminEmail')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-white">AlloSN Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Rechercher..." className="pl-10" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-6">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Bienvenue, Super Administrateur</p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.totalAds}</p>
              <p className="text-gray-500 text-sm">Total Annonces</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
              <p className="text-gray-500 text-sm">Utilisateurs</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.pendingAds}</p>
              <p className="text-gray-500 text-sm">En attente</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.premiumAds}</p>
              <p className="text-gray-500 text-sm">Premium</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/annonces/new">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle annonce
                </Button>
              </Link>
              <Link href="/admin/users/new">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel utilisateur
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full border-blue-500 text-blue-600">
                  <Settings className="h-4 w-4 mr-2" />
                  Catégories
                </Button>
              </Link>
              <Link href="/admin/villes">
                <Button variant="outline" className="w-full border-purple-500 text-purple-600">
                  <Shield className="h-4 w-4 mr-2" />
                  Villes
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent ads & Recent users */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Ads */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Annonces récentes</h2>
                <Link href="/admin/annonces" className="text-orange-600 text-sm hover:underline">
                  Voir tout
                </Link>
              </div>
              <div className="space-y-3">
                {recentAds.length > 0 ? recentAds.map((ad) => (
                  <div key={ad.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800 truncate max-w-[200px]">{ad.title}</p>
                      <p className="text-sm text-gray-500">{ad.city}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {ad.isPremium && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">Premium</span>
                      )}
                      <Link href={`/annonce/${ad.id}`}>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">Aucune annonce</p>
                )}
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Utilisateurs récents</h2>
                <Link href="/admin/users" className="text-orange-600 text-sm hover:underline">
                  Voir tout
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Amadou Diallo', email: 'amadou@test.sn', role: 'Particulier' },
                  { name: 'Fatou Ndiaye', email: 'fatou@test.sn', role: 'Professionnel' },
                  { name: 'Moussa Sow', email: 'moussa@test.sn', role: 'Particulier' },
                  { name: 'Aminata Fall', email: 'aminata@test.sn', role: 'Professionnel' },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">{user.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Admin info */}
          <div className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Super Administrateur</h3>
                <p className="text-orange-100">Abdoulayegueye87@gmail.com</p>
                <p className="text-sm text-orange-200 mt-1">Accès complet à toutes les fonctionnalités</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
