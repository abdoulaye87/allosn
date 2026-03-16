import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Create cities
    const cities = await Promise.all([
      db.city.upsert({ where: { name: 'Dakar' }, update: {}, create: { name: 'Dakar', region: 'Dakar' } }),
      db.city.upsert({ where: { name: 'Thiès' }, update: {}, create: { name: 'Thiès', region: 'Thiès' } }),
      db.city.upsert({ where: { name: 'Saint-Louis' }, update: {}, create: { name: 'Saint-Louis', region: 'Saint-Louis' } }),
      db.city.upsert({ where: { name: 'Kaolack' }, update: {}, create: { name: 'Kaolack', region: 'Kaolack' } }),
      db.city.upsert({ where: { name: 'Ziguinchor' }, update: {}, create: { name: 'Ziguinchor', region: 'Ziguinchor' } }),
      db.city.upsert({ where: { name: 'Touba' }, update: {}, create: { name: 'Touba', region: 'Diourbel' } }),
      db.city.upsert({ where: { name: 'Rufisque' }, update: {}, create: { name: 'Rufisque', region: 'Dakar' } }),
      db.city.upsert({ where: { name: 'Mbour' }, update: {}, create: { name: 'Mbour', region: 'Thiès' } }),
      db.city.upsert({ where: { name: 'Diourbel' }, update: {}, create: { name: 'Diourbel', region: 'Diourbel' } }),
      db.city.upsert({ where: { name: 'Louga' }, update: {}, create: { name: 'Louga', region: 'Louga' } }),
    ])

    // Create categories
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

    const createdCategories = await Promise.all(
      categories.map(cat => 
        db.category.upsert({
          where: { slug: cat.slug },
          update: {},
          create: cat
        })
      )
    )

    // Create subcategories
    const subcategories = [
      // Immobilier
      { name: 'Vente maison', slug: 'vente-maison', icon: 'Home', parentId: createdCategories[0].id },
      { name: 'Vente appartement', slug: 'vente-appartement', icon: 'Building', parentId: createdCategories[0].id },
      { name: 'Location maison', slug: 'location-maison', icon: 'Home', parentId: createdCategories[0].id },
      { name: 'Location appartement', slug: 'location-appartement', icon: 'Building', parentId: createdCategories[0].id },
      { name: 'Terrain', slug: 'terrain', icon: 'Map', parentId: createdCategories[0].id },
      // Services
      { name: 'Plombier', slug: 'plombier', icon: 'Droplets', parentId: createdCategories[1].id },
      { name: 'Électricien', slug: 'electricien', icon: 'Zap', parentId: createdCategories[1].id },
      { name: 'Maçon', slug: 'macon', icon: 'Hammer', parentId: createdCategories[1].id },
      { name: 'Ménage', slug: 'menage', icon: 'Sparkles', parentId: createdCategories[1].id },
      // Transport
      { name: 'Covoiturage', slug: 'covoiturage', icon: 'Users', parentId: createdCategories[2].id },
      { name: 'Livraison', slug: 'livraison', icon: 'Package', parentId: createdCategories[2].id },
      { name: 'Déménagement', slug: 'demenagement', icon: 'Truck', parentId: createdCategories[2].id },
      // Vente
      { name: 'Téléphones', slug: 'telephones', icon: 'Smartphone', parentId: createdCategories[3].id },
      { name: 'Voitures', slug: 'voitures', icon: 'Car', parentId: createdCategories[3].id },
      { name: 'Électroménager', slug: 'electromenager', icon: 'Tv', parentId: createdCategories[3].id },
      // Restauration
      { name: 'Plats à vendre', slug: 'plats-a-vendre', icon: 'ChefHat', parentId: createdCategories[4].id },
      { name: 'Traiteur', slug: 'traiteur', icon: 'UtensilsCrossed', parentId: createdCategories[4].id },
      // Emploi
      { name: 'CDI', slug: 'cdi', icon: 'Briefcase', parentId: createdCategories[6].id },
      { name: 'CDD', slug: 'cdd', icon: 'Clock', parentId: createdCategories[6].id },
      { name: 'Stage', slug: 'stage', icon: 'GraduationCap', parentId: createdCategories[6].id },
    ]

    await Promise.all(
      subcategories.map(sub => 
        db.category.upsert({
          where: { slug: sub.slug },
          update: {},
          create: sub as any
        })
      )
    )

    // Create a test user
    const user = await db.user.upsert({
      where: { email: 'test@allosn.sn' },
      update: {},
      create: {
        name: 'Test User',
        email: 'test@allosn.sn',
        password: 'hashed_password',
        phone: '+221 77 123 45 67',
        city: 'Dakar',
        type: 'particular'
      }
    })

    // Create sample ads
    const sampleAds = [
      {
        title: 'Appartement 3 pièces à Dakar Plateau',
        description: 'Bel appartement de 3 pièces situé à Dakar Plateau, proche de toutes les commodités. Salon spacieux, 2 chambres, cuisine équipée, salle de bain moderne.',
        price: 350000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400']),
        city: 'Dakar',
        phone: '+221 77 123 45 67',
        whatsapp: '+221 77 123 45 67',
        userId: user.id,
        categoryId: createdCategories[0].id,
        isFeatured: true,
        isPremium: true,
      },
      {
        title: 'Plombier professionnel disponible',
        description: 'Plombier expérimenté pour tous vos travaux de plomberie. Intervention rapide sur Dakar et environs. Devis gratuit.',
        price: 15000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400']),
        city: 'Dakar',
        phone: '+221 78 234 56 78',
        whatsapp: '+221 78 234 56 78',
        userId: user.id,
        categoryId: createdCategories[1].id,
        isFeatured: true,
      },
      {
        title: 'iPhone 14 Pro Max - Excellent état',
        description: 'iPhone 14 Pro Max 256Go, couleur Or. Excellent état, avec boîte et chargeur. Garantie encore valide.',
        price: 750000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400']),
        city: 'Thiès',
        phone: '+221 76 345 67 89',
        userId: user.id,
        categoryId: createdCategories[3].id,
      },
      {
        title: 'Thiéboudienne maison à commander',
        description: 'Délicieux thiéboudienne préparé avec amour. Poisson frais, légumes de saison. Commande 2h à l\'avance. Livraison possible.',
        price: 3500,
        images: JSON.stringify(['https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400']),
        city: 'Dakar',
        phone: '+221 77 456 78 90',
        whatsapp: '+221 77 456 78 90',
        userId: user.id,
        categoryId: createdCategories[4].id,
        isFeatured: true,
      },
      {
        title: 'Chauffeur privé avec véhicule',
        description: 'Chauffeur professionnel avec véhicule climatisé. Disponible pour trajets longue distance, visites touristiques, courses. Service fiable et ponctuel.',
        price: 25000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400']),
        city: 'Dakar',
        phone: '+221 78 567 89 01',
        userId: user.id,
        categoryId: createdCategories[2].id,
      },
      {
        title: 'Terrain 400m² à Mbour',
        description: 'Terrain viabilisé de 400m² à Mbour, proche de la plage. Titre foncier disponible. Idéal pour construction villa.',
        price: 15000000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400']),
        city: 'Mbour',
        phone: '+221 76 678 90 12',
        userId: user.id,
        categoryId: createdCategories[0].id,
      },
      {
        title: 'Développeur Web recherché - CDI',
        description: 'Entreprise IT recherche développeur web full-stack. Compétences requises: React, Node.js, MongoDB. Salaire attractif. Poste basé à Dakar.',
        price: null,
        images: JSON.stringify(['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400']),
        city: 'Dakar',
        phone: '+221 77 789 01 23',
        userId: user.id,
        categoryId: createdCategories[6].id,
        isFeatured: true,
      },
      {
        title: 'Cours de français tous niveaux',
        description: 'Professeur expérimenté propose des cours de français particuliers. Tous niveaux, préparation aux examens. Cours à domicile ou en ligne.',
        price: 5000,
        images: JSON.stringify(['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400']),
        city: 'Saint-Louis',
        phone: '+221 78 890 12 34',
        userId: user.id,
        categoryId: createdCategories[7].id,
      },
    ]

    await Promise.all(
      sampleAds.map(ad => 
        db.ad.create({
          data: ad
        })
      )
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully',
      cities: cities.length,
      categories: createdCategories.length 
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ success: false, error: 'Seed failed' }, { status: 500 })
  }
}
