# 🇸🇳 AlloSN - Plateforme d'Annonces au Sénégal

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)

## 📱 Description

**AlloSN** est une plateforme tout-en-un pour les annonces et services au Sénégal. Design mobile-first, moderne et rapide.

### Fonctionnalités

- 🏠 **Immobilier** - Vente et location
- 🔧 **Services** - Artisans, ménage, réparations
- 🚗 **Transport / Thiak Thiak** - Livreurs, covoiturage
- 🛒 **Vente / Commerce** - Téléphones, voitures, électroménager
- 🍽️ **Restauration** - Plats à vendre, traiteurs
- 📦 **Location** - Voitures, matériel
- 💼 **Emploi** - CDI, CDD, stages
- 📚 **Formation** - Cours particuliers
- 🎉 **Événementiel** - DJ, photographes

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/VOTRE-USERNAME/allosn.git
cd allosn

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env

# Initialiser la base de données
npm run db:push

# Lancer en développement
npm run dev
```

## 🌐 Déploiement

### Vercel (Recommandé)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VOTRE-USERNAME/allosn)

1. Push sur GitHub
2. Connecter à Vercel
3. Ajouter les variables d'environnement
4. Déployer !

### Variables d'environnement

```env
# Base de données (Supabase/Neon/PlanetScale)
DATABASE_URL="postgresql://..."

# NextAuth (optionnel)
NEXTAUTH_SECRET="votre-secret"
NEXTAUTH_URL="https://votre-domaine.com"
```

## 🛠️ Technologies

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Database**: Prisma ORM, PostgreSQL (production)
- **Icons**: Lucide React
- **Auth**: NextAuth.js (optionnel)

## 📁 Structure

```
allosn/
├── src/
│   ├── app/              # Pages Next.js App Router
│   │   ├── api/          # API Routes
│   │   ├── categorie/    # Pages catégories
│   │   ├── annonce/      # Pages annonces
│   │   └── publier/      # Publication
│   ├── components/       # Composants React
│   └── lib/              # Utilitaires
├── prisma/               # Schema base de données
└── public/               # Assets statiques
```

## 📱 Captures d'écran

| Accueil | Catégorie | Annonce |
|---------|-----------|---------|
| ![Home](docs/home.png) | ![Category](docs/category.png) | ![Ad](docs/ad.png) |

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit (`git commit -m 'Ajout amélioration'`)
4. Push (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir [LICENSE](LICENSE)

---

Fait avec ❤️ pour le Sénégal 🇸🇳
