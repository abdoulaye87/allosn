'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search, Plus, Edit, Trash2, Menu, X, Shield, LogOut, Users, FileText,
  Settings, MessageSquare, Bell, Flag, Mail, Phone, Calendar, UserCheck, UserX
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  status: string
  createdAt: string
  adsCount?: number
}

const adminNav = [
  { name: 'Dashboard', icon: Shield, href: '/admin' },
  { name: 'Annonces', icon: FileText, href: '/admin/annonces' },
  { name: 'Utilisateurs', icon: Users, href: '/admin/utilisateurs' },
  { name: 'Catégories', icon: Settings, href: '/admin/categories' },
  { name: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  { name: 'Notifications', icon: Bell, href: '/admin/notifications' },
]

export default function AdminUsersPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: 'user', status: 'active' })

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    if (adminLoggedIn !== 'true') {
      router.push('/admin/login')
      return
    }
    fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (user: User) => {
    await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    setShowEditModal(false)
    setEditingUser(null)
    fetchUsers()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
    setShowDeleteConfirm(null)
    fetchUsers()
  }

  const handleAdd = async () => {
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    setShowAddModal(false)
    setNewUser({ name: '', email: '', phone: '', role: 'user', status: 'active' })
    fetchUsers()
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
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
            <Link key={item.name} href={item.href} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg">
              <item.icon className="h-5 w-5" /><span>{item.name}</span>
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
          <h1 className="text-xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />Nouveau
          </Button>
        </header>

        <div className="p-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2">
              <option value="all">Tous les rôles</option>
              <option value="user">Utilisateur</option>
              <option value="pro">Professionnel</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: users.length },
              { label: 'Actifs', value: users.filter(u => u.status === 'active').length },
              { label: 'Professionnels', value: users.filter(u => u.role === 'pro').length },
              { label: 'Admins', value: users.filter(u => u.role === 'admin').length },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-8 text-gray-500">Chargement...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">Aucun utilisateur</div>
            ) : filteredUsers.map(user => (
              <div key={user.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.name || 'Sans nom'}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>{user.status === 'active' ? 'Actif' : 'Inactif'}</span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {user.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4" />{user.phone}</div>}
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{new Date(user.createdAt).toLocaleDateString('fr-FR')}</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4" />
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'pro' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>{user.role === 'admin' ? 'Admin' : user.role === 'pro' ? 'Pro' : 'User'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditingUser(user); setShowEditModal(true) }}>
                    <Edit className="h-4 w-4 mr-1" />Modifier
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setShowDeleteConfirm(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Nouvel utilisateur</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Nom</label><Input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} /></div>
              <div><label className="block text-sm font-medium mb-1">Email</label><Input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} /></div>
              <div><label className="block text-sm font-medium mb-1">Téléphone</label><Input value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} /></div>
              <div><label className="block text-sm font-medium mb-1">Rôle</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full border rounded-lg px-4 py-2">
                  <option value="user">Utilisateur</option>
                  <option value="pro">Professionnel</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Annuler</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleAdd}>Créer</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Modifier l'utilisateur</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Nom</label><Input value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} /></div>
              <div><label className="block text-sm font-medium mb-1">Email</label><Input value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} /></div>
              <div><label className="block text-sm font-medium mb-1">Téléphone</label><Input value={editingUser.phone || ''} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Rôle</label>
                  <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} className="w-full border rounded-lg px-4 py-2">
                    <option value="user">Utilisateur</option>
                    <option value="pro">Professionnel</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">Statut</label>
                  <select value={editingUser.status} onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })} className="w-full border rounded-lg px-4 py-2">
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="banned">Banni</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>Annuler</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleUpdate(editingUser)}>Enregistrer</Button>
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
