'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, Shield, LogOut, Users, FileText, Settings, MessageSquare, Bell, Plus, Edit, Trash2, ChevronDown, ChevronRight, Home, Wrench, Truck, ShoppingBag, Utensils, Package, Briefcase, GraduationCap, PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const categoryIcons: Record<string, any> = {
  'immobilier': Home, 'services': Wrench, 'transport': Truck, 'vente': ShoppingBag,
  'restauration': Utensils, 'location': Package, 'emploi': Briefcase, 'formation': GraduationCap, 'evenementiel': PartyPopper
}

const adminNav = [
  { name: 'Dashboard', icon: Shield, href: '/admin' },
  { name: 'Annonces', icon: FileText, href: '/admin/annonces' },
  { name: 'Utilisateurs', icon: Users, href: '/admin/utilisateurs' },
  { name: 'Catégories', icon: Settings, href: '/admin/categories' },
  { name: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  { name: 'Notifications', icon: Bell, href: '/admin/notifications' },
]

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddSubcategory, setShowAddSubcategory] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', color: '#F97316', description: '', icon: 'Home' })
  const [newSubcategory, setNewSubcategory] = useState({ name: '', slug: '', parentId: '' })

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    if (adminLoggedIn !== 'true') { router.push('/admin/login'); return }
    fetchData()
  }, [router])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories')
      const data = await res.json()
      setCategories(data.categories || [])
      setSubcategories(data.subcategories || [])
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  const handleUpdate = async (item: any, type: 'category' | 'subcategory') => {
    await fetch('/api/admin/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, type, ...item })
    })
    setEditingItem(null)
    fetchData()
  }

  const handleDelete = async (id: string, type: 'category' | 'subcategory') => {
    if (!confirm('Confirmer la suppression ?')) return
    await fetch(`/api/admin/categories?id=${id}&type=${type}`, { method: 'DELETE' })
    fetchData()
  }

  const handleAddCategory = async () => {
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'category', ...newCategory })
    })
    setShowAddCategory(false)
    setNewCategory({ name: '', slug: '', color: '#F97316', description: '', icon: 'Home' })
    fetchData()
  }

  const handleAddSubcategory = async () => {
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'subcategory', ...newSubcategory })
    })
    setShowAddSubcategory(false)
    setNewSubcategory({ name: '', slug: '', parentId: '' })
    fetchData()
  }

  const getSubcategories = (parentId: string) => subcategories.filter(s => s.parentId === parentId)

  const handleLogout = () => { localStorage.removeItem('adminLoggedIn'); router.push('/admin/login') }

  return (
    <div className="min-h-screen bg-gray-100">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
          <h1 className="text-xl font-bold text-gray-800">Catégories & Sous-catégories</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAddSubcategory(true)}><Plus className="h-4 w-4 mr-2" />Sous-catégorie</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setShowAddCategory(true)}><Plus className="h-4 w-4 mr-2" />Catégorie</Button>
          </div>
        </header>

        <div className="p-6">
          {loading ? <div className="text-center py-8">Chargement...</div> : (
            <div className="space-y-3">
              {categories.map(cat => {
                const Icon = categoryIcons[cat.slug] || Home
                const subs = getSubcategories(cat.id)
                return (
                  <div key={cat.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)} className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                          <Icon className="h-5 w-5" style={{ color: cat.color }} />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">{cat.name}</p>
                          <p className="text-sm text-gray-500">{subs.length} sous-catégories</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <Button size="sm" variant="ghost" onClick={() => setEditingItem({ ...cat, type: 'category' })}><Edit className="h-4 w-4 text-blue-600" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(cat.id, 'category')}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                        {expandedCategory === cat.id ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
                      </div>
                    </button>
                    {expandedCategory === cat.id && subs.length > 0 && (
                      <div className="border-t border-gray-100 bg-gray-50 p-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {subs.map(sub => (
                          <div key={sub.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                            <span className="text-sm text-gray-700">{sub.name}</span>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => setEditingItem({ ...sub, type: 'subcategory' })}><Edit className="h-3 w-3 text-blue-600" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDelete(sub.id, 'subcategory')}><Trash2 className="h-3 w-3 text-red-600" /></Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Nouvelle catégorie</h2>
              <button onClick={() => setShowAddCategory(false)} className="text-gray-400"><X className="h-6 w-6" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Nom</label><Input value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} /></div>
              <div><label className="block text-sm font-medium mb-1">Slug</label><Input value={newCategory.slug} onChange={e => setNewCategory({ ...newCategory, slug: e.target.value })} /></div>
              <div><label className="block text-sm font-medium mb-1">Couleur</label><input type="color" value={newCategory.color} onChange={e => setNewCategory({ ...newCategory, color: e.target.value })} className="w-full h-10 rounded-lg" /></div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddCategory(false)}>Annuler</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleAddCategory}>Créer</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {showAddSubcategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Nouvelle sous-catégorie</h2>
              <button onClick={() => setShowAddSubcategory(false)} className="text-gray-400"><X className="h-6 w-6" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Nom</label><Input value={newSubcategory.name} onChange={e => setNewSubcategory({ ...newSubcategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} /></div>
              <div><label className="block text-sm font-medium mb-1">Catégorie parente</label>
                <select value={newSubcategory.parentId} onChange={e => setNewSubcategory({ ...newSubcategory, parentId: e.target.value })} className="w-full border rounded-lg px-4 py-2">
                  <option value="">Sélectionner...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddSubcategory(false)}>Annuler</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleAddSubcategory}>Créer</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Modifier</h2>
              <button onClick={() => setEditingItem(null)} className="text-gray-400"><X className="h-6 w-6" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Nom</label><Input value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} /></div>
              <div><label className="block text-sm font-medium mb-1">Slug</label><Input value={editingItem.slug} onChange={e => setEditingItem({ ...editingItem, slug: e.target.value })} /></div>
              {editingItem.type === 'category' && (
                <div><label className="block text-sm font-medium mb-1">Couleur</label><input type="color" value={editingItem.color} onChange={e => setEditingItem({ ...editingItem, color: e.target.value })} className="w-full h-10 rounded-lg" /></div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingItem(null)}>Annuler</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleUpdate(editingItem, editingItem.type)}>Enregistrer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
