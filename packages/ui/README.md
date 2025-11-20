# @repo/ui

Package de composants UI partagés entre les applications web (Next.js) et mobile (Tauri).

## Technologies

- **shadcn/ui** - Composants UI accessibles et personnalisables
- **Radix UI** - Primitives UI headless
- **Tailwind CSS** - Utility-first CSS framework
- **CVA** - Class Variance Authority pour les variants de composants

## Composants disponibles

- `Button` - Bouton avec variants (default, destructive, outline, secondary, ghost, link)
- `Input` - Champ de saisie de texte
- `Label` - Label de formulaire
- `Card` - Carte avec Header, Title, Description, Content, Footer
- `Avatar` - Avatar avec Image et Fallback
- `Separator` - Séparateur horizontal/vertical

## Utilisation

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from "@repo/ui";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Titre</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## Styles

Pour utiliser les styles Tailwind, importez le fichier CSS global dans votre application :

```tsx
import "@repo/ui/src/styles/globals.css";
```

## Configuration Tailwind

Le fichier `tailwind.config.ts` contient la configuration Tailwind avec le thème personnalisé. Il peut être étendu dans les applications :

```ts
import type { Config } from "tailwindcss";
import baseConfig from "@repo/ui/tailwind.config";

const config: Config = {
  ...baseConfig,
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
```
