# 🚀 Guide Complet de Déploiement - AlloSN

> Ce guide vous accompagne pas à pas pour mettre AlloSN en ligne

---

# 📋 SOMMAIRE

1. [GitHub - Créer le repository](#1-github---créer-le-repository)
2. [Pousser le code sur GitHub](#2-pousser-le-code-sur-github)
3. [Vercel - Déployer le site](#3-vercel---déployer-le-site)
4. [Firebase - Configurer la base de données](#4-firebase---configurer-la-base-de-données)
5. [Connecter le tout](#5-connecter-le-tout)

---

# 1. GitHub - Créer le repository

## 🎯 Objectif
Créer un dépôt (repository) pour stocker votre code source.

---

## Étape 1.1 : Aller sur GitHub

```
🌐 URL: https://github.com
```

1. Ouvrez votre navigateur
2. Tapez `github.com` dans la barre d'adresse
3. Appuyez sur **Entrée**

---

## Étape 1.2 : Se connecter ou créer un compte

### Si vous avez déjà un compte :
```
┌─────────────────────────────────────────┐
│  GitHub                                  │
├─────────────────────────────────────────┤
│                                         │
│  [Username ou email    ] [Mot de passe ]│
│                                         │
│           [ Sign in ]                   │
│                                         │
└─────────────────────────────────────────┘
```

- Entrez votre **username** ou **email**
- Entrez votre **mot de passe**
- Cliquez sur **"Sign in"** (Se connecter)

### Si vous n'avez pas de compte :
```
┌─────────────────────────────────────────┐
│  Create your account                     │
├─────────────────────────────────────────┤
│                                         │
│  [Email address                 ]       │
│  [Password                      ]       │
│  [Username                      ]       │
│  ☐ Receive product updates              │
│                                         │
│        [ Create an account ]            │
│                                         │
└─────────────────────────────────────────┘
```

1. Cliquez sur **"Sign up"** (S'inscrire)
2. Entrez votre **email**
3. Créez un **mot de passe** fort
4. Choisissez un **username** (nom d'utilisateur)
5. Cliquez sur **"Create an account"**
6. Vérifiez votre email et confirmez

---

## Étape 1.3 : Accéder à la page de création

Une fois connecté, vous voyez cette page :

```
┌─────────────────────────────────────────────────────────┐
│  GitHub                              [+]  [Profile ▼]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │     🚀 Start a new repository                    │  │
│  │                                                   │  │
│  │     [ Create a new repository ]  ← CLIQUEZ ICI   │  │
│  │                                                   │  │
│  │     ou utilisez le menu:                         │  │
│  │     [+] (en haut à droite) → New repository      │  │
│  │                                                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Deux façons d'y accéder :**
- Cliquez sur **"Create a new repository"** (vert)
- OU cliquez sur le **+** en haut à droite → **"New repository"**

---

## Étape 1.4 : Remplir le formulaire

Vous arrivez sur cette page :

```
┌─────────────────────────────────────────────────────────┐
│  Create a new repository                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Owner: [votre-username ▼] / [allosn____________]      │
│         ↑                              ↑                │
│         Votre compte                  Nom: allosn       │
│                                                         │
│  Description: [Plateforme d'annonces Sénégal___]       │
│               ↑                                         │
│               Optionnel mais recommandé                 │
│                                                         │
│  ○ Public   ● Private                                   │
│    ↑           ↑                                        │
│    Visible    Caché                                     │
│    par tous   (choisir Public)                          │
│                                                         │
│  ☐ Add a README file        ← ❌ NE PAS COCHER         │
│  ☐ Add .gitignore           ← ❌ NE PAS COCHER         │
│  ☐ Choose a license         ← ❌ NE PAS COCHER         │
│                                                         │
│           [ Create repository ]                         │
│                       ↑                                 │
│               CLIQUEZ ICI à la fin                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Remplissez ainsi :

| Champ | Valeur |
|-------|--------|
| **Repository name** | `allosn` |
| **Description** | `Plateforme d'annonces au Sénégal` |
| **Public/Private** | ✅ **Public** (gratuit, nécessaire pour Vercel) |
| **Add a README file** | ❌ **Ne PAS cocher** |
| **Add .gitignore** | ❌ **Ne PAS cocher** |
| **Choose a license** | ❌ **Ne PAS cocher** |

---

## Étape 1.5 : Créer le repository

1. Vérifiez que tout est correct
2. Cliquez sur le bouton vert **"Create repository"**

---

## Étape 1.6 : Page de confirmation

Vous voyez maintenant cette page :

```
┌─────────────────────────────────────────────────────────┐
│  …or push an existing repository from the command line  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  git remote add origin https://github.com/USER/allosn..│
│  git branch -M main                                     │
│  git push -u origin main                                │
│                                                         │
│  [📋 Copier]                                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

✅ **Gardez cette page ouverte !** Nous allons utiliser ces commandes.

---

# 2. Pousser le code sur GitHub

## 🎯 Objectif
Envoyer votre code depuis votre ordinateur vers GitHub.

---

## Étape 2.1 : Ouvrir le terminal

### Sur Windows :
1. Appuyez sur `Windows + R`
2. Tapez `cmd`
3. Appuyez sur **Entrée**

### Sur Mac :
1. Appuyez sur `Command + Espace`
2. Tapez `terminal`
3. Appuyez sur **Entrée**

### Sur Linux :
1. Appuyez sur `Ctrl + Alt + T`

---

## Étape 2.2 : Aller dans le dossier du projet

```bash
# Remplacez le chemin par celui de votre projet
cd /chemin/vers/allosn

# Exemple :
# cd /home/user/allosn
# cd C:\Users\votre-nom\allosn
```

---

## Étape 2.3 : Lier votre projet à GitHub

Copiez et collez ces commandes une par une :

```bash
# 1. Ajouter le lien vers GitHub
# ⚠️ REMPLACEZ VOTRE-USER par votre username GitHub !
git remote add origin https://github.com/VOTRE-USER/allosn.git

# 2. Nommer la branche principale "main"
git branch -M main

# 3. Envoyer le code
git push -u origin main
```

---

## Étape 2.4 : Résultat attendu

Si tout fonctionne, vous voyez :

```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
Delta compression using up to 8 threads
Compressing objects: 100% (120/120), done.
Writing objects: 100% (150/150), 500.00 KiB | 2.00 MiB/s, done.
Total 150 (delta 30), reused 0 (delta 0), pack-reused 0
To https://github.com/VOTRE-USER/allosn.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ **Votre code est maintenant sur GitHub !**

---

## Étape 2.5 : Vérifier sur GitHub

1. Retournez sur votre navigateur
2. Rafraîchissez la page GitHub
3. Vous devez voir tous vos fichiers :

```
┌─────────────────────────────────────────────────────────┐
│  VOTRE-USER / allosn                    [Star] [Fork]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📁 src/                                                │
│  📁 prisma/                                             │
│  📁 public/                                             │
│  📄 README.md                                           │
│  📄 package.json                                        │
│  📄 .gitignore                                          │
│  📄 .env.example                                        │
│  ...                                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

# 3. Vercel - Déployer le site

## 🎯 Objectif
Mettre votre site en ligne gratuitement avec Vercel.

---

## Étape 3.1 : Aller sur Vercel

```
🌐 URL: https://vercel.com
```

1. Ouvrez un nouvel onglet
2. Tapez `vercel.com`
3. Appuyez sur **Entrée**

---

## Étape 3.2 : Se connecter avec GitHub

```
┌─────────────────────────────────────────────────────────┐
│  Vercel                                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│       Deploy to the Edge with Vercel                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │   [ Continue with GitHub ]  ← CLIQUEZ ICI       │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│        [ Continue with GitLab ]                        │
│        [ Continue with Bitbucket ]                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

1. Cliquez sur **"Continue with GitHub"**
2. Autorisez Vercel à accéder à votre compte GitHub
3. Cliquez sur **"Authorize Vercel"**

---

## Étape 3.3 : Importer le projet

Après connexion, vous voyez :

```
┌─────────────────────────────────────────────────────────┐
│  Import Git Repository                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🔍 Search: [___________________]                       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  VOTRE-USER/allosn                              │   │
│  │  Plateforme d'annonces au Sénégal               │   │
│  │                                     [Import →]   │   │
│  └─────────────────────────────────────────────────┘   │
│                        ↑                                │
│                    CLIQUEZ ICI                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

1. Trouvez votre repo `allosn` dans la liste
2. Cliquez sur **"Import"**

---

## Étape 3.4 : Configurer le projet

```
┌─────────────────────────────────────────────────────────┐
│  Configure Project                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Project Name: [allosn_____________]                   │
│                                                         │
│  Framework Preset: [Next.js ▼]  ← Auto-détecté ✅       │
│                                                         │
│  Root Directory: [./___________]  ← Laisser vide       │
│                                                         │
│  Build Command: [npm run build__]  ← Auto ✅           │
│                                                         │
│  Output Directory: [.next_________]  ← Auto ✅         │
│                                                         │
│  Install Command: [npm install____]  ← Auto ✅         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Ne changez rien**, Vercel détecte tout automatiquement !

---

## Étape 3.5 : Ajouter les variables d'environnement

```
┌─────────────────────────────────────────────────────────┐
│  Environment Variables                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Key: [DATABASE_URL_______________]                     │
│  Value: [votre-url-firebase_______]                     │
│         ↑                                               │
│         On l'obtiendra dans la section Firebase         │
│                                                         │
│  [Add Another]                                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

⚠️ **Pour l'instant, laissez vide.** 
Nous ajouterons la variable après avoir configuré Firebase.

---

## Étape 3.6 : Déployer (première fois)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│           [ Deploy ]                                    │
│               ↑                                         │
│           CLIQUEZ ICI                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Cliquez sur **"Deploy"**

Attendez 1-2 minutes pendant le déploiement :

```
┌─────────────────────────────────────────────────────────┐
│  Building...                                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░  65%                   │
│                                                         │
│  Installing dependencies...                             │
│  ✓ npm install                                          │
│  ⏳ Building...                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Étape 3.7 : Déploiement terminé

```
┌─────────────────────────────────────────────────────────┐
│  🎉 Congratulations!                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Your project has been deployed!                        │
│                                                         │
│  🔗 https://allosn-xxx.vercel.app                       │
│     ↑                                                   │
│     Cliquez pour voir votre site !                      │
│                                                         │
│  [Continue to Dashboard]                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

✅ **Votre site est en ligne !** (mais sans base de données pour l'instant)

---

# 4. Firebase - Configurer la base de données

## 🎯 Objectif
Créer une base de données Firestore gratuite pour stocker les annonces.

---

## Étape 4.1 : Aller sur Firebase

```
🌐 URL: https://console.firebase.google.com
```

1. Ouvrez un nouvel onglet
2. Tapez `console.firebase.google.com`
3. Appuyez sur **Entrée**

---

## Étape 4.2 : Se connecter avec Google

```
┌─────────────────────────────────────────────────────────┐
│  Firebase                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [ Sign in with Google ]  ← CLIQUEZ ICI                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

1. Cliquez sur **"Sign in with Google"**
2. Sélectionnez votre compte Google
3. Autorisez Firebase

---

## Étape 4.3 : Créer un projet

```
┌─────────────────────────────────────────────────────────┐
│  Firebase Console                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [+ Add project]  ← CLIQUEZ ICI                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Étape 4.4 : Nommer le projet

```
┌─────────────────────────────────────────────────────────┐
│  Create a project                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Project name: [allosn_______________]                  │
│                ↑                                        │
│                Tapez "allosn"                           │
│                                                         │
│  Project ID: allosn-xxxxx (auto-généré)                 │
│                                                         │
│  ☐ Enable Google Analytics for this project             │
│    ↑                                                    │
│    Peut rester décoché                                  │
│                                                         │
│  [ Continue ]                                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

1. Tapez **"allosn"** comme nom de projet
2. Cliquez sur **"Continue"**

---

## Étape 4.5 : Configurer Google Analytics (optionnel)

```
┌─────────────────────────────────────────────────────────┐
│  Configure Google Analytics                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [ Use an existing account ▼]                           │
│                                                         │
│  [ Create new account ] si vous n'en avez pas          │
│                                                         │
│  [ Enable Google Analytics ]                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

- Vous pouvez **ignorer** cette étape
- Ou configurer Analytics (recommandé)
- Cliquez sur **"Create project"**

---

## Étape 4.6 : Attendre la création

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│        ⏳ We're preparing your project...               │
│                                                         │
│        [░░░░░░░░░░░░░░░░░░░░░]                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Patientez environ **30 secondes**.

---

## Étape 4.7 : Projet créé !

```
┌─────────────────────────────────────────────────────────┐
│  🎉 Your new project is ready!                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [ Continue ]                                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Cliquez sur **"Continue"**

---

## Étape 4.8 : Choisir Firestore Database

Vous arrivez sur la console principale :

```
┌─────────────────────────────────────────────────────────┐
│  Project Overview | Build | Release | Engage | ...      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Build                                          │   │
│  │                                                 │   │
│  │  📱 Firestore Database  ← CLIQUEZ ICI           │   │
│  │  🗄️ Realtime Database                           │   │
│  │  📁 Storage                                      │   │
│  │  ⚙️ Functions                                   │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

1. Dans le menu de gauche, cliquez sur **"Build"**
2. Puis cliquez sur **"Firestore Database"**

---

## Étape 4.9 : Créer la base de données

```
┌─────────────────────────────────────────────────────────┐
│  Cloud Firestore                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [ Create database ]  ← CLIQUEZ ICI                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Étape 4.10 : Choisir le mode

```
┌─────────────────────────────────────────────────────────┐
│  Create Cloud Firestore Database                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ○ Start in production mode                             │
│    Règles strictes (recommandé)                         │
│                                                         │
│  ● Start in test mode                                   │
│    Ouvert en lecture/écriture (pour tester)             │
│    ↑                                                    │
│    CHOISISSEZ CECI POUR COMMENCER                       │
│                                                         │
│  [ Next ]                                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

1. Sélectionnez **"Start in test mode"**
2. Cliquez sur **"Next"**

---

## Étape 4.11 : Choisir la région

```
┌─────────────────────────────────────────────────────────┐
│  Select a Cloud Firestore location                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Location: [eur3 (Europe) ▼]                           │
│             ↑                                           │
│             Choisissez Europe (plus proche du Sénégal)  │
│                                                         │
│  [ Enable ]                                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

1. Choisissez **eur3 (Europe)** ou la région la plus proche
2. Cliquez sur **"Enable"**

---

## Étape 4.12 : Base de données créée !

```
┌─────────────────────────────────────────────────────────┐
│  Cloud Firestore                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📁 (default)                                           │
│                                                         │
│  [ + Start collection ]                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

✅ **Votre base Firestore est prête !**

---

## Étape 4.13 : Obtenir les identifiants

Nous devons maintenant configurer Firebase dans le projet.

### Retournez sur la page principale :

```
┌─────────────────────────────────────────────────────────┐
│  ⚙️ Project Settings (roue dentée en haut à droite)     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [ Project settings ]  ← CLIQUEZ ICI                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Étape 4.14 : Ajouter une application Web

```
┌─────────────────────────────────────────────────────────┐
│  Your apps                                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  There are no apps in your project.                     │
│                                                         │
│  [ </> ] [ Android ] [ iOS ] [ Flutter ] [ Unity ]     │
│    ↑                                                    │
│    Cliquez sur l'icône Web (</>)                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Cliquez sur l'icône **</>** (Web app)

---

## Étape 4.15 : Enregistrer l'app

```
┌─────────────────────────────────────────────────────────┐
│  Add Firebase to your web app                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  App nickname: [AlloSN Web______]                       │
│                ↑                                        │
│                Tapez un nom                             │
│                                                         │
│  ☐ Also set up Firebase Hosting                         │
│    ↑                                                    │
│    Peut rester décoché                                  │
│                                                         │
│  [ Register app ]                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

1. Tapez **"AlloSN Web"** comme surnom
2. Cliquez sur **"Register app"**

---

## Étape 4.16 : Copier la configuration

```
┌─────────────────────────────────────────────────────────┐
│  Add Firebase SDK                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  const firebaseConfig = {                               │
│    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",         │
│    authDomain: "allosn-xxxx.firebaseapp.com",           │
│    projectId: "allosn-xxxx",                            │
│    storageBucket: "allosn-xxxx.appspot.com",            │
│    messagingSenderId: "123456789",                       │
│    appId: "1:123456789:web:abcdef123456"                │
│  };                                                     │
│                                                         │
│  [📋 Copy]  ← COPIEZ TOUT                               │
│                                                         │
│  [ Continue to console ]                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

1. Cliquez sur **"Copy"** pour copier la config
2. Sauvegardez-la quelque part (fichier texte)
3. Cliquez sur **"Continue to console"**

---

# 5. Connecter le tout

## 🎯 Objectif
Connecter Firebase à votre projet Vercel.

---

## Étape 5.1 : Installer Firebase dans le projet

Ajouter le package Firebase au projet :

```bash
npm install firebase
```

---

## Étape 5.2 : Créer le fichier de configuration Firebase

Créer le fichier `src/lib/firebase.ts` :

```typescript
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
```

---

## Étape 5.3 : Ajouter les variables sur Vercel

1. Retournez sur **Vercel Dashboard**
2. Cliquez sur votre projet **"allosn"**
3. Cliquez sur **"Settings"** (en haut)
4. Cliquez sur **"Environment Variables"** (à gauche)

```
┌─────────────────────────────────────────────────────────┐
│  Environment Variables                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Add New:                                               │
│                                                         │
│  Key:   [NEXT_PUBLIC_FIREBASE_API_KEY_______]          │
│  Value: [AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX__]          │
│                                                         │
│  Environment: [☑ Production] [☑ Preview] [☑ Development]│
│                                                         │
│  [ Add ]                                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Ajoutez ces 6 variables :

| Variable | Valeur (exemple) |
|----------|-----------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyXXXXXX...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `allosn-xxxx.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `allosn-xxxx` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `allosn-xxxx.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123456789:web:abcdef` |

---

## Étape 5.4 : Redéployer

1. Dans Vercel, allez sur **"Deployments"**
2. Cliquez sur les **"..."** du dernier déploiement
3. Sélectionnez **"Redeploy"**

Ou simplement :

```bash
# Pousser un nouveau commit
git add .
git commit -m "Ajout Firebase"
git push
# → Vercel redéploie automatiquement
```

---

# ✅ FÉLICITATIONS !

Votre site AlloSN est maintenant :

- 🐙 **Sur GitHub** : code source accessible
- ▲ **Sur Vercel** : site en ligne 24/7
- 🔥 **Connecté à Firebase** : base de données prête

**URL de votre site :** `https://allosn-xxx.vercel.app`

---

# 📞 Besoin d'aide ?

Si vous bloquez sur une étape :

1. **GitHub** : https://docs.github.com
2. **Vercel** : https://vercel.com/docs
3. **Firebase** : https://firebase.google.com/docs

---

*Guide créé pour AlloSN - Plateforme d'annonces du Sénégal 🇸🇳*
