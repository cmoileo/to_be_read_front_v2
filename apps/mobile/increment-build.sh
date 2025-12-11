#!/bin/bash

# Script pour incrémenter automatiquement le build number iOS
# Usage: ./increment-build.sh

set -e

XCODE_PROJECT="ios/App/App.xcodeproj/project.pbxproj"

if [ ! -f "$XCODE_PROJECT" ]; then
    echo "❌ Projet Xcode introuvable: $XCODE_PROJECT"
    exit 1
fi

# Récupérer le build number actuel
CURRENT_BUILD=$(grep -m 1 "CURRENT_PROJECT_VERSION = " "$XCODE_PROJECT" | sed 's/.*= \(.*\);/\1/')

echo "📱 Build actuel: $CURRENT_BUILD"

# Incrémenter
NEW_BUILD=$((CURRENT_BUILD + 1))

echo "📱 Nouveau build: $NEW_BUILD"

# Remplacer dans le fichier (toutes les occurrences)
sed -i '' "s/CURRENT_PROJECT_VERSION = $CURRENT_BUILD;/CURRENT_PROJECT_VERSION = $NEW_BUILD;/g" "$XCODE_PROJECT"

echo "✅ Build number mis à jour: $CURRENT_BUILD → $NEW_BUILD"
