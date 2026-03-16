'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Menu, X, Shield, LogOut, Users, FileText, Settings, MessageSquare, Bell,
  Link2, Search, Loader2, Check, Copy, ExternalLink, Eye, Edit, Save, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const adminNav = [
  { name: 'Dashboard', icon: Shield, href: '/admin' },
  { name: 'Annonces', icon: FileText, href: '/admin/annonces' },
  { name: 'Utilisateurs', icon: Users, href: '/admin/utilisateurs' },
  { name: 'Catégories', icon: Settings, href: '/admin/categories' },
  { name: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  { name: 'Import URL', icon: Link2, href: '/admin/import-annonce' },
]

interface ScrapedData {
  title: string
  description: string
  price: number | null
  phone: string
  email: string
  images: string[]
  city: string
  category: string
  sourceUrl: string
}

const categories = [
  { id: 'immobilier', name: 'Immobilier' },
  { id: 'services', name: 'Services' },
  { id: 'transport', name: 'Transport' },
  { id: 'vente', name: 'Vente' },
  { id: 'restauration', name: 'Restauration' },
  { id: 'location', name: 'Location' },
  { id: 'emploi', name: 'Emploi' },
  { id: 'formation', name: 'Formation' },
  { id: 'evenementiel', name: 'Événementiel' },
]

export default function AdminImportAnnoncePage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<ScrapedData>({
    title: '', description: '', price: null, phone: '', email: '', images: [], city: 'Dakar', category: 'services', sourceUrl: ''
  })
  const [reclamationLink, setReclamationLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [recentImports, setRecentImports] = useState<any[]>([])

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    if (adminLoggedIn !== 'true') {
      router.push('/admin/login')
    }
    loadRecentImports()
  }, [router])

  const handleScrape = async () => {
    if (!url) return
    setLoading(true)
    setScrapedData(null)
    setReclamationLink('')

    try {
      const res = await fetch('/api/scrape-annonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await res.json()

      if (data.success) {
        setScrapedData(data.data)
        setEditForm(data.data)
        setEditing(true)
      } else {
        alert('Erreur: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur lors de l\'extraction')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAnnouncement = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reclamation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          adminId: 'admin'
        })
      })
      const data = await res.json()

      if (data.success) {
        setReclamationLink(data.reclamationLink)
        setEditing(false)
        loadRecentImports()
      } else {
        alert('Erreur: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  const loadRecentImports = async () => {
    // Simulate loading recent imports
    setRecentImports([
      { id: '1', title: 'Plombier Dakar', status: 'pending', createdAt: new Date().toISOString() },
      { id: '2', title: 'Location appartement', status: 'claimed', createdAt: new Date().toISOString() },
    ])
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reclamationLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
          <h1 className="text-xl font-bold text-gray-800">Import d'Annonce depuis URL</h1>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          {/* URL Input */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Link2 className="h-5 w-5 text-orange-500" />
              Entrer l'URL de l'annonce
            </h2>
            <div className="flex gap-3">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemple.com/annonce..."
                className="flex-1"
              />
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleScrape}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="ml-2">Extraire</span>
              </Button>
            </div>
          </div>

          {/* Editing Form */}
          {editing && editForm && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Edit className="h-5 w-5 text-orange-500" />
                Modifier les informations extraites
              </h2>

              {/* Images Preview */}
              {editForm.images.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images extraites</label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {editForm.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-24 h-24 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                  <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full border rounded-lg p-3 h-32"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                    <Input type="number" value={editForm.price || ''} onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || null })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full border rounded-lg px-4 py-2">
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <Input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditing(false)}>Annuler</Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleCreateAnnouncement} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Créer et générer le lien
                </Button>
              </div>
            </div>
          )}

          {/* Reclamation Link */}
          {reclamationLink && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
              <h2 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Check className="h-5 w-5" />
                Annonce créée avec succès !
              </h2>
              <p className="text-green-700 text-sm mb-4">
                Envoyez ce lien au professionnel pour qu'il puisse réclamer l'annonce :
              </p>
              <div className="flex gap-2">
                <Input value={reclamationLink} readOnly className="bg-white" />
                <Button onClick={copyToClipboard} className={copied ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-green-600 mt-2">
                Le professionnel pourra voir l'annonce et la valider pour l'ajouter à son profil.
              </p>
            </div>
          )}

          {/* How it works */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Comment ça marche ?</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Copiez l\'URL', desc: 'Copiez l\'URL de l\'annonce ou la page du professionnel' },
                { step: 2, title: 'Extrayez les infos', desc: 'Le système extrait automatiquement titre, description, contact, images' },
                { step: 3, title: 'Modifiez si nécessaire', desc: 'Corrigez ou complétez les informations extraites' },
                { step: 4, title: 'Générez le lien', desc: 'Un lien unique est créé pour le professionnel' },
                { step: 5, title: 'Envoyez au professionnel', desc: 'Il clique, voit l\'annonce, et la réclame pour son profil' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
