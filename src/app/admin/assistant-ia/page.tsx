'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Shield, LogOut, Menu, X, Send, Link2, Bot, Sparkles,
  Globe, FileText, CheckCircle, XCircle, Loader2, Trash2,
  ChevronRight, Eye, Plus, RefreshCw, Copy, Download,
  ChevronDown, ChevronUp, AlertCircle, Layers, Phone,
  MapPin, User, ImageIcon, ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  ads?: DetailedAd[]
  isLoading?: boolean
}

interface DetailedAd {
  title: string
  description: string
  price: number | null
  city: string
  phone: string
  images: string[]
  category: string
  selected?: boolean
  url?: string
  professionalName?: string
  address?: string
}

const adminNav = [
  { name: 'Dashboard', icon: Shield, href: '/admin', exact: true },
  { name: 'Annonces', icon: FileText, href: '/admin/annonces' },
  { name: 'Utilisateurs', icon: Shield, href: '/admin/utilisateurs' },
  { name: 'Catégories', icon: Shield, href: '/admin/categories' },
  { name: 'Messages', icon: Shield, href: '/admin/messages' },
  { name: 'Assistant IA', icon: Bot, href: '/admin/assistant-ia' },
]

export default function AssistantIAPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `🤖 **Assistant IA AlloSN - Import Intelligent**

Je peux scraper n'importe quel site d'annonces et extraire:
- 📝 **Titre** et **Description**
- 📷 **Photos** de l'annonce
- 📞 **Téléphone** (même caché derrière un bouton)
- 📍 **Localisation** précise

**Commandes:**
• \`scraper-deep [URL]\` - **Recommandé** - Parcourt TOUTES les pages de pagination et entre dans chaque annonce
• \`scraper [URL]\` - Scraper rapide d'une seule page

**Nouveau:** Je parcours automatiquement toutes les pages de pagination !
- Configurez le nombre de **Pages** (jusqu'à 100)
- Configurez le nombre d'**Annonces max** (jusqu'à 500)

**Exemple:**
\`scraper-deep https://www.expat-dakar.com/annonces/thies\`

Je vais:
1. Analyser la page de liste
2. Détecter et parcourir TOUTES les pages de pagination
3. Collecter tous les liens d'annonces
4. Entrer dans CHAQUE annonce pour extraire les détails`,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [scrapedAds, setScrapedAds] = useState<DetailedAd[]>([])
  const [showAdsPanel, setShowAdsPanel] = useState(false)
  const [maxPages, setMaxPages] = useState(10)
  const [maxAds, setMaxAds] = useState(100)
  const [expandedAd, setExpandedAd] = useState<number | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail')
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')

    if (adminLoggedIn === 'true' && adminEmail) {
      const superAdminEmails = ['Abdoulayegueye87@gmail.com', 'abdoulayegueye87@gmail.com']
      if (superAdminEmails.includes(adminEmail.toLowerCase())) {
        setIsAdmin(true)
      } else {
        router.push('/admin/login')
      }
    } else {
      router.push('/admin/login')
    }
    setLoading(false)
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminEmail')
    router.push('/admin/login')
  }

  const addMessage = (role: 'user' | 'assistant' | 'system', content: string, ads?: DetailedAd[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      ads
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }

  const updateLastMessage = (content: string) => {
    setMessages(prev => {
      const updated = [...prev]
      if (updated.length > 0) {
        updated[updated.length - 1] = { ...updated[updated.length - 1], content }
      }
      return updated
    })
  }

  const extractUrls = (text: string): string[] => {
    const urlRegex = /https?:\/\/[^\s]+/g
    return text.match(urlRegex) || []
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return

    const userMessage = inputValue.trim()
    setInputValue('')
    addMessage('user', userMessage)
    setIsProcessing(true)

    const urls = extractUrls(userMessage)
    const isDeepScrape = userMessage.toLowerCase().includes('scraper-deep') || 
                         userMessage.toLowerCase().includes('deep') ||
                         userMessage.toLowerCase().includes('détail')
    
    if (urls.length > 0) {
      const loadingMsg = addMessage('assistant', '🔍 Initialisation du scraping...')
      
      try {
        const action = isDeepScrape ? 'scrape-deep' : 'scrape'
        
        if (isDeepScrape) {
          updateLastMessage(
            `🔍 **Scraping en profondeur lancé**\n\n` +
            `📊 Configuration:\n` +
            `• Pages max: ${maxPages}\n` +
            `• Annonces max: ${maxAds}\n\n` +
            `⏳ Étapes:\n` +
            `1️⃣ Analyse de la première page...\n` +
            `2️⃣ Détection et parcours des pages de pagination...\n` +
            `3️⃣ Collecte de tous les liens d'annonces...\n` +
            `4️⃣ Scraping détaillé de chaque annonce...\n\n` +
            `⏰ Cela peut prendre plusieurs minutes selon le nombre d'annonces...`
          )
        } else {
          updateLastMessage('🔍 Analyse de la page en cours...')
        }

        const response = await fetch('/api/ai-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: action,
            url: urls[0],
            maxPages: maxPages,
            maxAds: maxAds
          })
        })

        const data = await response.json()

        setMessages(prev => prev.filter(m => m.id !== loadingMsg.id))

        if (data.success && data.ads && data.ads.length > 0) {
          setScrapedAds(data.ads.map((ad: DetailedAd) => ({ ...ad, selected: true })))
          setShowAdsPanel(true)
          
          const pagesInfo = data.totalPagesScraped 
            ? `📄 **${data.totalPagesScraped} pages** analysées\n`
            : ''
          const linksInfo = data.totalAdLinksFound 
            ? `🔗 **${data.totalAdLinksFound} liens** d'annonces trouvés\n`
            : ''

          const photosCount = data.ads.reduce((sum: number, ad: DetailedAd) => sum + (ad.images?.length || 0), 0)
          const phonesCount = data.ads.filter((ad: DetailedAd) => ad.phone).length
          
          addMessage('assistant', 
            `✅ **${data.totalFound} annonces extraites** de ${data.siteName} !\n\n` +
            `${pagesInfo}${linksInfo}\n` +
            `📊 **Détails extraits:**\n` +
            `• 📷 ${photosCount} photos trouvées\n` +
            `• 📞 ${phonesCount} numéros de téléphone\n\n` +
            `👆 Consultez et sélectionnez les annonces dans le panneau de droite.`,
            data.ads
          )
        } else {
          addMessage('assistant', 
            `❌ **Aucune annonce trouvée**\n\n` +
            `**Conseils:**\n` +
            `• Vérifiez que l'URL pointe vers une page d'annonces\n` +
            `• Utilisez \`scraper-deep [URL]\` pour un scraping complet\n` +
            `• Certains sites peuvent bloquer le scraping\n\n` +
            `**URLs testées:** ${data.allAdLinks?.slice(0, 3).join('\n') || 'Aucune'}`,
            []
          )
        }
      } catch (error) {
        setMessages(prev => prev.filter(m => m.id !== loadingMsg.id))
        addMessage('assistant', '❌ Erreur lors de l\'analyse. Vérifiez l\'URL et réessayez.')
      }
    } else {
      // Chat normal
      try {
        const response = await fetch('/api/ai-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'chat',
            message: userMessage
          })
        })

        const data = await response.json()
        addMessage('assistant', data.response || 'Je n\'ai pas compris.')
      } catch (error) {
        addMessage('assistant', '❌ Erreur de connexion.')
      }
    }

    setIsProcessing(false)
  }

  const toggleAdSelection = (index: number) => {
    setScrapedAds(prev => prev.map((ad, i) => 
      i === index ? { ...ad, selected: !ad.selected } : ad
    ))
  }

  const selectAllAds = (select: boolean) => {
    setScrapedAds(prev => prev.map(ad => ({ ...ad, selected: select })))
  }

  const importSelectedAds = async () => {
    const selectedAds = scrapedAds.filter(ad => ad.selected)
    if (selectedAds.length === 0) return

    setIsProcessing(true)
    addMessage('assistant', `⏳ Import de ${selectedAds.length} annonce(s)...`)

    try {
      const response = await fetch('/api/ai-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk-import',
          ads: selectedAds
        })
      })

      const data = await response.json()

      if (data.success) {
        addMessage('assistant', 
          `✅ **Import terminé !**\n\n` +
          `• ✅ Réussies : ${data.successCount}\n` +
          `• ❌ Échouées : ${data.failedCount}\n\n` +
          `🎉 Les annonces sont sur AlloSN !\n\n` +
          `[Voir les annonces](/admin/annonces)`
        )
        setScrapedAds([])
        setShowAdsPanel(false)
      }
    } catch (error) {
      addMessage('assistant', '❌ Erreur lors de l\'import.')
    }

    setIsProcessing(false)
  }

  const importSingleAd = async (ad: DetailedAd) => {
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/ai-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-ad',
          ad: ad
        })
      })

      const data = await response.json()
      
      if (data.success) {
        addMessage('assistant', 
          `✅ **Annonce créée !**\n\n` +
          `**Titre:** ${ad.title}\n` +
          `**Téléphone:** ${ad.phone || 'Non renseigné'}\n` +
          `**Photos:** ${ad.images?.length || 0}\n` +
          `**Code:** ${data.reclamCode}`
        )
        setScrapedAds(prev => prev.filter(a => a !== ad))
      }
    } catch (error) {
      addMessage('assistant', '❌ Erreur lors de la création.')
    }

    setIsProcessing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-green-500" />
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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.name === 'Assistant IA' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
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
      <main className="flex-1 flex flex-col lg:flex-row min-h-screen">
        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${showAdsPanel ? 'lg:w-1/2' : 'w-full'}`}>
          {/* Header */}
          <header className="bg-white shadow-sm p-4 flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800">Assistant IA</h1>
                <p className="text-xs text-gray-500">Import intelligent avec détails</p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                En ligne
              </span>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] lg:max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-white shadow-md text-gray-800'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 text-green-600 text-sm font-medium">
                      <Bot className="h-4 w-4" />
                      Assistant IA
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
                    ).map((part, i) => {
                      if (typeof part === 'string' && part.includes('[Voir les annonces]')) {
                        return (
                          <Link key={i} href="/admin/annonces" className="text-green-600 hover:underline font-medium">
                            Voir les annonces
                          </Link>
                        )
                      }
                      return part
                    })}
                  </div>

                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-green-200' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isProcessing && !messages.find(m => m.isLoading) && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Scraping en cours...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t p-4">
            {/* Settings */}
            <div className="flex items-center gap-4 mb-3 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Pages:</span>
                <select
                  value={maxPages}
                  onChange={(e) => setMaxPages(parseInt(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Annonces max:</span>
                <select
                  value={maxAds}
                  onChange={(e) => setMaxAds(parseInt(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value={500}>500</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Collez une URL ou tapez scraper-deep [URL]..."
                className="flex-1 rounded-xl py-3"
                disabled={isProcessing}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-xl"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => setInputValue('scraper-deep https://www.expat-dakar.com/annonces/')}
                className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
              >
                <Layers className="h-3 w-3" />
                Scraper en profondeur
              </button>
              <button
                onClick={() => setInputValue('scraper https://')}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors"
              >
                Scraper simple
              </button>
              <button
                onClick={() => setInputValue('Aide')}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors"
              >
                ❓ Aide
              </button>
            </div>
          </div>
        </div>

        {/* Ads Panel */}
        {showAdsPanel && scrapedAds.length > 0 && (
          <div className="w-full lg:w-1/2 bg-white border-l flex flex-col h-[50vh] lg:h-auto">
            {/* Panel Header */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Annonces ({scrapedAds.filter(a => a.selected).length}/{scrapedAds.length})
                </h2>
                <button onClick={() => setShowAdsPanel(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => selectAllAds(true)}
                  className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200"
                >
                  Tout sélectionner
                </button>
                <button
                  onClick={() => selectAllAds(false)}
                  className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200"
                >
                  Tout désélectionner
                </button>
                <button
                  onClick={importSelectedAds}
                  disabled={scrapedAds.filter(a => a.selected).length === 0 || isProcessing}
                  className="ml-auto bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Importer ({scrapedAds.filter(a => a.selected).length})
                </button>
              </div>
            </div>

            {/* Ads List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {scrapedAds.map((ad, index) => (
                <div
                  key={index}
                  className={`border rounded-xl overflow-hidden transition-all ${
                    ad.selected 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Header clickable */}
                  <div 
                    onClick={() => toggleAdSelection(index)}
                    className="p-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                        ad.selected ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}>
                        {ad.selected && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800">{ad.title}</h3>
                        
                        <div className="flex flex-wrap gap-2 mt-2 text-xs">
                          {ad.price && (
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                              {ad.price.toLocaleString()} FCFA
                            </span>
                          )}
                          {ad.city && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {ad.city}
                            </span>
                          )}
                          {ad.category && (
                            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                              {ad.category}
                            </span>
                          )}
                        </div>

                        {/* Phone - important! */}
                        {ad.phone && (
                          <div className="mt-2 flex items-center gap-2 text-green-600 font-medium">
                            <Phone className="h-4 w-4" />
                            {ad.phone}
                          </div>
                        )}

                        {/* Photos indicator */}
                        {ad.images && ad.images.length > 0 && (
                          <div className="mt-2 flex items-center gap-1 text-gray-500 text-xs">
                            <ImageIcon className="h-3 w-3" />
                            {ad.images.length} photo(s)
                          </div>
                        )}
                      </div>

                      {/* Expand button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setExpandedAd(expandedAd === index ? null : index)
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        {expandedAd === index ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedAd === index && (
                    <div className="border-t bg-gray-50 p-4 space-y-3">
                      {/* Images */}
                      {ad.images && ad.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {ad.images.slice(0, 6).map((img, i) => (
                            <img 
                              key={i} 
                              src={img} 
                              alt="" 
                              className="w-full h-20 object-cover rounded-lg"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Professional name */}
                      {ad.professionalName && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4" />
                          {ad.professionalName}
                        </div>
                      )}

                      {/* Address */}
                      {ad.address && (
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <MapPin className="h-4 w-4" />
                          {ad.address}
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-sm text-gray-600 whitespace-pre-line">{ad.description}</p>

                      {/* Source URL */}
                      {ad.url && (
                        <a 
                          href={ad.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Voir l'annonce originale
                        </a>
                      )}

                      {/* Import button */}
                      <button
                        onClick={() => importSingleAd(ad)}
                        disabled={isProcessing}
                        className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                      >
                        {isProcessing ? 'Import...' : 'Importer cette annonce'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
