import { firestore } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { NextResponse } from 'next/server'

// Collection references
const adsCollection = collection(firestore, 'ads')
const categoriesCollection = collection(firestore, 'categories')
const subcategoriesCollection = collection(firestore, 'subcategories')
const citiesCollection = collection(firestore, 'cities')
const usersCollection = collection(firestore, 'users')

export async function GET() {
  try {
    const results = { categories: 0, subcategories: 0, cities: 0, users: 0, ads: 0 }

    // ========================================
    // 1. SEED CATEGORIES (9 principales)
    // ========================================
    const categories = [
      { name: 'Immobilier', icon: 'Home', slug: 'immobilier', color: '#3B82F6', description: 'Vente et location de biens immobiliers' },
      { name: 'Services', icon: 'Wrench', slug: 'services', color: '#10B981', description: 'Services professionnels et artisans' },
      { name: 'Transport', icon: 'Truck', slug: 'transport', color: '#F59E0B', description: 'Transport, livraison et covoiturage' },
      { name: 'Vente', icon: 'ShoppingBag', slug: 'vente', color: '#8B5CF6', description: 'Vente de produits et articles' },
      { name: 'Restauration', icon: 'Utensils', slug: 'restauration', color: '#EF4444', description: 'Plats, traiteurs et restaurants' },
      { name: 'Location', icon: 'Package', slug: 'location', color: '#06B6D4', description: 'Location de matériel et véhicules' },
      { name: 'Emploi', icon: 'Briefcase', slug: 'emploi', color: '#6366F1', description: 'Offres et demandes d\'emploi' },
      { name: 'Formation', icon: 'GraduationCap', slug: 'formation', color: '#EC4899', description: 'Cours et formations' },
      { name: 'Événementiel', icon: 'PartyPopper', slug: 'evenementiel', color: '#F97316', description: 'Organisation d\'événements' },
    ]

    const existingCategories = await getDocs(categoriesCollection)
    if (existingCategories.empty) {
      for (const cat of categories) {
        await addDoc(categoriesCollection, cat)
      }
      results.categories = categories.length
    } else {
      results.categories = existingCategories.size
    }

    // ========================================
    // 2. SEED SUBCATEGORIES
    // ========================================
    const categoryDocs = await getDocs(categoriesCollection)
    const categoryMap: Record<string, string> = {}
    categoryDocs.docs.forEach(doc => {
      categoryMap[doc.data().slug] = doc.id
    })

    const subcategories = [
      // Immobilier
      { name: 'Vente maison', slug: 'vente-maison', icon: 'Home', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Vente appartement', slug: 'vente-appartement', icon: 'Building', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Vente terrain', slug: 'vente-terrain', icon: 'Map', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Location maison', slug: 'location-maison', icon: 'Home', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Location appartement', slug: 'location-appartement', icon: 'Building', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Location bureau', slug: 'location-bureau', icon: 'Building2', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Location boutique', slug: 'location-boutique', icon: 'Store', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Colocation', slug: 'colocation', icon: 'Users', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Location courte durée', slug: 'location-courte-duree', icon: 'Calendar', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Location entrepôt', slug: 'location-entrepot', icon: 'Warehouse', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      
      // Services
      { name: 'Plombier', slug: 'plombier', icon: 'Droplets', parentSlug: 'services', parentId: categoryMap['services'] },
      { name: 'Électricien', slug: 'electricien', icon: 'Zap', parentSlug: 'services', parentId: categoryMap['services'] },
      { name: 'Maçon', slug: 'macon', icon: 'Hammer', parentSlug: 'services', parentId: categoryMap['services'] },
      { name: 'Carreleur', slug: 'carreleur', icon: 'Grid3X3', parentSlug: 'services', parentId: categoryMap['services'] },
      { name: 'Peintre', slug: 'peintre', icon: 'Paintbrush', parentSlug: 'services', parentId: categoryMap['services'] },
      { name: 'Menuisier', slug: 'menuisier', icon: 'TreePine', parentSlug: 'services', parentId: categoryMap['services'] },
      { name: 'Serrurier', slug: 'serrurier', icon: 'Key', parentSlug: 'services', parentId: categoryMap['services'] },
      { name: 'Ménage', slug: 'menage', icon: 'Sparkles', parentSlug: 'services', parentId: categoryMap['services'] },
      { name: 'Jardinier', slug: 'jardinier', icon: 'Flower2', parentSlug: 'services', parentId: categoryMap['services'] },
      { name: 'Gardiennage', slug: 'gardiennage', icon: 'Shield', parentSlug: 'services', parentId: categoryMap['services'] },
      { name: 'Cuisinière', slug: 'cuisiniere', icon: 'ChefHat', parentSlug: 'services', parentId: categoryMap['services'] },
      { name: 'Réparateur électroménager', slug: 'reparateur-electromenager', icon: 'Wrench', parentSlug: 'services', parentId: categoryMap['services'] },
      { name: 'Climaticien', slug: 'climaticien', icon: 'Wind', parentSlug: 'services', parentId: categoryMap['services'] },
      { name: 'Réparateur téléphone', slug: 'reparateur-telephone', icon: 'Smartphone', parentSlug: 'services', parentId: categoryMap['services'] },
      { name: 'Réparateur ordinateur', slug: 'reparateur-ordinateur', icon: 'Laptop', parentSlug: 'services', parentId: categoryMap['services'] },
      
      // Transport
      { name: 'Covoiturage', slug: 'covoiturage', icon: 'Users', parentSlug: 'transport', parentId: categoryMap['transport'] },
      { name: 'Chauffeur privé', slug: 'chauffeur-prive', icon: 'Car', parentSlug: 'transport', parentId: categoryMap['transport'] },
      { name: 'Transport marchandises', slug: 'transport-marchandises', icon: 'Truck', parentSlug: 'transport', parentId: categoryMap['transport'] },
      { name: 'Déménagement', slug: 'demenagement', icon: 'Package', parentSlug: 'transport', parentId: categoryMap['transport'] },
      { name: 'Livraison colis', slug: 'livraison-colis', icon: 'Package', parentSlug: 'transport', parentId: categoryMap['transport'] },
      { name: 'Thiak Thiak / Livreur', slug: 'thiak-thiak', icon: 'Bike', parentSlug: 'transport', parentId: categoryMap['transport'] },
      { name: 'Taxi', slug: 'taxi', icon: 'Car', parentSlug: 'transport', parentId: categoryMap['transport'] },
      
      // Vente
      { name: 'Téléphones', slug: 'telephones', icon: 'Smartphone', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Ordinateurs', icon: 'Laptop', slug: 'ordinateurs', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Téléviseurs', slug: 'televiseurs', icon: 'Tv', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Électroménager', slug: 'electromenager', icon: 'Refrigerator', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Meubles', slug: 'meubles', icon: 'Sofa', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Vêtements', slug: 'vetements', icon: 'Shirt', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Chaussures', slug: 'chaussures', icon: 'Footprints', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Voitures', slug: 'voitures', icon: 'Car', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Motos', slug: 'motos', icon: 'Bike', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Vélos', slug: 'velos', icon: 'Bike', parentSlug: 'vente', parentId: categoryMap['vente'] },
      
      // Restauration
      { name: 'Plats à vendre', slug: 'plats-a-vendre', icon: 'ChefHat', parentSlug: 'restauration', parentId: categoryMap['restauration'] },
      { name: 'Traiteur', slug: 'traiteur', icon: 'UtensilsCrossed', parentSlug: 'restauration', parentId: categoryMap['restauration'] },
      { name: 'Fast-food', slug: 'fast-food', icon: 'Burger', parentSlug: 'restauration', parentId: categoryMap['restauration'] },
      { name: 'Snacks', slug: 'snacks', icon: 'Cookie', parentSlug: 'restauration', parentId: categoryMap['restauration'] },
      { name: 'Pâtisserie', slug: 'patisserie', icon: 'Cake', parentSlug: 'restauration', parentId: categoryMap['restauration'] },
      { name: 'Boissons', slug: 'boissons', icon: 'Coffee', parentSlug: 'restauration', parentId: categoryMap['restauration'] },
      
      // Location
      { name: 'Location voiture', slug: 'location-voiture', icon: 'Car', parentSlug: 'location', parentId: categoryMap['location'] },
      { name: 'Location moto', slug: 'location-moto', icon: 'Bike', parentSlug: 'location', parentId: categoryMap['location'] },
      { name: 'Location matériel chantier', slug: 'location-materiel-chantier', icon: 'HardHat', parentSlug: 'location', parentId: categoryMap['location'] },
      { name: 'Location générateur', slug: 'location-generateur', icon: 'Zap', parentSlug: 'location', parentId: categoryMap['location'] },
      { name: 'Location sono', slug: 'location-sono', icon: 'Speaker', parentSlug: 'location', parentId: categoryMap['location'] },
      { name: 'Location tentes & chaises', slug: 'location-tentes-chaises', icon: 'Tent', parentSlug: 'location', parentId: categoryMap['location'] },
      { name: 'Location matériel événementiel', slug: 'location-materiel-evenementiel', icon: 'PartyPopper', parentSlug: 'location', parentId: categoryMap['location'] },
      
      // Emploi
      { name: 'CDI', slug: 'cdi', icon: 'Briefcase', parentSlug: 'emploi', parentId: categoryMap['emploi'] },
      { name: 'CDD', slug: 'cdd', icon: 'FileText', parentSlug: 'emploi', parentId: categoryMap['emploi'] },
      { name: 'Stage', slug: 'stage', icon: 'GraduationCap', parentSlug: 'emploi', parentId: categoryMap['emploi'] },
      { name: 'Mission', slug: 'mission', icon: 'Target', parentSlug: 'emploi', parentId: categoryMap['emploi'] },
      { name: 'Emploi journalier', slug: 'emploi-journalier', icon: 'Clock', parentSlug: 'emploi', parentId: categoryMap['emploi'] },
      
      // Formation
      { name: 'Cours particuliers', slug: 'cours-particuliers', icon: 'BookOpen', parentSlug: 'formation', parentId: categoryMap['formation'] },
      { name: 'Langues', slug: 'langues', icon: 'Languages', parentSlug: 'formation', parentId: categoryMap['formation'] },
      { name: 'Informatique', slug: 'informatique', icon: 'Monitor', parentSlug: 'formation', parentId: categoryMap['formation'] },
      { name: 'Soutien scolaire', slug: 'soutien-scolaire', icon: 'School', parentSlug: 'formation', parentId: categoryMap['formation'] },
      { name: 'Formation professionnelle', slug: 'formation-professionnelle', icon: 'Award', parentSlug: 'formation', parentId: categoryMap['formation'] },
      { name: 'Permis conduire', slug: 'permis-conduire', icon: 'Car', parentSlug: 'formation', parentId: categoryMap['formation'] },
      
      // Événementiel
      { name: 'Organisation mariage', slug: 'organisation-mariage', icon: 'Heart', parentSlug: 'evenementiel', parentId: categoryMap['evenementiel'] },
      { name: 'DJ', slug: 'dj', icon: 'Music', parentSlug: 'evenementiel', parentId: categoryMap['evenementiel'] },
      { name: 'Photographe', slug: 'photographe', icon: 'Camera', parentSlug: 'evenementiel', parentId: categoryMap['evenementiel'] },
      { name: 'Vidéaste', slug: 'videaste', icon: 'Video', parentSlug: 'evenementiel', parentId: categoryMap['evenementiel'] },
      { name: 'Décoration', slug: 'decoration', icon: 'Palette', parentSlug: 'evenementiel', parentId: categoryMap['evenementiel'] },
      { name: 'Traiteur événementiel', slug: 'traiteur-evenementiel', icon: 'Utensils', parentSlug: 'evenementiel', parentId: categoryMap['evenementiel'] },
      { name: 'Animation', slug: 'animation', icon: 'PartyPopper', parentSlug: 'evenementiel', parentId: categoryMap['evenementiel'] },
      { name: 'Location salle', slug: 'location-salle', icon: 'Building', parentSlug: 'evenementiel', parentId: categoryMap['evenementiel'] },
    ]

    const existingSubcategories = await getDocs(subcategoriesCollection)
    if (existingSubcategories.empty) {
      for (const sub of subcategories) {
        if (sub.parentId) {
          await addDoc(subcategoriesCollection, sub)
        }
      }
      results.subcategories = subcategories.length
    } else {
      results.subcategories = existingSubcategories.size
    }

    // ========================================
    // 3. SEED CITIES (10 villes principales)
    // ========================================
    const cities = [
      { name: 'Dakar', region: 'Dakar', isPopular: true },
      { name: 'Thiès', region: 'Thiès', isPopular: true },
      { name: 'Saint-Louis', region: 'Saint-Louis', isPopular: true },
      { name: 'Kaolack', region: 'Kaolack', isPopular: true },
      { name: 'Ziguinchor', region: 'Ziguinchor', isPopular: false },
      { name: 'Touba', region: 'Diourbel', isPopular: true },
      { name: 'Rufisque', region: 'Dakar', isPopular: true },
      { name: 'Mbour', region: 'Thiès', isPopular: true },
      { name: 'Diourbel', region: 'Diourbel', isPopular: false },
      { name: 'Louga', region: 'Louga', isPopular: false },
      { name: 'Tambacounda', region: 'Tambacounda', isPopular: false },
      { name: 'Kolda', region: 'Kolda', isPopular: false },
      { name: 'Matam', region: 'Matam', isPopular: false },
      { name: 'Sédhiou', region: 'Sédhiou', isPopular: false },
      { name: 'Kédougou', region: 'Kédougou', isPopular: false },
    ]

    const existingCities = await getDocs(citiesCollection)
    if (existingCities.empty) {
      for (const city of cities) {
        await addDoc(citiesCollection, city)
      }
      results.cities = cities.length
    } else {
      results.cities = existingCities.size
    }

    // ========================================
    // 4. SEED SAMPLE USERS
    // ========================================
    const users = [
      { name: 'Amadou Diallo', email: 'amadou@test.sn', phone: '+221 77 123 45 67', city: 'Dakar', type: 'particular', avatar: '', createdAt: new Date().toISOString() },
      { name: 'Fatou Ndiaye', email: 'fatou@test.sn', phone: '+221 78 234 56 78', city: 'Thiès', type: 'professional', avatar: '', createdAt: new Date().toISOString() },
      { name: 'Moussa Sow', email: 'moussa@test.sn', phone: '+221 76 345 67 89', city: 'Dakar', type: 'particular', avatar: '', createdAt: new Date().toISOString() },
      { name: 'Aminata Fall', email: 'aminata@test.sn', phone: '+221 77 456 78 90', city: 'Saint-Louis', type: 'professional', avatar: '', createdAt: new Date().toISOString() },
    ]

    const existingUsers = await getDocs(usersCollection)
    if (existingUsers.empty) {
      for (const user of users) {
        await addDoc(usersCollection, user)
      }
      results.users = users.length
    } else {
      results.users = existingUsers.size
    }

    // ========================================
    // 5. SEED SAMPLE ADS
    // ========================================
    const existingAds = await getDocs(adsCollection)
    if (existingAds.empty) {
      const sampleAds = [
        // Immobilier
        {
          title: 'Appartement 3 pièces à Dakar Plateau',
          description: 'Bel appartement de 3 pièces situé à Dakar Plateau, proche de toutes les commodités. Salon spacieux, 2 chambres, cuisine équipée, salle de bain moderne. Immeuble avec gardien et parking.',
          price: 350000,
          images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
          city: 'Dakar',
          phone: '+221 77 123 45 67',
          whatsapp: '+221 77 123 45 67',
          categoryId: categoryMap['immobilier'],
          views: 0,
          isPremium: true,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Villa 4 chambres Almadies',
          description: 'Magnifique villa de 4 chambres avec jardin et piscine à Almadies. Terrain 400m², surface habitable 250m². Garage double.',
          price: 95000000,
          images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'],
          city: 'Dakar',
          phone: '+221 78 111 22 33',
          whatsapp: '+221 78 111 22 33',
          categoryId: categoryMap['immobilier'],
          views: 0,
          isPremium: true,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Terrain 400m² à Mbour',
          description: 'Terrain viabilisé de 400m² à Mbour, proche de la plage. Titre foncier disponible. Idéal pour construction villa.',
          price: 15000000,
          images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'],
          city: 'Mbour',
          phone: '+221 76 222 33 44',
          whatsapp: '',
          categoryId: categoryMap['immobilier'],
          views: 0,
          isPremium: false,
          isFeatured: false,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        // Services
        {
          title: 'Plombier professionnel disponible 7j/7',
          description: 'Plombier expérimenté pour tous vos travaux de plomberie : fuites, installations, dépannages. Intervention rapide sur Dakar et environs. Devis gratuit.',
          price: 15000,
          images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400'],
          city: 'Dakar',
          phone: '+221 78 234 56 78',
          whatsapp: '+221 78 234 56 78',
          categoryId: categoryMap['services'],
          views: 0,
          isPremium: false,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Électricien qualifié - Dépannage rapide',
          description: 'Électricien professionnel pour installations électriques, dépannages, mises aux normes. Travail soigné et garanti.',
          price: 20000,
          images: ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400'],
          city: 'Dakar',
          phone: '+221 77 333 44 55',
          whatsapp: '+221 77 333 44 55',
          categoryId: categoryMap['services'],
          views: 0,
          isPremium: false,
          isFeatured: false,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Femme de ménage - Service régulier',
          description: 'Femme de ménage expérimentée disponible pour service régulier ou ponctuel. Références disponibles. Travail soigné.',
          price: 5000,
          images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'],
          city: 'Dakar',
          phone: '+221 76 444 55 66',
          whatsapp: '',
          categoryId: categoryMap['services'],
          views: 0,
          isPremium: false,
          isFeatured: false,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        // Transport
        {
          title: 'Chauffeur privé avec véhicule climatisé',
          description: 'Chauffeur professionnel avec véhicule 4x4 climatisé. Disponible pour trajets longue distance, visites touristiques, courses. Service fiable et ponctuel.',
          price: 25000,
          images: ['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'],
          city: 'Dakar',
          phone: '+221 78 567 89 01',
          whatsapp: '+221 78 567 89 01',
          categoryId: categoryMap['transport'],
          views: 0,
          isPremium: false,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Livreur Thiak Thiak - Dakar et environs',
          description: 'Livraison rapide de colis, repas, courses. Moto disponible. Tarifs compétitifs. Service rapide et fiable.',
          price: 2000,
          images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
          city: 'Dakar',
          phone: '+221 77 555 66 77',
          whatsapp: '+221 77 555 66 77',
          categoryId: categoryMap['transport'],
          views: 0,
          isPremium: false,
          isFeatured: false,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        // Vente
        {
          title: 'iPhone 14 Pro Max 256Go - Excellent état',
          description: 'iPhone 14 Pro Max 256Go, couleur Or. Excellent état, avec boîte, chargeur et coque. Garantie encore valide 6 mois.',
          price: 750000,
          images: ['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400'],
          city: 'Thiès',
          phone: '+221 76 345 67 89',
          whatsapp: '',
          categoryId: categoryMap['vente'],
          views: 0,
          isPremium: false,
          isFeatured: false,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Samsung Galaxy S23 Ultra - Neuf',
          description: 'Samsung Galaxy S23 Ultra 512Go, couleur Noir. Neuf, jamais utilisé, encore scellé. Facture disponible.',
          price: 650000,
          images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400'],
          city: 'Dakar',
          phone: '+221 78 666 77 88',
          whatsapp: '+221 78 666 77 88',
          categoryId: categoryMap['vente'],
          views: 0,
          isPremium: false,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Toyota Camry 2018 - Très bon état',
          description: 'Toyota Camry 2018, automatique, climatisée. 85000 km. Très bon état général. Papier en règle.',
          price: 12500000,
          images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400'],
          city: 'Dakar',
          phone: '+221 77 777 88 99',
          whatsapp: '',
          categoryId: categoryMap['vente'],
          views: 0,
          isPremium: true,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        // Restauration
        {
          title: 'Thiéboudienne maison à commander',
          description: 'Délicieux thiéboudienne préparé avec amour. Poisson frais, légumes de saison. Commande 2h à l\'avance. Livraison possible.',
          price: 3500,
          images: ['https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400'],
          city: 'Dakar',
          phone: '+221 77 456 78 90',
          whatsapp: '+221 77 456 78 90',
          categoryId: categoryMap['restauration'],
          views: 0,
          isPremium: false,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Yassa poulet maison - Traiteur',
          description: 'Yassa poulet fait maison, mariné à l\'ancienne. Disponible en portions individuelles ou pour événements.',
          price: 2500,
          images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'],
          city: 'Dakar',
          phone: '+221 78 888 99 00',
          whatsapp: '+221 78 888 99 00',
          categoryId: categoryMap['restauration'],
          views: 0,
          isPremium: false,
          isFeatured: false,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        // Emploi
        {
          title: 'Développeur Web Full-Stack - CDI',
          description: 'Entreprise IT recherche développeur web full-stack. Compétences requises: React, Node.js, MongoDB. Salaire attractif. Poste basé à Dakar.',
          price: null,
          images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'],
          city: 'Dakar',
          phone: '+221 77 789 01 23',
          whatsapp: '',
          categoryId: categoryMap['emploi'],
          views: 0,
          isPremium: false,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Commercial terrain - CDD 6 mois',
          description: 'Société de distribution cherche commercial terrain dynamique. Expérience vente souhaitée. Rémunération fixe + primes.',
          price: null,
          images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'],
          city: 'Thiès',
          phone: '+221 76 999 00 11',
          whatsapp: '',
          categoryId: categoryMap['emploi'],
          views: 0,
          isPremium: false,
          isFeatured: false,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        // Formation
        {
          title: 'Cours de français tous niveaux',
          description: 'Professeur expérimenté propose des cours de français particuliers. Tous niveaux, préparation aux examens. Cours à domicile ou en ligne.',
          price: 5000,
          images: ['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400'],
          city: 'Saint-Louis',
          phone: '+221 78 890 12 34',
          whatsapp: '',
          categoryId: categoryMap['formation'],
          views: 0,
          isPremium: false,
          isFeatured: false,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Formation Excel - Débutant à Avancé',
          description: 'Formation complète Microsoft Excel. Niveaux débutant, intermédiaire et avancé. Certificat de formation délivré.',
          price: 25000,
          images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'],
          city: 'Dakar',
          phone: '+221 77 111 22 33',
          whatsapp: '+221 77 111 22 33',
          categoryId: categoryMap['formation'],
          views: 0,
          isPremium: false,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        // Événementiel
        {
          title: 'DJ pour tous événements',
          description: 'DJ professionnel pour mariages, baptêmes, anniversaires, soirées. Sonorisation complète incluse. Animation sur mesure.',
          price: 75000,
          images: ['https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400'],
          city: 'Dakar',
          phone: '+221 78 222 33 44',
          whatsapp: '+221 78 222 33 44',
          categoryId: categoryMap['evenementiel'],
          views: 0,
          isPremium: false,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Photographe professionnel',
          description: 'Photographe professionnel pour mariages, portraits, événements. Matériel professionnel. Album photo inclus.',
          price: 100000,
          images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
          city: 'Dakar',
          phone: '+221 77 333 44 55',
          whatsapp: '',
          categoryId: categoryMap['evenementiel'],
          views: 0,
          isPremium: true,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
      ]

      for (const ad of sampleAds) {
        await addDoc(adsCollection, ad)
      }
      results.ads = sampleAds.length
    } else {
      results.ads = existingAds.size
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Firebase database seeded successfully!',
      results
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
