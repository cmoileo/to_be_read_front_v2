#!/bin/bash

# Script complet pour déployer sur iOS (TestFlight ou Production)
# Usage: 
#   ./deploy-testflight.sh staging  # Pour TestFlight
#   ./deploy-testflight.sh prod     # Pour Production

set -e

ENV=${1:-staging}

if [[ "$ENV" != "staging" && "$ENV" != "prod" ]]; then
    echo "❌ Erreur: environnement invalide"
    echo "Usage: ./deploy-testflight.sh [staging|prod]"
    exit 1
fi

if [[ "$ENV" == "staging" ]]; then
    ENV_DISPLAY="TestFlight (Staging)"
    ENV_FILE=".env.staging"
    BUILD_SCRIPT="build:staging"
    XCODE_CONFIG="Debug"
else
    ENV_DISPLAY="Production"
    ENV_FILE=".env.production"
    BUILD_SCRIPT="build:production"
    XCODE_CONFIG="Release"
fi

echo "🚀 Déploiement iOS - $ENV_DISPLAY"
echo ""

# 1. Incrémenter le build number
echo "📱 Étape 1/5: Incrémentation du build number..."
./increment-build.sh
echo ""

# 2. Copier le bon .env et build
echo "🏗️  Étape 2/5: Configuration $ENV et build du frontend..."
cp "$ENV_FILE" .env
pnpm run "$BUILD_SCRIPT"
echo ""

# 3. Copier la bonne configuration Firebase
echo "🔥 Étape 3/5: Configuration Firebase pour $ENV_DISPLAY..."
cd ios/App
bash copy-firebase-config.sh "$XCODE_CONFIG"
cd ../..
echo "✅ Firebase configuré"
echo ""

# 4. Sync avec Capacitor
echo "📦 Étape 4/5: Sync Capacitor..."
npx cap sync ios
echo ""

# 5. Ouvrir Xcode
echo "📱 Étape 5/5: Ouverture de Xcode..."
echo ""
echo "✅ Prêt pour Archive !"
echo ""
echo "Dans Xcode:"
echo "  1. Sélectionnez 'Any iOS Device (arm64)'"
if [[ "$ENV" == "staging" ]]; then
    echo "  2. Sélectionnez le scheme 'Debug'"
else
    echo "  2. Sélectionnez le scheme 'Release'"
fi
echo "  3. Product > Archive"
echo "  4. Distribute App > App Store Connect > Upload"
echo ""
read -p "Appuyez sur Entrée pour ouvrir Xcode..."

open ios/App/App.xcodeproj

echo "✅ Xcode ouvert !"
