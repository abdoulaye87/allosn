import { firestore } from '@/lib/firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { NextResponse } from 'next/server'

// Collection references
const adsCollection = collection(firestore, 'ads')
const categoriesCollection = collection(firestore, 'categories')
const citiesCollection = collection(firestore, 'cities')

export async function GET() {
  try {
    // Seed Categories
    const categories = [
      { name: 'Immobilier', icon: 'Home', slug: 'immobilier', color: '#3B82F6' },
      { name: 'Services', icon: 'Wrench', slug: 'services', color: '#10B981' },
      { name: 'Transport', icon: 'Truck', slug: 'transport', color: '#F59E0B' },
      { name: 'Vente', icon: 'ShoppingBag', slug: 'vente', color: '#8B5CF6' },
      { name: 'Restauration', icon: 'Utensils', slug: 'restauration', color: '#EF4444' },
      { name: 'Location', icon: 'Package', slug: 'location', color: '#06B6D4' },
      { name: 'Emploi', icon: 'Briefcase', slug: 'emploi', color: '#6366F1' },
      { name: 'Formation', icon: 'GraduationCap', slug: 'formation', color: '#EC4899' },
      { name: 'Événementiel', icon: 'PartyPopper', slug: 'evenementiel', color: '#F97316' },
    ]

    // Check if categories already exist
    const existingCategories = await getDocs(categoriesCollection)
    if (existingCategories.empty) {
      for (const cat of categories) {
        await addDoc(categoriesCollection, cat)
      }
    }

    // Seed Cities
    const cities = [
      { name: 'Dakar', region: 'Dakar' },
      { name: 'Thiès', region: 'Thiès' },
      { name: 'Saint-Louis', region: 'Saint-Louis' },
      { name: 'Kaolack', region: 'Kaolack' },
      { name: 'Ziguinchor', region: 'Ziguinchor' },
      { name: 'Touba', region: 'Diourbel' },
      { name: 'Rufisque', region: 'Dakar' },
      { name: 'Mbour', region: 'Thiès' },
      { name: 'Diourbel', region: 'Diourbel' },
      { name: 'Louga', region: 'Louga' },
    ]

    const existingCities = await getDocs(citiesCollection)
    if (existingCities.empty) {
      for (const city of cities) {
        await addDoc(citiesCollection, city)
      }
    }

    // Seed sample ads
    const existingAds = await getDocs(adsCollection)
    if (existingAds.empty) {
      const categoryDocs = await getDocs(categoriesCollection)
      const categoryList = categoryDocs.docs.map(d => ({ id: d.id, ...d.data() }))

      const sampleAds = [
        {
          title: 'Appartement 3 pièces à Dakar Plateau',
          description: 'Bel appartement de 3 pièces situé à Dakar Plateau, proche de toutes les commodités. Salon spacieux, 2 chambres, cuisine équipée.',
          price: 350000,
          images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
          city: 'Dakar',
          phone: '+221 77 123 45 67',
          whatsapp: '+221 77 123 45 67',
          categoryId: categoryList[0]?.id || '',
          views: 0,
          isPremium: true,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Plombier professionnel disponible',
          description: 'Plombier expérimenté pour tous vos travaux de plomberie. Intervention rapide sur Dakar.',
          price: 15000,
          images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400'],
          city: 'Dakar',
          phone: '+221 78 234 56 78',
          whatsapp: '+221 78 234 56 78',
          categoryId: categoryList[1]?.id || '',
          views: 0,
          isPremium: false,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'iPhone 14 Pro Max - Excellent état',
          description: 'iPhone 14 Pro Max 256Go, couleur Or. Excellent état.',
          price: 750000,
          images: ['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400'],
          city: 'Thiès',
          phone: '+221 76 345 67 89',
          whatsapp: '',
          categoryId: categoryList[3]?.id || '',
          views: 0,
          isPremium: false,
          isFeatured: false,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Thiéboudienne maison à commander',
          description: 'Délicieux thiéboudienne préparé avec amour.',
          price: 3500,
          images: ['https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400'],
          city: 'Dakar',
          phone: '+221 77 456 78 90',
          whatsapp: '+221 77 456 78 90',
          categoryId: categoryList[4]?.id || '',
          views: 0,
          isPremium: false,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Chauffeur privé avec véhicule',
          description: 'Chauffeur professionnel avec véhicule climatisé.',
          price: 25000,
          images: ['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'],
          city: 'Dakar',
          phone: '+221 78 567 89 01',
          whatsapp: '',
          categoryId: categoryList[2]?.id || '',
          views: 0,
          isPremium: false,
          isFeatured: false,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Développeur Web recherché - CDI',
          description: 'Entreprise IT recherche développeur web full-stack.',
          price: null,
          images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'],
          city: 'Dakar',
          phone: '+221 77 789 01 23',
          whatsapp: '',
          categoryId: categoryList[6]?.id || '',
          views: 0,
          isPremium: false,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
      ]

      for (const ad of sampleAds) {
        await addDoc(adsCollection, ad)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Firebase seeded successfully!' 
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
