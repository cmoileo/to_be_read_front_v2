#!/bin/bash

# Script complet pour déployer sur TestFlight
# Usage: ./deploy-testflight.sh

set -e

echo "🚀 Déploiement TestFlight"
echo ""

# 1. Incrémenter le build number
echo "📱 Étape 1/4: Incrémentation du build number..."
./increment-build.sh
echo ""

# 2. Copier .env.staging vers .env et build
echo "🏗️  Étape 2/4: Configuration staging et build du frontend..."
cp .env.staging .env
pnpm run build:staging
echo ""

# 3. Sync avec Capacitor
echo "📦 Étape 3/4: Sync Capacitor..."
npx cap sync ios
echo ""

# 4. Ouvrir Xcode
echo "📱 Étape 4/4: Ouverture de Xcode..."
echo ""
echo "✅ Prêt pour Archive !"
echo ""
echo "Dans Xcode:"
echo "  1. Sélectionnez 'Any iOS Device (arm64)'"
echo "  2. Product > Archive"
echo "  3. Distribute App > App Store Connect > Upload"
echo ""
read -p "Appuyez sur Entrée pour ouvrir Xcode..."

open ios/App/App.xcodeproj

echo "✅ Xcode ouvert !"
