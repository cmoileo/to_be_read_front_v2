# Configuration Firebase pour iOS (Capacitor 8 - Swift Package Manager)

## 📱 Capacitor 8 utilise Swift Package Manager (pas CocoaPods)

Depuis Capacitor 8, les dépendances iOS sont gérées via **Swift Package Manager** au lieu de CocoaPods.

## 🔧 Étapes pour ajouter Firebase

### 1. Ouvrir le projet Xcode
```bash
cd /Users/pouch/inkerclub/to_be_read_front_v2/apps/mobile
open ios/App/App.xcodeproj
```

### 2. Ajouter Firebase via Swift Package Manager

Dans Xcode :

1. **File** → **Add Package Dependencies...**
2. Dans la barre de recherche, entrez :
   ```
   https://github.com/firebase/firebase-ios-sdk
   ```
3. Cliquez sur **Add Package**
4. Sélectionnez la version (latest stable, généralement déjà sélectionnée)
5. Dans la liste des produits, cochez **uniquement** :
   - ✅ **FirebaseCore**
   - ✅ **FirebaseMessaging**
6. Cliquez sur **Add Package**

### 3. Activer les Capabilities

Dans Xcode :

1. Sélectionnez le projet "App" dans le navigateur
2. Sélectionnez le target "App"
3. Allez dans l'onglet **"Signing & Capabilities"**
4. Cliquez sur **"+ Capability"** en haut à gauche
5. Ajoutez **"Push Notifications"**
6. Cliquez à nouveau sur **"+ Capability"**
7. Ajoutez **"Background Modes"**
8. Dans Background Modes, cochez **"Remote notifications"**

### 4. Configurer les GoogleService-Info.plist

Vous avez 2 fichiers plist dans le dossier :
- `GoogleService-Info-Staging.plist`
- `GoogleService-Info-Production.plist`

#### Option 1 : Utiliser un seul plist (Recommandé pour commencer)

Renommez celui que vous voulez utiliser :
```bash
cd /Users/pouch/inkerclub/to_be_read_front_v2/apps/mobile/ios/App/App
cp GoogleService-Info-Staging.plist GoogleService-Info.plist
```

Dans Xcode, ajoutez `GoogleService-Info.plist` au projet (drag & drop dans le projet).

#### Option 2 : Script pour switcher automatiquement (Avancé)

Créez un script de build qui copie le bon plist selon l'environnement.

### 5. Vérifier le code AppDelegate

Le code dans `AppDelegate.swift` est déjà configuré ✅

### 6. Build et Test

1. Branchez un iPhone physique (les notifications ne fonctionnent pas sur simulateur)
2. Sélectionnez votre device
3. Appuyez sur **Run** (⌘ + R)
4. L'app devrait compiler et s'installer

### 7. Configurer Apple Developer

Pour que les notifications fonctionnent :

1. **Apple Developer Portal** :
   - Créez un App ID si pas déjà fait
   - Activez "Push Notifications" capability
   - Générez un certificat APNs (Auth Key recommandé)

2. **Firebase Console** :
   - Allez dans **Project Settings** → **Cloud Messaging**
   - Onglet **iOS app**
   - Téléchargez votre clé APNs (.p8 file)
   - Ou configurez un certificat APNs

## 🐛 Troubleshooting

### Si Xcode ne trouve pas FirebaseCore après l'ajout

1. Fermez Xcode
2. Supprimez le cache :
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```
3. Rouvrez le projet

### Si vous avez des erreurs de build

1. **Product** → **Clean Build Folder** (Shift + ⌘ + K)
2. Rebuild

### Pour vérifier que Firebase est bien initialisé

Lancez l'app et regardez les logs dans la console Xcode. Vous devriez voir :
```
Firebase registration token: xxx...
```

## 📝 Note importante

Les notifications push ne fonctionnent **QUE** sur des devices physiques, pas sur le simulateur iOS.
