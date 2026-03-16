import { firestore } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { NextResponse } from 'next/server'

// Collection references
const adsCollection = collection(firestore, 'ads')
const categoriesCollection = collection(firestore, 'categories')
const subcategoriesCollection = collection(firestore, 'subcategories')
const citiesCollection = collection(firestore, 'cities')
const regionsCollection = collection(firestore, 'regions')
const departmentsCollection = collection(firestore, 'departments')
const usersCollection = collection(firestore, 'users')
const adminsCollection = collection(firestore, 'admins')

export async function GET() {
  try {
    const results = { categories: 0, subcategories: 0, cities: 0, regions: 0, departments: 0, users: 0, admins: 0, ads: 0 }

    // ========================================
    // 1. SEED REGIONS (14 régions du Sénégal)
    // ========================================
    const regions = [
      { name: 'Dakar', code: 'DK', chefLieu: 'Dakar' },
      { name: 'Diourbel', code: 'DB', chefLieu: 'Diourbel' },
      { name: 'Fatick', code: 'FK', chefLieu: 'Fatick' },
      { name: 'Kaffrine', code: 'KA', chefLieu: 'Kaffrine' },
      { name: 'Kaolack', code: 'KL', chefLieu: 'Kaolack' },
      { name: 'Kédougou', code: 'KE', chefLieu: 'Kédougou' },
      { name: 'Kolda', code: 'KD', chefLieu: 'Kolda' },
      { name: 'Louga', code: 'LG', chefLieu: 'Louga' },
      { name: 'Matam', code: 'MT', chefLieu: 'Matam' },
      { name: 'Saint-Louis', code: 'SL', chefLieu: 'Saint-Louis' },
      { name: 'Sédhiou', code: 'SD', chefLieu: 'Sédhiou' },
      { name: 'Tambacounda', code: 'TC', chefLieu: 'Tambacounda' },
      { name: 'Thiès', code: 'TH', chefLieu: 'Thiès' },
      { name: 'Ziguinchor', code: 'ZG', chefLieu: 'Ziguinchor' },
    ]

    const existingRegions = await getDocs(regionsCollection)
    if (existingRegions.empty) {
      for (const region of regions) {
        await addDoc(regionsCollection, region)
      }
      results.regions = regions.length
    }

    // ========================================
    // 2. SEED DEPARTMENTS (46 départements)
    // ========================================
    const departments = [
      // Dakar (5 départements)
      { name: 'Dakar', region: 'Dakar' },
      { name: 'Guédiawaye', region: 'Dakar' },
      { name: 'Keur Massar', region: 'Dakar' },
      { name: 'Pikine', region: 'Dakar' },
      { name: 'Rufisque', region: 'Dakar' },
      // Diourbel (3)
      { name: 'Bambey', region: 'Diourbel' },
      { name: 'Diourbel', region: 'Diourbel' },
      { name: 'Mbacké', region: 'Diourbel' },
      // Fatick (3)
      { name: 'Fatick', region: 'Fatick' },
      { name: 'Foundiougne', region: 'Fatick' },
      { name: 'Gossas', region: 'Fatick' },
      // Kaffrine (4)
      { name: 'Birkelane', region: 'Kaffrine' },
      { name: 'Kaffrine', region: 'Kaffrine' },
      { name: 'Koungheul', region: 'Kaffrine' },
      { name: 'Malem Hodar', region: 'Kaffrine' },
      // Kaolack (3)
      { name: 'Guinguinéo', region: 'Kaolack' },
      { name: 'Kaolack', region: 'Kaolack' },
      { name: 'Nioro du Rip', region: 'Kaolack' },
      // Kédougou (3)
      { name: 'Kédougou', region: 'Kédougou' },
      { name: 'Salémata', region: 'Kédougou' },
      { name: 'Saraya', region: 'Kédougou' },
      // Kolda (3)
      { name: 'Kolda', region: 'Kolda' },
      { name: 'Médina Yoro Foulah', region: 'Kolda' },
      { name: 'Vélingara', region: 'Kolda' },
      // Louga (3)
      { name: 'Kébémer', region: 'Louga' },
      { name: 'Linguère', region: 'Louga' },
      { name: 'Louga', region: 'Louga' },
      // Matam (3)
      { name: 'Kanel', region: 'Matam' },
      { name: 'Matam', region: 'Matam' },
      { name: 'Ranérou Ferlo', region: 'Matam' },
      // Saint-Louis (3)
      { name: 'Dagana', region: 'Saint-Louis' },
      { name: 'Podor', region: 'Saint-Louis' },
      { name: 'Saint-Louis', region: 'Saint-Louis' },
      // Sédhiou (3)
      { name: 'Bounkiling', region: 'Sédhiou' },
      { name: 'Goudomp', region: 'Sédhiou' },
      { name: 'Sédhiou', region: 'Sédhiou' },
      // Tambacounda (4)
      { name: 'Bakel', region: 'Tambacounda' },
      { name: 'Goudiry', region: 'Tambacounda' },
      { name: 'Koumpentoum', region: 'Tambacounda' },
      { name: 'Tambacounda', region: 'Tambacounda' },
      // Thiès (4)
      { name: 'Fissel', region: 'Thiès' },
      { name: 'Mbour', region: 'Thiès' },
      { name: 'Thiès', region: 'Thiès' },
      { name: 'Tivaouane', region: 'Thiès' },
      // Ziguinchor (3)
      { name: 'Bignona', region: 'Ziguinchor' },
      { name: 'Oussouye', region: 'Ziguinchor' },
      { name: 'Ziguinchor', region: 'Ziguinchor' },
    ]

    const existingDepts = await getDocs(departmentsCollection)
    if (existingDepts.empty) {
      for (const dept of departments) {
        await addDoc(departmentsCollection, dept)
      }
      results.departments = departments.length
    }

    // ========================================
    // 3. SEED CITIES (Toutes les villes principales)
    // ========================================
    const cities = [
      // Région de Dakar
      { name: 'Dakar', region: 'Dakar', isPopular: true },
      { name: 'Pikine', region: 'Dakar', isPopular: true },
      { name: 'Guédiawaye', region: 'Dakar', isPopular: true },
      { name: 'Rufisque', region: 'Dakar', isPopular: true },
      { name: 'Keur Massar', region: 'Dakar', isPopular: false },
      { name: 'Bargny', region: 'Dakar', isPopular: false },
      { name: 'Diamniadio', region: 'Dakar', isPopular: false },
      { name: 'Sébikhotane', region: 'Dakar', isPopular: false },
      { name: 'Malika', region: 'Dakar', isPopular: false },
      { name: 'Jaxaay', region: 'Dakar', isPopular: false },
      { name: 'Ngor', region: 'Dakar', isPopular: false },
      { name: 'Ouakam', region: 'Dakar', isPopular: false },
      { name: 'Yoff', region: 'Dakar', isPopular: false },
      { name: 'Bambylor', region: 'Dakar', isPopular: false },
      
      // Région de Thiès
      { name: 'Thiès', region: 'Thiès', isPopular: true },
      { name: 'Mbour', region: 'Thiès', isPopular: true },
      { name: 'Tivaouane', region: 'Thiès', isPopular: true },
      { name: 'Saly', region: 'Thiès', isPopular: false },
      { name: 'Somone', region: 'Thiès', isPopular: false },
      { name: 'Ngaparou', region: 'Thiès', isPopular: false },
      { name: 'Nianing', region: 'Thiès', isPopular: false },
      { name: 'Pout', region: 'Thiès', isPopular: false },
      { name: 'Khombole', region: 'Thiès', isPopular: false },
      { name: 'Sandiara', region: 'Thiès', isPopular: false },
      { name: 'Fandène', region: 'Thiès', isPopular: false },
      { name: 'Diass', region: 'Thiès', isPopular: false },
      { name: 'Fissel', region: 'Thiès', isPopular: false },
      
      // Région de Diourbel
      { name: 'Diourbel', region: 'Diourbel', isPopular: true },
      { name: 'Touba', region: 'Diourbel', isPopular: true },
      { name: 'Mbacké', region: 'Diourbel', isPopular: false },
      { name: 'Bambey', region: 'Diourbel', isPopular: false },
      { name: 'Darou Mousty', region: 'Diourbel', isPopular: false },
      
      // Région de Saint-Louis
      { name: 'Saint-Louis', region: 'Saint-Louis', isPopular: true },
      { name: 'Richard Toll', region: 'Saint-Louis', isPopular: false },
      { name: 'Dagana', region: 'Saint-Louis', isPopular: false },
      { name: 'Podor', region: 'Saint-Louis', isPopular: false },
      { name: 'Ndioum', region: 'Saint-Louis', isPopular: false },
      { name: 'Ross Béthio', region: 'Saint-Louis', isPopular: false },
      { name: 'Bokhol', region: 'Saint-Louis', isPopular: false },
      
      // Région de Louga
      { name: 'Louga', region: 'Louga', isPopular: true },
      { name: 'Kébémer', region: 'Louga', isPopular: false },
      { name: 'Linguère', region: 'Louga', isPopular: false },
      { name: 'Dahra', region: 'Louga', isPopular: false },
      { name: 'Coki', region: 'Louga', isPopular: false },
      { name: 'Mpal', region: 'Louga', isPopular: false },
      
      // Région de Matam
      { name: 'Matam', region: 'Matam', isPopular: true },
      { name: 'Kanel', region: 'Matam', isPopular: false },
      { name: 'Ranérou', region: 'Matam', isPopular: false },
      { name: 'Ogo', region: 'Matam', isPopular: false },
      
      // Région de Kaolack
      { name: 'Kaolack', region: 'Kaolack', isPopular: true },
      { name: 'Guinguinéo', region: 'Kaolack', isPopular: false },
      { name: 'Nioro du Rip', region: 'Kaolack', isPopular: false },
      { name: 'Kahone', region: 'Kaolack', isPopular: false },
      
      // Région de Fatick
      { name: 'Fatick', region: 'Fatick', isPopular: false },
      { name: 'Foundiougne', region: 'Fatick', isPopular: false },
      { name: 'Gossas', region: 'Fatick', isPopular: false },
      { name: 'Diofior', region: 'Fatick', isPopular: false },
      { name: 'Sokone', region: 'Fatick', isPopular: false },
      
      // Région de Kaffrine
      { name: 'Kaffrine', region: 'Kaffrine', isPopular: false },
      { name: 'Koungheul', region: 'Kaffrine', isPopular: false },
      { name: 'Birkelane', region: 'Kaffrine', isPopular: false },
      { name: 'Malem Hodar', region: 'Kaffrine', isPopular: false },
      
      // Région de Tambacounda
      { name: 'Tambacounda', region: 'Tambacounda', isPopular: true },
      { name: 'Bakel', region: 'Tambacounda', isPopular: false },
      { name: 'Koumpentoum', region: 'Tambacounda', isPopular: false },
      { name: 'Goudiry', region: 'Tambacounda', isPopular: false },
      { name: 'Kidira', region: 'Tambacounda', isPopular: false },
      { name: 'Diawara', region: 'Tambacounda', isPopular: false },
      
      // Région de Kolda
      { name: 'Kolda', region: 'Kolda', isPopular: true },
      { name: 'Vélingara', region: 'Kolda', isPopular: false },
      { name: 'Médina Yoro Foulah', region: 'Kolda', isPopular: false },
      
      // Région de Sédhiou
      { name: 'Sédhiou', region: 'Sédhiou', isPopular: false },
      { name: 'Bounkiling', region: 'Sédhiou', isPopular: false },
      { name: 'Goudomp', region: 'Sédhiou', isPopular: false },
      
      // Région de Ziguinchor
      { name: 'Ziguinchor', region: 'Ziguinchor', isPopular: true },
      { name: 'Bignona', region: 'Ziguinchor', isPopular: false },
      { name: 'Oussouye', region: 'Ziguinchor', isPopular: false },
      { name: 'Diouloulou', region: 'Ziguinchor', isPopular: false },
      
      // Région de Kédougou
      { name: 'Kédougou', region: 'Kédougou', isPopular: false },
      { name: 'Salémata', region: 'Kédougou', isPopular: false },
      { name: 'Saraya', region: 'Kédougou', isPopular: false },
    ]

    const existingCities = await getDocs(citiesCollection)
    if (existingCities.empty) {
      for (const city of cities) {
        await addDoc(citiesCollection, city)
      }
      results.cities = cities.length
    }

    // ========================================
    // 4. SEED CATEGORIES (9 principales)
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
    }

    // ========================================
    // 5. SEED SUBCATEGORIES
    // ========================================
    const categoryDocs = await getDocs(categoriesCollection)
    const categoryMap: Record<string, string> = {}
    categoryDocs.docs.forEach(doc => {
      categoryMap[doc.data().slug] = doc.id
    })

    const subcategories = [
      // Transport - COVOITURAGE en premier pour visibilité
      { name: 'Covoiturage', slug: 'covoiturage', icon: 'Users', parentSlug: 'transport', parentId: categoryMap['transport'], isFeatured: true },
      { name: 'Thiak Thiak / Livreur', slug: 'thiak-thiak', icon: 'Bike', parentSlug: 'transport', parentId: categoryMap['transport'], isFeatured: true },
      { name: 'Chauffeur privé', slug: 'chauffeur-prive', icon: 'Car', parentSlug: 'transport', parentId: categoryMap['transport'] },
      { name: 'Transport marchandises', slug: 'transport-marchandises', icon: 'Truck', parentSlug: 'transport', parentId: categoryMap['transport'] },
      { name: 'Déménagement', slug: 'demenagement', icon: 'Package', parentSlug: 'transport', parentId: categoryMap['transport'] },
      { name: 'Livraison colis', slug: 'livraison-colis', icon: 'Package', parentSlug: 'transport', parentId: categoryMap['transport'] },
      { name: 'Taxi', slug: 'taxi', icon: 'Car', parentSlug: 'transport', parentId: categoryMap['transport'] },
      
      // Services - En premier pour visibilité
      { name: 'Plombier', slug: 'plombier', icon: 'Droplets', parentSlug: 'services', parentId: categoryMap['services'], isFeatured: true },
      { name: 'Électricien', slug: 'electricien', icon: 'Zap', parentSlug: 'services', parentId: categoryMap['services'], isFeatured: true },
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
      
      // Immobilier
      { name: 'Vente maison', slug: 'vente-maison', icon: 'Home', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Vente appartement', slug: 'vente-appartement', icon: 'Building', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Vente terrain', slug: 'vente-terrain', icon: 'Map', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Location maison', slug: 'location-maison', icon: 'Home', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Location appartement', slug: 'location-appartement', icon: 'Building', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Colocation', slug: 'colocation', icon: 'Users', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      { name: 'Location bureau', slug: 'location-bureau', icon: 'Building2', parentSlug: 'immobilier', parentId: categoryMap['immobilier'] },
      
      // Vente
      { name: 'Téléphones', slug: 'telephones', icon: 'Smartphone', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Ordinateurs', icon: 'Laptop', slug: 'ordinateurs', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Voitures', slug: 'voitures', icon: 'Car', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Motos', slug: 'motos', icon: 'Bike', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Électroménager', slug: 'electromenager', icon: 'Refrigerator', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Meubles', slug: 'meubles', icon: 'Sofa', parentSlug: 'vente', parentId: categoryMap['vente'] },
      { name: 'Vêtements', slug: 'vetements', icon: 'Shirt', parentSlug: 'vente', parentId: categoryMap['vente'] },
      
      // Restauration
      { name: 'Plats à vendre', slug: 'plats-a-vendre', icon: 'ChefHat', parentSlug: 'restauration', parentId: categoryMap['restauration'] },
      { name: 'Traiteur', slug: 'traiteur', icon: 'UtensilsCrossed', parentSlug: 'restauration', parentId: categoryMap['restauration'] },
      { name: 'Fast-food', slug: 'fast-food', icon: 'Burger', parentSlug: 'restauration', parentId: categoryMap['restauration'] },
      
      // Location
      { name: 'Location voiture', slug: 'location-voiture', icon: 'Car', parentSlug: 'location', parentId: categoryMap['location'] },
      { name: 'Location moto', slug: 'location-moto', icon: 'Bike', parentSlug: 'location', parentId: categoryMap['location'] },
      { name: 'Location matériel chantier', slug: 'location-materiel-chantier', icon: 'HardHat', parentSlug: 'location', parentId: categoryMap['location'] },
      { name: 'Location sono', slug: 'location-sono', icon: 'Speaker', parentSlug: 'location', parentId: categoryMap['location'] },
      
      // Emploi
      { name: 'CDI', slug: 'cdi', icon: 'Briefcase', parentSlug: 'emploi', parentId: categoryMap['emploi'] },
      { name: 'CDD', slug: 'cdd', icon: 'FileText', parentSlug: 'emploi', parentId: categoryMap['emploi'] },
      { name: 'Stage', slug: 'stage', icon: 'GraduationCap', parentSlug: 'emploi', parentId: categoryMap['emploi'] },
      { name: 'Emploi journalier', slug: 'emploi-journalier', icon: 'Clock', parentSlug: 'emploi', parentId: categoryMap['emploi'] },
      
      // Formation
      { name: 'Cours particuliers', slug: 'cours-particuliers', icon: 'BookOpen', parentSlug: 'formation', parentId: categoryMap['formation'] },
      { name: 'Langues', slug: 'langues', icon: 'Languages', parentSlug: 'formation', parentId: categoryMap['formation'] },
      { name: 'Informatique', slug: 'informatique', icon: 'Monitor', parentSlug: 'formation', parentId: categoryMap['formation'] },
      
      // Événementiel
      { name: 'Organisation mariage', slug: 'organisation-mariage', icon: 'Heart', parentSlug: 'evenementiel', parentId: categoryMap['evenementiel'] },
      { name: 'DJ', slug: 'dj', icon: 'Music', parentSlug: 'evenementiel', parentId: categoryMap['evenementiel'] },
      { name: 'Photographe', slug: 'photographe', icon: 'Camera', parentSlug: 'evenementiel', parentId: categoryMap['evenementiel'] },
      { name: 'Vidéaste', slug: 'videaste', icon: 'Video', parentSlug: 'evenementiel', parentId: categoryMap['evenementiel'] },
      { name: 'Décoration', slug: 'decoration', icon: 'Palette', parentSlug: 'evenementiel', parentId: categoryMap['evenementiel'] },
    ]

    const existingSubcategories = await getDocs(subcategoriesCollection)
    if (existingSubcategories.empty) {
      for (const sub of subcategories) {
        if (sub.parentId) {
          await addDoc(subcategoriesCollection, sub)
        }
      }
      results.subcategories = subcategories.length
    }

    // ========================================
    // 6. SEED SUPER ADMIN
    // ========================================
    const existingAdmins = await getDocs(adminsCollection)
    if (existingAdmins.empty) {
      await addDoc(adminsCollection, {
        email: 'Abdoulayegueye87@gmail.com',
        name: 'Super Admin',
        role: 'super_admin',
        password: 'Technique87@', // In production, this should be hashed
        createdAt: new Date().toISOString(),
        permissions: ['all']
      })
      results.admins = 1
    }

    // ========================================
    // 7. SEED SAMPLE ADS
    // ========================================
    const existingAds = await getDocs(adsCollection)
    if (existingAds.empty) {
      const sampleAds = [
        // Covoiturage - MISE EN AVANT
        {
          title: 'Covoiturage Dakar → Saint-Louis vendredi',
          description: 'Départ vendredi 7h de Dakar Plateau, arrivée Saint-Louis 10h. 3 places disponibles. Vétoyoyenne confortable et climatisée.',
          price: 5000,
          images: ['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'],
          city: 'Dakar',
          phone: '+221 77 111 22 33',
          whatsapp: '+221 77 111 22 33',
          categoryId: categoryMap['transport'],
          views: 0,
          isPremium: true,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Covoiturage Thiès → Dakar quotidien',
          description: 'Trajet quotidien Thiès-Dakar. Départ 7h30, retour 17h30. Places disponibles.',
          price: 2500,
          images: ['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'],
          city: 'Thiès',
          phone: '+221 78 222 33 44',
          whatsapp: '+221 78 222 33 44',
          categoryId: categoryMap['transport'],
          views: 0,
          isPremium: false,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        // Thiak Thiak
        {
          title: 'Livreur Thiak Thiak - Dakar tous quartiers',
          description: 'Livraison rapide de colis, repas, courses. Moto disponible. Tarifs compétitifs. Service rapide et fiable.',
          price: 2000,
          images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
          city: 'Dakar',
          phone: '+221 77 555 66 77',
          whatsapp: '+221 77 555 66 77',
          categoryId: categoryMap['transport'],
          views: 0,
          isPremium: false,
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        // Services - MISE EN AVANT
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
          isPremium: true,
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
          isFeatured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        {
          title: 'Maçon expérimenté - Construction & Rénovation',
          description: 'Maçon professionnel pour construction, rénovation, clôtures. Plus de 15 ans d\'expérience. Devis gratuit.',
          price: 25000,
          images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400'],
          city: 'Thiès',
          phone: '+221 76 444 55 66',
          whatsapp: '',
          categoryId: categoryMap['services'],
          views: 0,
          isPremium: false,
          isFeatured: false,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
        // Immobilier
        {
          title: 'Appartement 3 pièces à Dakar Plateau',
          description: 'Bel appartement de 3 pièces situé à Dakar Plateau, proche de toutes les commodités. Salon spacieux, 2 chambres, cuisine équipée.',
          price: 350000,
          images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
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
          title: 'Terrain 400m² à Mbour',
          description: 'Terrain viabilisé de 400m² à Mbour, proche de la plage. Titre foncier disponible.',
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
        // Vente
        {
          title: 'iPhone 14 Pro Max 256Go - Excellent état',
          description: 'iPhone 14 Pro Max 256Go, couleur Or. Excellent état, avec boîte et chargeur.',
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
        // Restauration
        {
          title: 'Thiéboudienne maison à commander',
          description: 'Délicieux thiéboudienne préparé avec amour. Poisson frais, légumes de saison. Commande 2h à l\'avance.',
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
        // Emploi
        {
          title: 'Développeur Web Full-Stack - CDI',
          description: 'Entreprise IT recherche développeur web full-stack. React, Node.js. Salaire attractif. Poste basé à Dakar.',
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
      ]

      for (const ad of sampleAds) {
        await addDoc(adsCollection, ad)
      }
      results.ads = sampleAds.length
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
