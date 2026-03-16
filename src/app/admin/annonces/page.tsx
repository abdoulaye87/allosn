'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Search, Filter, Plus, Edit, Trash2, Eye, CheckCircle, XCircle,
  DollarSign, Star, MoreVertical, Menu, X, Shield, LogOut, Users, FileText,
  Settings, MessageSquare, Bell, Flag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Ad {
  id: string
  title: string
  description?: string
  price: number | null
  images?: string[]
  city: string
  phone?: string
  whatsapp?: string
  status: string
  isPremium: boolean
  isFeatured: boolean
  views: number
  createdAt: string
  categoryId?: string
  category?: { name: string; slug: string }
}

const adminNav = [
  { name: 'Dashboard', icon: Shield, href: '/admin' },
  { name: 'Annonces', icon: FileText, href: '/admin/annonces' },
  { name: 'Utilisateurs', icon: Users, href: '/admin/utilisateurs' },
  { name: 'Catégories', icon: Settings, href: '/admin/categories' },
  { name: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  { name: 'Notifications', icon: Bell, href: '/admin/notifications' },
  { name: 'Signalements', icon: Flag, href: '/admin/signalements' },
]

export default function AdminAnnoncesPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCity, setFilterCity] = useState('')
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [selectedAds, setSelectedAds] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail')
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    if (adminLoggedIn !== 'true' || !adminEmail) {
      router.push('/admin/login')
      return
    }
    fetchAds()
  }, [router])

  const fetchAds = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/firebase-ads?limit=200')
      const data = await res.json()
      const allAds = data.ads || []
      setAds(allAds)
      setCities([...new Set(allAds.map((a: Ad) => a.city))].sort())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/ads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    })
    fetchAds()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/ads?id=${id}`, { method: 'DELETE' })
    setShowDeleteConfirm(null)
    fetchAds()
  }

  const handleUpdate = async (ad: Ad) => {
    await fetch('/api/admin/ads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ad)
    })
    setShowEditModal(false)
    setEditingAd(null)
    fetchAds()
  }

  const handleBulkAction = async (action: string) => {
    for (const id of selectedAds) {
      if (action === 'delete') {
        await fetch(`/api/admin/ads?id=${id}`, { method: 'DELETE' })
      } else if (action === 'approve') {
        await fetch('/api/admin/ads', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: 'active' })
        })
      } else if (action === 'reject') {
        await fetch('/api/admin/ads', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: 'rejected' })
        })
      }
    }
    setSelectedAds([])
    fetchAds()
  }

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(search.toLowerCase()) ||
      ad.description?.toLowerCase().includes(search.toLowerCase()) ||
      ad.city.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus
    const matchesCity = !filterCity || ad.city === filterCity
    return matchesSearch && matchesStatus && matchesCity
  })

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminEmail')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-800 flex items-center gap-2">
          <Shield className="h-8 w-8 text-orange-500" />
          <span className="text-xl font-bold text-white">AlloSN Admin</span>
        </div>
        <nav className="p-4 space-y-1">
          {adminNav.map(item => (
            <Link key={item.name} href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg">
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg">
            <LogOut className="h-5 w-5" /><span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className="lg:ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600"><Menu className="h-6 w-6" /></button>
          <h1 className="text-xl font-bold text-gray-800">Gestion des Annonces</h1>
          <Link href="/publier">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white"><Plus className="h-4 w-4 mr-2" />Nouvelle</Button>
          </Link>
        </header>

        <div className="p-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                </div>
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2">
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="pending">En attente</option>
                <option value="rejected">Refusé</option>
                <option value="expired">Expiré</option>
              </select>
              <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2">
                <option value="">Toutes les villes</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {selectedAds.length > 0 && (
              <div className="mt-4 flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                <span className="text-sm text-orange-600">{selectedAds.length} sélectionné(s)</span>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('approve')}>Approuver</Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('reject')}>Refuser</Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>Supprimer</Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedAds([])}>Annuler</Button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: ads.length, color: 'blue' },
              { label: 'Actives', value: ads.filter(a => a.status === 'active').length, color: 'green' },
              { label: 'En attente', value: ads.filter(a => a.status === 'pending').length, color: 'yellow' },
              { label: 'Premium', value: ads.filter(a => a.isPremium).length, color: 'orange' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">
                    <input type="checkbox" onChange={(e) => {
                      if (e.target.checked) setSelectedAds(filteredAds.map(a => a.id))
                      else setSelectedAds([])
                    }} checked={selectedAds.length === filteredAds.length && filteredAds.length > 0} />
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Annonce</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Ville</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Prix</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Statut</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Vues</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-500">Chargement...</td></tr>
                ) : filteredAds.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-500">Aucune annonce</td></tr>
                ) : filteredAds.map(ad => (
                  <tr key={ad.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <input type="checkbox" checked={selectedAds.includes(ad.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedAds([...selectedAds, ad.id])
                          else setSelectedAds(selectedAds.filter(id => id !== ad.id))
                        }} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {ad.images?.[0] ? <img src={ad.images[0]} alt="" className="w-full h-full object-cover rounded-lg" /> : <FileText className="h-6 w-6 text-gray-400" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 truncate max-w-[200px]">{ad.title}</p>
                          <p className="text-xs text-gray-500">{new Date(ad.createdAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{ad.city}</td>
                    <td className="p-4 font-medium">{ad.price ? `${ad.price.toLocaleString()} F` : '-'}</td>
                    <td className="p-4">
                      <select value={ad.status || 'active'} onChange={(e) => handleUpdateStatus(ad.id, e.target.value)}
                        className={`text-sm px-2 py-1 rounded ${
                          ad.status === 'active' ? 'bg-green-100 text-green-700' :
                          ad.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          ad.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100'
                        }`}>
                        <option value="active">Actif</option>
                        <option value="pending">En attente</option>
                        <option value="rejected">Refusé</option>
                        <option value="expired">Expiré</option>
                      </select>
                    </td>
                    <td className="p-4 text-gray-600">{ad.views || 0}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/annonce/${ad.id}`}><Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button></Link>
                        <Button size="sm" variant="ghost" onClick={() => { setEditingAd(ad); setShowEditModal(true) }}><Edit className="h-4 w-4 text-blue-600" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setShowDeleteConfirm(ad.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && editingAd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Modifier l'annonce</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium mb-1">Titre</label><Input value={editingAd.title} onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })} /></div>
              <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={editingAd.description || ''} onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })} className="w-full border rounded-lg p-3 h-32" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Prix</label><Input type="number" value={editingAd.price || ''} onChange={(e) => setEditingAd({ ...editingAd, price: parseInt(e.target.value) || null })} /></div>
                <div><label className="block text-sm font-medium mb-1">Ville</label><Input value={editingAd.city} onChange={(e) => setEditingAd({ ...editingAd, city: e.target.value })} /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Téléphone</label><Input value={editingAd.phone || ''} onChange={(e) => setEditingAd({ ...editingAd, phone: e.target.value })} /></div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={editingAd.isPremium} onChange={(e) => setEditingAd({ ...editingAd, isPremium: e.target.checked })} /> Premium</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={editingAd.isFeatured} onChange={(e) => setEditingAd({ ...editingAd, isFeatured: e.target.checked })} /> Vedette</label>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>Annuler</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleUpdate(editingAd)}>Enregistrer</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
            <p className="text-gray-600 mb-6">Cette action est irréversible.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Annuler</Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(showDeleteConfirm)}>Supprimer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
