'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import { 
  ArrowLeft, Camera, MapPin, DollarSign, Tag, FileText, 
  Phone, Check, ChevronRight, Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Category {
  id: string
  name: string
  icon: string
  slug: string
  color: string
}

interface City {
  id: string
  name: string
}

const steps = [
  { id: 1, name: 'Catégorie', icon: Tag },
  { id: 2, name: 'Détails', icon: FileText },
  { id: 3, name: 'Photos', icon: Camera },
  { id: 4, name: 'Publier', icon: Check },
]

export default function PublishPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [categories, setCategories] = useState<Category[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  
  // Form data
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          fetch('/api/firebase-categories'),
          fetch('/api/firebase-cities')
        ])
        const [catData, cityData] = await Promise.all([
          catRes.json(),
          cityRes.json()
        ])
        setCategories(catData)
        setCities(cityData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/firebase-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price: price || null,
          images,
          city,
          phone,
          whatsapp,
          categoryId: selectedCategory
        })
      })
      
      if (res.ok) {
        const ad = await res.json()
        router.push(`/annonce/${ad.id}`)
      }
    } catch (error) {
      console.error('Error publishing ad:', error)
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedCategory !== ''
      case 2:
        return title !== '' && description !== '' && city !== ''
      case 3:
        return true
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader />

      <main className="px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Publier une annonce</h1>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex flex-col items-center ${currentStep >= step.id ? 'text-orange-600' : 'text-gray-300'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.id ? 'bg-orange-500 text-white' : 'bg-gray-100'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${currentStep > step.id ? 'bg-orange-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Category */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-800">Choisissez une catégorie</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-2xl text-left transition-all ${
                    selectedCategory === category.id
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-white text-gray-700 shadow-sm hover:shadow-md'
                  }`}
                >
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Titre de l'annonce *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Appartement 3 pièces à Dakar"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez votre annonce en détail..."
                  rows={4}
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Prix (FCFA)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ex: 350000"
                    className="rounded-xl pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ville *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-gray-700 focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Sélectionner une ville</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 77 123 45 67"
                    className="rounded-xl pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ex: 77 123 45 67"
                    className="rounded-xl pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-800">Ajoutez des photos</h2>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-gray-600 mb-4">
                Ajoutez jusqu'à 5 photos pour votre annonce
              </p>
              
              <label className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-orange-600 transition-colors">
                <Camera className="h-5 w-5" />
                Choisir des photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const newImages = Array.from(e.target.files || []).map(
                      (_, i) => `https://picsum.photos/400/300?random=${Date.now() + i}`
                    )
                    setImages([...images, ...newImages].slice(0, 5))
                  }}
                />
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Preview & Publish */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-800">Prêt à publier ?</h2>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Catégorie</span>
                <span className="font-medium text-gray-800">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Titre</span>
                <span className="font-medium text-gray-800 text-right max-w-[60%]">{title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Prix</span>
                <span className="font-bold text-orange-600">
                  {price ? `${parseInt(price).toLocaleString('fr-SN')} FCFA` : 'Sur devis'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ville</span>
                <span className="font-medium text-gray-800">{city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Photos</span>
                <span className="font-medium text-gray-800">{images.length} photo(s)</span>
              </div>
            </div>

            {/* Premium options */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-start gap-3">
                <Sparkles className="h-6 w-6 text-amber-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Mettre en avant</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Augmentez la visibilité de votre annonce avec nos options premium
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="rounded-full border-amber-300 text-amber-700">
                      Vedette - 1 000 FCFA
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full border-amber-300 text-amber-700">
                      Premium - 2 500 FCFA
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 pt-4">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 rounded-xl py-3"
            >
              Retour
            </Button>
          )}
          
          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3"
            >
              Suivant
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3"
            >
              {loading ? 'Publication...' : 'Publier mon annonce'}
            </Button>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
