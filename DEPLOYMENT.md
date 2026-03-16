# Guide de Déploiement - AlloSN

## 📦 1. Préparation du projet

### Fichiers à ajouter

#### `.gitignore` (créer à la racine)
```
node_modules/
.next/
.env
.env.local
*.log
db/
.vercel
firebase-*.json
```

#### `README.md` (mettre à jour)
```markdown
# AlloSN - Plateforme d'Annonces au Sénégal

## Installation
\`\`\`bash
npm install
npm run db:push
npm run dev
\`\`\`

## Variables d'environnement
Créer un fichier \`.env\` avec :
\`\`\`
DATABASE_URL="file:./db/custom.db"
\`\`\`
```

---

## 🐙 2. GitHub - Hébergement du code

### Étape 1 : Initialiser Git
\`\`\`bash
# Dans le dossier du projet
git init
git add .
git commit -m "Initial commit - AlloSN plateforme"
\`\`\`

### Étape 2 : Créer le repo sur GitHub
1. Aller sur https://github.com/new
2. Nom du repo : `allosn`
3. Ne PAS initialiser avec README
4. Cliquer "Create repository"

### Étape 3 : Pousser le code
\`\`\`bash
git remote add origin https://github.com/VOTRE-USERNAME/allosn.git
git branch -M main
git push -u origin main
\`\`\`

### Commandes complètes
\`\`\`bash
# Initialisation
cd /home/z/my-project
git init

# Ajouter les fichiers
git add .

# Premier commit
git commit -m "🚀 Initial commit - AlloSN plateforme d'annonces Sénégal"

# Lier au repo distant (remplacer USERNAME)
git remote add origin https://github.com/USERNAME/allosn.git
git branch -M main
git push -u origin main
\`\`\`

---

## ▲ 3. Vercel - Déploiement facile (RECOMMANDÉ)

### Option A : Via le site web

1. **Aller sur** https://vercel.com
2. **Se connecter** avec GitHub
3. **Cliquer** "Add New..." → "Project"
4. **Importer** le repo `allosn`
5. **Configurer** :
   - Framework : Next.js (auto-détecté)
   - Root Directory : ./
   - Build Command : `npm run build`
   - Output Directory : `.next`
6. **Variables d'environnement** :
   ```
   DATABASE_URL="file:./db/custom.db"
   ```
7. **Cliquer** "Deploy"

### Option B : Via CLI

\`\`\`bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Pour la production
vercel --prod
\`\`\`

### ⚠️ Important pour la base de données

SQLite ne fonctionne pas sur Vercel (fichiers temporaires). Solutions :

#### Solution 1 : Utiliser PlanetScale (MySQL)
\`\`\`bash
npm install @prisma/adapter-planetscale
\`\`\`

Modifier `prisma/schema.prisma` :
\`\`\`prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
\`\`\`

#### Solution 2 : Utiliser Supabase (PostgreSQL) - GRATUIT
1. Créer un compte sur https://supabase.com
2. Créer un nouveau projet
3. Copier l'URL de connexion
4. Modifier le schéma Prisma :
\`\`\`prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
\`\`\`

#### Solution 3 : Utiliser Neon (PostgreSQL serverless) - GRATUIT
1. Aller sur https://neon.tech
2. Créer un projet
3. Copier la connexion string

---

## 🔥 4. Firebase Hosting

### Étape 1 : Installer Firebase CLI
\`\`\`bash
npm install -g firebase-tools
\`\`\`

### Étape 2 : Se connecter
\`\`\`bash
firebase login
\`\`\`

### Étape 3 : Initialiser Firebase
\`\`\`bash
firebase init
\`\`\`

Sélectionner :
- ✅ Hosting
- ✅ Functions (optionnel, pour l'API)

### Étape 4 : Configurer pour Next.js

Créer `firebase.json` :
\`\`\`json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
\`\`\`

### Étape 5 : Exporter Next.js en statique

Modifier `next.config.ts` :
\`\`\`typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
}
\`\`\`

### Étape 6 : Build et Deploy
\`\`\`bash
npm run build
firebase deploy
\`\`\`

### ⚠️ Limitation Firebase
Firebase Hosting ne supporte que le **static export**. 
Pour les fonctionnalités dynamiques (API), utiliser **Firebase Functions**.

---

## 📊 Comparatif

| Plateforme | Facilité | Base de données | Coût |
|------------|----------|-----------------|------|
| **Vercel** | ⭐⭐⭐⭐⭐ | PlanetScale, Supabase, Neon | Gratuit |
| **Firebase** | ⭐⭐⭐ | Firestore | Gratuit |
| **GitHub Pages** | ⭐⭐ | Aucune (static only) | Gratuit |

---

## 🏆 Recommandation

Pour AlloSN, je recommande :

1. **GitHub** pour le code source
2. **Vercel** pour l'hébergement
3. **Supabase** ou **Neon** pour la base PostgreSQL

### Workflow optimal
\`\`\`
GitHub (code) → Vercel (auto-déploy) → Supabase (DB)
\`\`\`

---

## 🚀 Déploiement rapide (1 commande)

Après configuration de Supabase :

\`\`\`bash
# Pousser sur GitHub
git add . && git commit -m "Update" && git push

# Vercel déploie automatiquement !
\`\`\`
