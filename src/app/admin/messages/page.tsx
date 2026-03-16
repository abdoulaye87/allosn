'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, Shield, LogOut, Users, FileText, Settings, MessageSquare, Bell, Flag, Search, Mail, Calendar, CheckCircle, Reply, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  read: boolean
  reply?: string
  createdAt: string
}

const adminNav = [
  { name: 'Dashboard', icon: Shield, href: '/admin' },
  { name: 'Annonces', icon: FileText, href: '/admin/annonces' },
  { name: 'Utilisateurs', icon: Users, href: '/admin/utilisateurs' },
  { name: 'Catégories', icon: Settings, href: '/admin/categories' },
  { name: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  { name: 'Notifications', icon: Bell, href: '/admin/notifications' },
]

export default function AdminMessagesPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRead, setFilterRead] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    if (adminLoggedIn !== 'true') {
      router.push('/admin/login')
      return
    }
    fetchMessages()
  }, [router])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/messages')
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    await fetch('/api/admin/messages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read: true })
    })
    fetchMessages()
  }

  const handleReply = async () => {
    if (!selectedMessage || !replyText) return
    await fetch('/api/admin/messages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedMessage.id, read: true, reply: replyText })
    })
    setSelectedMessage(null)
    setReplyText('')
    fetchMessages()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' })
    setSelectedMessage(null)
    fetchMessages()
  }

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name?.toLowerCase().includes(search.toLowerCase()) ||
      msg.email?.toLowerCase().includes(search.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(search.toLowerCase())
    const matchesRead = filterRead === 'all' ||
      (filterRead === 'unread' && !msg.read) ||
      (filterRead === 'read' && msg.read)
    return matchesSearch && matchesRead
  })

  const unreadCount = messages.filter(m => !m.read).length

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
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount} non lu(s)</span>
            )}
          </div>
        </header>

        <div className="p-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <select value={filterRead} onChange={(e) => setFilterRead(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2">
              <option value="all">Tous</option>
              <option value="unread">Non lus</option>
              <option value="read">Lus</option>
            </select>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Boîte de réception ({filteredMessages.length})</h2>
              </div>
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Chargement...</div>
                ) : filteredMessages.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Aucun message</div>
                ) : filteredMessages.map(msg => (
                  <button
                    key={msg.id}
                    onClick={() => { setSelectedMessage(msg); setReplyText(msg.reply || '') }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${selectedMessage?.id === msg.id ? 'bg-orange-50' : ''} ${!msg.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${msg.read ? 'bg-gray-400' : 'bg-orange-500'}`}>
                        {msg.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-800 truncate">{msg.name}</p>
                          {!msg.read && <span className="w-2 h-2 bg-orange-500 rounded-full" />}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{msg.subject || msg.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
              {selectedMessage ? (
                <div>
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">{selectedMessage.subject || 'Sans objet'}</h2>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{selectedMessage.email}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!selectedMessage.read && (
                          <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(selectedMessage.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />Marquer lu
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(selectedMessage.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-gray-700 mb-2">Message:</h3>
                    <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{selectedMessage.message}</p>

                    {selectedMessage.reply && (
                      <div className="mt-6">
                        <h3 className="font-medium text-gray-700 mb-2">Votre réponse:</h3>
                        <p className="text-gray-600 bg-green-50 rounded-lg p-4">{selectedMessage.reply}</p>
                      </div>
                    )}

                    <div className="mt-6">
                      <h3 className="font-medium text-gray-700 mb-2">Répondre:</h3>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-4 h-32"
                        placeholder="Écrivez votre réponse..."
                      />
                      <div className="mt-3 flex justify-end">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleReply}>
                          <Reply className="h-4 w-4 mr-2" />Envoyer la réponse
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Sélectionnez un message pour le lire</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
