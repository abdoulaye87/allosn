'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, FileText, Settings, Shield,
  BarChart3, MessageSquare, Flag, DollarSign, Bell,
  LogOut, Menu, X, ChevronRight, Search, Plus,
  Trash2, Edit, Eye, CheckCircle, XCircle, AlertTriangle,
  Home, Wrench, Truck, ShoppingBag, Utensils, Package, Briefcase, GraduationCap, PartyPopper, Link2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface Ad {
  id: string
  title: string
  status: string
  city: string
  createdAt: string
  isPremium: boolean
  isFeatured: boolean
  price: number | null
  phone?: string
  description?: string
  images?: string[]
}

interface Stats {
  totalAds: number
  totalUsers: number
  pendingAds: number
  premiumAds: number
  totalMessages: number
  totalViews: number
}

const adminNav = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin', exact: true },
  { name: 'Annonces', icon: FileText, href: '/admin/annonces' },
  { name: 'Utilisateurs', icon: Users, href: '/admin/utilisateurs' },
  { name: 'Catégories', icon: Settings, href: '/admin/categories' },
  { name: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  { name: 'Import URL', icon: Link2, href: '/admin/import-annonce' },
]

const categoryIcons: Record<string, any> = {
  'immobilier': Home,
  'services': Wrench,
  'transport': Truck,
  'vente': ShoppingBag,
  'restauration': Utensils,
  'location': Package,
  'emploi': Briefcase,
  'formation': GraduationCap,
  'evenementiel': PartyPopper,
}

export default function AdminDashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalAds: 0, totalUsers: 0, pendingAds: 0, premiumAds: 0,
    totalMessages: 0, totalViews: 0
  })
  const [recentAds, setRecentAds] = useState<Ad[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
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
      const adsRes = await fetch('/api/firebase-ads?limit=100')
      const adsData = await adsRes.json()

      const allAds = adsData.ads || []
      setAds(allAds)
      setRecentAds(allAds.slice(0, 5))

      setStats({
        totalAds: allAds.length,
        totalUsers: 156,
        pendingAds: allAds.filter((a: Ad) => a.status === 'pending').length,
        premiumAds: allAds.filter((a: Ad) => a.isPremium).length,
        totalMessages: 24,
        totalViews: allAds.reduce((sum: number, a: Ad) => sum + (a.views || 0), 0)
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminEmail')
    router.push('/admin/login')
  }

  // Update ad status
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      fetchData()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Delete ad
  const handleDeleteAd = async (id: string) => {
    try {
      await fetch(`/api/admin/ads?id=${id}`, { method: 'DELETE' })
      setShowDeleteConfirm(null)
      fetchData()
    } catch (error) {
      console.error('Error deleting ad:', error)
    }
  }

  // Update ad
  const handleUpdateAd = async (ad: Ad) => {
    try {
      await fetch('/api/admin/ads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ad)
      })
      setShowEditModal(false)
      setEditingAd(null)
      fetchData()
    } catch (error) {
      console.error('Error updating ad:', error)
    }
  }

  // Filter ads
  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.city?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus
    return matchesSearch && matchesStatus
  })

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

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
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
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
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
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/admin/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
              </Link>
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-6">
          {/* Page title */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-500">Bienvenue, Super Administrateur</p>
            </div>
            <Link href="/publier">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle annonce
              </Button>
            </Link>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {[
              { label: 'Annonces', value: stats.totalAds, icon: FileText, color: 'blue' },
              { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'green' },
              { label: 'En attente', value: stats.pendingAds, icon: AlertTriangle, color: 'yellow' },
              { label: 'Premium', value: stats.premiumAds, icon: DollarSign, color: 'orange' },
              { label: 'Messages', value: stats.totalMessages, icon: MessageSquare, color: 'purple' },
              { label: 'Vues totales', value: stats.totalViews, icon: Eye, color: 'pink' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4">
                <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-2`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Ads Management Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Gestion des Annonces</h2>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="pending">En attente</option>
                  <option value="rejected">Refusé</option>
                  <option value="expired">Expiré</option>
                </select>
              </div>
            </div>

            {/* Ads Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Titre</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ville</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Prix</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Statut</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Premium</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAds.slice(0, 10).map((ad) => (
                    <tr key={ad.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {ad.isFeatured && <span className="w-2 h-2 bg-orange-500 rounded-full" />}
                          <span className="font-medium text-gray-800 truncate max-w-[200px]">{ad.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{ad.city}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {ad.price ? `${ad.price.toLocaleString()} FCFA` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={ad.status || 'active'}
                          onChange={(e) => handleUpdateStatus(ad.id, e.target.value)}
                          className={`text-sm px-2 py-1 rounded ${
                            ad.status === 'active' ? 'bg-green-100 text-green-700' :
                            ad.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            ad.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <option value="active">Actif</option>
                          <option value="pending">En attente</option>
                          <option value="rejected">Refusé</option>
                          <option value="expired">Expiré</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleUpdateAd({ ...ad, isPremium: !ad.isPremium })}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            ad.isPremium ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <DollarSign className="h-4 w-4" />
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Link href={`/annonce/${ad.id}`}>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingAd(ad)
                              setShowEditModal(true)
                            }}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowDeleteConfirm(ad.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAds.length > 10 && (
              <div className="mt-4 text-center">
                <Link href="/admin/annonces">
                  <Button variant="outline">Voir toutes les annonces ({filteredAds.length})</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Gérer les annonces', icon: FileText, href: '/admin/annonces', color: 'blue' },
              { name: 'Utilisateurs', icon: Users, href: '/admin/utilisateurs', color: 'green' },
              { name: 'Messages', icon: MessageSquare, href: '/admin/messages', color: 'purple' },
              { name: 'Import URL', icon: Link2, href: '/admin/import-annonce', color: 'orange' },
            ].map((item) => (
              <Link key={item.name} href={item.href}>
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-3`}>
                    <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && editingAd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Modifier l'annonce</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <Input
                  value={editingAd.title}
                  onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingAd.description || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-3 h-32"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                  <Input
                    type="number"
                    value={editingAd.price || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, price: parseInt(e.target.value) || null })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <Input
                    value={editingAd.city}
                    onChange={(e) => setEditingAd({ ...editingAd, city: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <Input
                  value={editingAd.phone || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, phone: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingAd.isPremium}
                    onChange={(e) => setEditingAd({ ...editingAd, isPremium: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Premium</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingAd.isFeatured}
                    onChange={(e) => setEditingAd({ ...editingAd, isFeatured: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">En vedette</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>Annuler</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleUpdateAd(editingAd)}>
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmer la suppression</h2>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Annuler</Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDeleteAd(showDeleteConfirm)}>
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
