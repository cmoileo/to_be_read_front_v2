# Inkgora

Application de partage de revues littéraires - Réseau social de critiques de livres.

## Architecture

Monorepo utilisant pnpm workspaces et Turborepo.

### Apps

- **apps/web**: Application Next.js avec SSR pour le référencement
- **apps/mobile**: Application Tauri v2 pour iOS/Android/Desktop

### Packages

- **@repo/types**: Types TypeScript partagés
- **@repo/services**: Services métier réutilisables
- **@repo/api-client**: Client API avec TanStack Query
- **@repo/ui**: Composants UI avec shadcn/ui et Tailwind CSS

## Stack Technique

- **Monorepo**: pnpm + Turborepo
- **Frontend**: React 18, TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Data Management**: TanStack Query, Store, Form, Table
- **Routing**: Next.js App Router (web), TanStack Router (mobile)
- **Mobile/Desktop**: Tauri v2
- **Backend**: AdonisJS (API REST existante)

## Installation

```bash
pnpm install
```

## Développement

```bash
pnpm dev
```

## Build

```bash
pnpm build
```
