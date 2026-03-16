#!/bin/bash

# ===========================================
# 🚀 AlloSN - Script de déploiement
# ===========================================

echo "🇸🇳 Préparation du déploiement AlloSN..."
echo ""

# Couleurs
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📦 Étape 1: Initialiser Git${NC}"
echo "   git init"
echo "   git add ."
echo "   git commit -m '🚀 Initial commit - AlloSN'"
echo ""

echo -e "${BLUE}🐙 Étape 2: Créer le repo GitHub${NC}"
echo "   1. Aller sur: ${ORANGE}https://github.com/new${NC}"
echo "   2. Nom du repo: allosn"
echo "   3. Ne PAS initialiser avec README"
echo "   4. Cliquer 'Create repository'"
echo ""

echo -e "${BLUE}📤 Étape 3: Pousser sur GitHub${NC}"
echo "   git remote add origin https://github.com/VOTRE-USER/allosn.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

echo -e "${BLUE}▲ Étape 4: Déployer sur Vercel${NC}"
echo "   1. Aller sur: ${ORANGE}https://vercel.com${NC}"
echo "   2. Se connecter avec GitHub"
echo "   3. Cliquer 'Add New Project'"
echo "   4. Importer le repo 'allosn'"
echo "   5. Ajouter la variable d'environnement:"
echo "      ${GREEN}DATABASE_URL${NC} = votre_url_supabase"
echo "   6. Cliquer 'Deploy'"
echo ""

echo -e "${BLUE}🗄️ Étape 5: Créer une base Supabase (GRATUIT)${NC}"
echo "   1. Aller sur: ${ORANGE}https://supabase.com${NC}"
echo "   2. Créer un nouveau projet"
echo "   3. Copier la Connection String (URI)"
echo "   Format: postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
echo ""

echo -e "${GREEN}✅ C'est tout ! Votre site sera en ligne !${NC}"
echo ""
echo "📝 Pour les mises à jour futures:"
echo "   git add ."
echo "   git commit -m 'Update'"
echo "   git push"
echo "   → Vercel déploie automatiquement !"
