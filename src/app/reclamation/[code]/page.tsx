'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle, AlertCircle, Loader2, User, Mail, Phone, MapPin,
  Eye, FileText, Home, Wrench, Truck, ShoppingBag,
  Utensils, Package, Briefcase, GraduationCap, PartyPopper, ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const categoryIcons: Record<string, any> = {
  'immobilier': Home, 'services': Wrench, 'transport': Truck, 'vente': ShoppingBag,
  'restauration': Utensils, 'location': Package, 'emploi': Briefcase, 'formation': GraduationCap, 'evenementiel': PartyPopper
}

const categoryNames: Record<string, string> = {
  'immobilier': 'Immobilier', 'services': 'Services', 'transport': 'Transport', 'vente': 'Vente',
  'restauration': 'Restauration', 'location': 'Location', 'emploi': 'Emploi', 'formation': 'Formation', 'evenementiel': 'Événementiel'
}

interface PendingAd {
  id: string
  title: string
  description: string
  price: number | null
  phone: string
  email: string
  images: string[]
  city: string
  category: string
  status: string
  createdAt: string
}

function ReclamationContent() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [pendingAd, setPendingAd] = useState<PendingAd | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [claimedAdId, setClaimedAdId] = useState('')

  const [userForm, setUserForm] = useState({ name: '', email: '', phone: '' })

  useEffect(() => {
    fetchPendingAd()
    const userLoggedIn = localStorage.getItem('userLoggedIn')
    const userEmail = localStorage.getItem('userEmail')
    const userName = localStorage.getItem('userName')

    if (userLoggedIn === 'true') {
      setUserForm({
        name: userName || '',
        email: userEmail || '',
        phone: ''
      })
    }
  }, [code])

  const fetchPendingAd = async () => {
    try {
      const res = await fetch(`/api/reclamation?code=${code}`)
      const data = await res.json()

      if (data.success) {
        setPendingAd(data.pendingAd)
        setUserForm(prev => ({
          ...prev,
          phone: data.pendingAd.phone || '',
          email: data.pendingAd.email || prev.email
        }))
      } else {
        setError(data.error || 'Code invalide')
      }
    } catch (err) {
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async () => {
    if (!userForm.name || !userForm.email || !userForm.phone) {
      alert('Veuillez remplir tous les champs')
      return
    }

    setClaiming(true)
    try {
      localStorage.setItem('userLoggedIn', 'true')
      localStorage.setItem('userEmail', userForm.email)
      localStorage.setItem('userName', userForm.name)

      const res = await fetch('/api/reclamation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingAdId: pendingAd?.id,
          userId: `user-${Date.now()}`,
          userName: userForm.name,
          userEmail: userForm.email,
          userPhone: userForm.phone
        })
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(true)
        setClaimedAdId(data.adId)
      } else {
        alert('Erreur: ' + data.error)
      }
    } catch (err) {
      alert('Erreur lors de la réclamation')
    } finally {
      setClaiming(false)
    }
  }

  const Icon = pendingAd ? categoryIcons[pendingAd.category] || FileText : FileText

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de l'annonce...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Lien invalide</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Félicitations !</h1>
          <p className="text-gray-600 mb-6">L'annonce a été ajoutée à votre profil avec succès.</p>
          <div className="space-y-3">
            <Link href={claimedAdId ? `/annonce/${claimedAdId}` : '/'} className="block">
              <Button variant="outline" className="w-full"><Eye className="h-4 w-4 mr-2" />Voir mon annonce</Button>
            </Link>
            <Link href="/profil" className="block">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white"><User className="h-4 w-4 mr-2" />Mon profil</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-gray-800">Réclamer cette annonce</h1>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-4">
        {pendingAd && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {pendingAd.images && pendingAd.images.length > 0 && (
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img src={pendingAd.images[0]} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm text-orange-600 font-medium">{categoryNames[pendingAd.category] || pendingAd.category}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{pendingAd.title}</h2>
              {pendingAd.price && <p className="text-2xl font-bold text-orange-500 mb-3">{pendingAd.price.toLocaleString()} FCFA</p>}
              <p className="text-gray-600 mb-4">{pendingAd.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{pendingAd.city}</div>
                {pendingAd.phone && <div className="flex items-center gap-1"><Phone className="h-4 w-4" />{pendingAd.phone}</div>}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Confirmez vos informations</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Votre nom *</label>
              <Input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} placeholder="Votre nom complet" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <Input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="votre@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <Input value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} placeholder="+221 77 000 00 00" />
            </div>
          </div>
          <div className="mt-6">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold" onClick={handleClaim} disabled={claiming}>
              {claiming ? <><Loader2 className="h-5 w-5 animate-spin mr-2" />En cours...</> : <><CheckCircle className="h-5 w-5 mr-2" />Réclamer cette annonce</>}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ReclamationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-orange-500" /></div>}>
      <ReclamationContent />
    </Suspense>
  )
}
