# Mobile App (Tauri v2)

Application mobile et desktop construite avec Tauri v2, React 18.3.1, et TanStack Router.

## Stack

- **Tauri** v2.9.3 - Framework pour applications natives
- **React** 18.3.1 - Bibliothèque UI
- **Vite** 6.4.1 - Build tool et dev server
- **TanStack Router** 1.94.4 - Routing file-based
- **TanStack Query** 5.62.7 - Data fetching et cache
- **TypeScript** 5.7.2 - Typage strict

## Structure

```
apps/mobile/
├── src/
│   ├── routes/          # Routes TanStack Router
│   │   ├── __root.tsx   # Layout racine
│   │   └── index.tsx    # Page d'accueil
│   ├── main.tsx         # Point d'entrée React
│   ├── routeTree.gen.ts # Routes générées automatiquement
│   └── vite-env.d.ts    # Types d'environnement
├── src-tauri/           # Code Rust Tauri
│   ├── src/
│   │   └── lib.rs       # Logique Rust
│   ├── Cargo.toml       # Dépendances Rust
│   └── tauri.conf.json  # Configuration Tauri
├── index.html           # HTML de base
├── vite.config.ts       # Configuration Vite
├── tailwind.config.ts   # Configuration Tailwind
├── tsconfig.json        # Configuration TypeScript
└── package.json         # Dépendances npm
```

## Développement

### Serveur de développement (web uniquement)

```bash
pnpm dev
```

Lance Vite sur http://localhost:1420

### Application Tauri complète (avec interface native)

```bash
pnpm tauri:dev
```

Lance Vite + ouvre une fenêtre native Tauri

## Build

### Build web

```bash
pnpm build
```

Génère le dossier `dist/`

### Build Tauri (desktop)

```bash
pnpm tauri:build
```

Génère les installateurs pour la plateforme actuelle dans `src-tauri/target/release/bundle/`

Formats disponibles :
- **Linux** : .deb, .appimage
- **macOS** : .app, .dmg
- **Windows** : .msi, .exe

## Configuration mobile (iOS/Android)

Pour activer le support mobile, installer les outils de développement iOS/Android :

```bash
pnpm tauri android init
pnpm tauri ios init
```

Puis lancer sur un émulateur/device :

```bash
pnpm tauri android dev
pnpm tauri ios dev
```

## Variables d'environnement

Fichier `.env.local` :

```env
VITE_API_URL=http://localhost:3333
```

## Routing

TanStack Router utilise un système de routes basé sur les fichiers.

### Ajouter une route

1. Créer un fichier dans `src/routes/` :
   - `src/routes/login.tsx` → `/login`
   - `src/routes/users/$id.tsx` → `/users/:id`
   - `src/routes/reviews/index.tsx` → `/reviews`

2. Le fichier `src/routeTree.gen.ts` est régénéré automatiquement par Vite

### Navigation

```tsx
import { Link } from "@tanstack/react-router";

function MyComponent() {
  return <Link to="/login">Se connecter</Link>;
}
```

## Intégration des packages

Tous les packages du monorepo sont disponibles :

```tsx
import { User, Review } from "@repo/types";
import { TokenStorage } from "@repo/services";
import { useLogin, useFeed } from "@repo/api-client";
import { Button, Card } from "@repo/ui";
```

## Tauri API

Accès aux fonctionnalités natives via `@tauri-apps/api` :

```tsx
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-shell";

await invoke("my_rust_function");
await open("https://example.com");
```

## DevTools

- **TanStack Router DevTools** : Affichées automatiquement en développement
- **TanStack Query DevTools** : Affichées automatiquement en développement
- **Vite HMR** : Hot Module Replacement activé
- **Rust Hot Reload** : Rechargement automatique du code Rust

## Troubleshooting

### Port 1420 déjà utilisé

```bash
lsof -ti:1420 | xargs kill -9
```

### Erreur de compilation Rust

```bash
cd src-tauri
cargo clean
cd ..
pnpm tauri:dev
```

### Erreur TypeScript sur les routes

```bash
rm src/routeTree.gen.ts
pnpm dev
```

Le fichier sera régénéré automatiquement.
