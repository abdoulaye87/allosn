// Firebase Firestore Collections for AlloSN
// Helper functions to interact with the database

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import { firestore } from './firebase'

// Collection references
export const adsCollection = collection(firestore, 'ads')
export const categoriesCollection = collection(firestore, 'categories')
export const citiesCollection = collection(firestore, 'cities')
export const usersCollection = collection(firestore, 'users')

// Types
export interface Ad {
  id?: string
  title: string
  description: string
  price: number | null
  images: string[]
  city: string
  phone: string | null
  whatsapp: string | null
  userId: string
  categoryId: string
  views: number
  isPremium: boolean
  isFeatured: boolean
  status: 'active' | 'pending' | 'sold' | 'expired'
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id?: string
  name: string
  icon: string
  slug: string
  color: string | null
  parentId: string | null
}

export interface City {
  id?: string
  name: string
  region: string | null
}

// ============ ADS FUNCTIONS ============

// Get all ads with optional filters
export async function getAds(options: {
  category?: string
  city?: string
  featured?: boolean
  limitCount?: number
  lastDoc?: QueryDocumentSnapshot<DocumentData>
} = {}) {
  const { category, city, featured, limitCount = 20, lastDoc } = options

  let q = query(adsCollection, orderBy('createdAt', 'desc'), limit(limitCount))

  if (category) {
    q = query(q, where('categoryId', '==', category))
  }
  if (city) {
    q = query(q, where('city', '==', city))
  }
  if (featured) {
    q = query(q, where('isFeatured', '==', true))
  }
  if (lastDoc) {
    q = query(q, startAfter(lastDoc))
  }

  const snapshot = await getDocs(q)
  const ads = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Ad[]

  return { ads, lastDoc: snapshot.docs[snapshot.docs.length - 1] }
}

// Get a single ad by ID
export async function getAdById(id: string) {
  const docRef = doc(firestore, 'ads', id)
  const snapshot = await getDoc(docRef)
  
  if (!snapshot.exists()) return null

  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate(),
    updatedAt: snapshot.data().updatedAt?.toDate(),
  } as Ad
}

// Create a new ad
export async function createAd(adData: Omit<Ad, 'id' | 'views' | 'createdAt' | 'updatedAt'>) {
  const now = new Date()
  const docRef = await addDoc(adsCollection, {
    ...adData,
    views: 0,
    createdAt: now,
    updatedAt: now,
  })
  return docRef.id
}

// Update an ad
export async function updateAd(id: string, data: Partial<Ad>) {
  const docRef = doc(firestore, 'ads', id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  })
}

// Increment ad views
export async function incrementAdViews(id: string) {
  const docRef = doc(firestore, 'ads', id)
  const snapshot = await getDoc(docRef)
  if (snapshot.exists()) {
    await updateDoc(docRef, {
      views: (snapshot.data().views || 0) + 1,
    })
  }
}

// Delete an ad
export async function deleteAd(id: string) {
  await deleteDoc(doc(firestore, 'ads', id))
}

// ============ CATEGORIES FUNCTIONS ============

// Get all categories
export async function getCategories() {
  const snapshot = await getDocs(query(categoriesCollection, orderBy('name')))
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[]
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  const q = query(categoriesCollection, where('slug', '==', slug), limit(1))
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) return null
  
  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  } as Category
}

// ============ CITIES FUNCTIONS ============

// Get all cities
export async function getCities() {
  const snapshot = await getDocs(query(citiesCollection, orderBy('name')))
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as City[]
}

// ============ SEED DATA ============

// Seed initial data to Firestore
export async function seedDatabase() {
  // Seed Categories
  const categories = [
    { name: 'Immobilier', icon: 'Home', slug: 'immobilier', color: '#3B82F6', parentId: null },
    { name: 'Services', icon: 'Wrench', slug: 'services', color: '#10B981', parentId: null },
    { name: 'Transport', icon: 'Truck', slug: 'transport', color: '#F59E0B', parentId: null },
    { name: 'Vente', icon: 'ShoppingBag', slug: 'vente', color: '#8B5CF6', parentId: null },
    { name: 'Restauration', icon: 'Utensils', slug: 'restauration', color: '#EF4444', parentId: null },
    { name: 'Location', icon: 'Package', slug: 'location', color: '#06B6D4', parentId: null },
    { name: 'Emploi', icon: 'Briefcase', slug: 'emploi', color: '#6366F1', parentId: null },
    { name: 'Formation', icon: 'GraduationCap', slug: 'formation', color: '#EC4899', parentId: null },
    { name: 'Événementiel', icon: 'PartyPopper', slug: 'evenementiel', color: '#F97316', parentId: null },
  ]

  for (const cat of categories) {
    await addDoc(categoriesCollection, cat)
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

  for (const city of cities) {
    await addDoc(citiesCollection, city)
  }

  return { success: true, categories: categories.length, cities: cities.length }
}
