# Audit UX/UI Mobile Capacitor - Inkgora

## 📋 Résumé Exécutif

L'application mobile Inkgora utilise Capacitor avec une WebView pour offrir une expérience cross-platform. Bien que fonctionnelle, l'expérience utilisateur actuelle présente des lacunes par rapport aux applications natives. Cet audit identifie les améliorations prioritaires pour se rapprocher d'un feeling natif.

---

## 🔍 État Actuel

### Points Positifs Existants
- ✅ Gestion des Safe Areas iOS (notch, home indicator)
- ✅ PageTransition avec animations fade/slide
- ✅ AnimatedList avec stagger pour les listes
- ✅ SwipeBack gesture pour navigation retour
- ✅ Détection plateforme (Capacitor vs Web)
- ✅ Dark mode système détecté avant hydration
- ✅ Smooth scrolling iOS (`-webkit-overflow-scrolling: touch`)

### Lacunes Identifiées
- ❌ Splash screen désactivé (`launchShowDuration: 0`)
- ❌ Pas de gestion du mode offline
- ❌ Pas de feedback haptique
- ❌ Animations de transition entre pages basiques
- ❌ Pas de skeleton loaders uniformes
- ❌ Pull-to-refresh non natif
- ❌ Pas de gestion des erreurs réseau visuelles
- ❌ Status bar non personnalisée dynamiquement
- ❌ Pas de bottom sheet natif
- ❌ Keyboard handling non optimisé

---

## 🎯 Plan d'Amélioration par Priorité

### 🔴 Priorité Critique

#### 1. Splash Screen Natif
**Problème**: Le splash screen est désactivé, causant un écran blanc au lancement.

**Solution**:
```typescript
// capacitor.config.ts
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    launchAutoHide: true,
    backgroundColor: "#FFFFFF",
    androidSplashResourceName: "splash",
    androidScaleType: "CENTER_CROP",
    showSpinner: false,
    iosSpinnerStyle: "small",
    spinnerColor: "#999999",
    splashFullScreen: true,
    splashImmersive: true,
  }
}
```

**Fichiers à créer/modifier**:
- `capacitor.config.ts` - Configuration splash
- `ios/App/App/Assets.xcassets/Splash.imageset/` - Images splash iOS
- Créer un hook `useSplashScreen.ts` pour hide programmatique après hydration

---

#### 2. Gestion Mode Offline
**Problème**: Aucune indication si l'utilisateur est offline, les requêtes échouent silencieusement.

**Solution**: Créer un système de détection et affichage offline.

**Fichiers à créer**:

```typescript
// hooks/use-network-status.ts
import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    Network.getStatus().then(status => {
      setIsOnline(status.connected);
      setConnectionType(status.connectionType);
    });

    const listener = Network.addListener('networkStatusChange', status => {
      setIsOnline(status.connected);
      setConnectionType(status.connectionType);
    });

    return () => {
      listener.remove();
    };
  }, []);

  return { isOnline, connectionType };
}
```

```tsx
// components/offline-banner.tsx
export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  
  if (isOnline) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-destructive text-destructive-foreground 
                    py-2 px-4 text-center text-sm font-medium animate-in slide-in-from-top
                    pt-[calc(env(safe-area-inset-top)+0.5rem)]">
      <WifiOff className="inline w-4 h-4 mr-2" />
      {t('network.offline')}
    </div>
  );
}
```

**Package à installer**: `@capacitor/network`

---

#### 3. Feedback Haptique
**Problème**: Aucun retour tactile sur les interactions (like, follow, navigation).

**Solution**:

```typescript
// services/haptics.service.ts
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export class HapticsService {
  static async impact(style: 'light' | 'medium' | 'heavy' = 'medium') {
    const styles = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    };
    await Haptics.impact({ style: styles[style] });
  }

  static async notification(type: 'success' | 'warning' | 'error') {
    const types = {
      success: NotificationType.Success,
      warning: NotificationType.Warning,
      error: NotificationType.Error,
    };
    await Haptics.notification({ type: types[type] });
  }

  static async selection() {
    await Haptics.selectionStart();
  }
}
```

**Intégration dans les mutations**:
```typescript
// Dans use-feed-viewmodel.ts
const likeMutation = useMutation({
  mutationFn: (reviewId: number) => MobileReviewService.likeReview(reviewId),
  onMutate: async (reviewId) => {
    HapticsService.impact('light'); // Feedback immédiat
    // ... rest of optimistic update
  },
  onSuccess: () => {
    HapticsService.notification('success');
  },
  onError: () => {
    HapticsService.notification('error');
  },
});
```

**Package à installer**: `@capacitor/haptics`

---

### 🟡 Priorité Importante

#### 4. Pull-to-Refresh Natif
**Problème**: Le refresh actuel est un bouton, pas un gesture pull-to-refresh.

**Solution**:

```tsx
// components/pull-to-refresh.tsx
import { useRef, useState } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  disabled?: boolean;
}

export function PullToRefresh({ onRefresh, children, disabled }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const threshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || containerRef.current?.scrollTop !== 0) return;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, (currentY - startY.current) * 0.5);
    if (distance > 0 && containerRef.current?.scrollTop === 0) {
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      HapticsService.impact('medium');
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="overflow-y-auto h-full"
    >
      {/* Indicator */}
      <div 
        className="flex justify-center transition-all duration-200"
        style={{ 
          height: pullDistance,
          opacity: pullDistance / threshold 
        }}
      >
        <Loader2 className={cn(
          "w-6 h-6 text-primary",
          isRefreshing && "animate-spin"
        )} />
      </div>
      {children}
    </div>
  );
}
```

---

#### 5. Skeleton Loaders Uniformes
**Problème**: Les états de chargement varient entre les écrans.

**Solution**: Créer des skeletons réutilisables.

```tsx
// components/skeletons.tsx
export function ReviewCardSkeleton() {
  return (
    <div className="p-4 border rounded-xl animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-16" />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
      <div className="flex gap-4">
        <div className="h-8 bg-muted rounded w-16" />
        <div className="h-8 bg-muted rounded w-16" />
      </div>
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3].map(i => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-32 bg-muted" />
      <div className="px-4 -mt-12">
        <div className="w-24 h-24 rounded-full bg-muted border-4 border-background" />
        <div className="mt-4 space-y-2">
          <div className="h-6 bg-muted rounded w-32" />
          <div className="h-4 bg-muted rounded w-48" />
        </div>
      </div>
    </div>
  );
}
```

---

#### 6. Transitions de Page Améliorées
**Problème**: Les transitions actuelles sont basiques (fade/slide simple).

**Solution**: Utiliser des transitions type iOS avec shared element animation.

```typescript
// hooks/use-page-transition.ts
import { useRouter } from '@tanstack/react-router';

export function usePageTransition() {
  const router = useRouter();
  
  const navigateWithTransition = (to: string, direction: 'forward' | 'back' = 'forward') => {
    document.documentElement.classList.add(
      direction === 'forward' ? 'page-transition-forward' : 'page-transition-back'
    );
    
    router.navigate({ to });
    
    setTimeout(() => {
      document.documentElement.classList.remove(
        'page-transition-forward', 
        'page-transition-back'
      );
    }, 350);
  };

  return { navigateWithTransition };
}
```

```css
/* styles/page-transitions.css */
.page-transition-forward [data-page-content] {
  animation: slideInFromRight 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

.page-transition-back [data-page-content] {
  animation: slideInFromLeft 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
    opacity: 0.8;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInFromLeft {
  from {
    transform: translateX(-30%);
    opacity: 0.8;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

---

#### 7. Status Bar Dynamique
**Problème**: La status bar ne s'adapte pas au contenu de la page.

**Solution**:

```typescript
// hooks/use-status-bar.ts
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from 'react';
import { usePlatform } from './use-platform';

export function useStatusBar(style: 'light' | 'dark' | 'auto' = 'auto') {
  const { isMobile, isIOS } = usePlatform();

  useEffect(() => {
    if (!isMobile) return;

    const setStyle = async () => {
      if (style === 'auto') {
        const isDark = document.documentElement.classList.contains('dark');
        await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
      } else {
        await StatusBar.setStyle({ 
          style: style === 'dark' ? Style.Dark : Style.Light 
        });
      }
    };

    setStyle();

    if (isIOS) {
      StatusBar.setBackgroundColor({ color: 'transparent' });
    }
  }, [style, isMobile, isIOS]);
}
```

**Package à installer**: `@capacitor/status-bar`

---

### 🟢 Nice-to-Have

#### 8. Bottom Sheet Natif
**Problème**: Les modales ne se comportent pas comme des bottom sheets iOS.

**Solution**: Implémenter un bottom sheet avec gesture de fermeture.

```tsx
// components/bottom-sheet.tsx
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: number[];
}

export function BottomSheet({ isOpen, onClose, children, snapPoints = [0.5, 0.9] }: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef(0);

  const handleDragStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientY;
  };

  const handleDrag = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - dragStart.current;
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${Math.max(0, delta)}px)`;
    }
  };

  const handleDragEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientY - dragStart.current;
    if (delta > 100) {
      onClose();
      HapticsService.impact('light');
    } else {
      if (sheetRef.current) {
        sheetRef.current.style.transform = 'translateY(0)';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 
                   animate-in slide-in-from-bottom duration-300
                   pb-[env(safe-area-inset-bottom)]"
        style={{ maxHeight: `${snapPoints[currentSnap] * 100}vh` }}
      >
        {/* Handle */}
        <div 
          className="py-3 cursor-grab active:cursor-grabbing"
          onTouchStart={handleDragStart}
          onTouchMove={handleDrag}
          onTouchEnd={handleDragEnd}
        >
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto" />
        </div>
        <div className="overflow-y-auto max-h-[calc(100%-48px)]">
          {children}
        </div>
      </div>
    </>
  );
}
```

---

#### 9. Keyboard Handling Optimisé
**Problème**: Le clavier peut masquer les inputs sur iOS.

**Solution**:

```typescript
// hooks/use-keyboard.ts
import { Keyboard } from '@capacitor/keyboard';
import { useEffect, useState } from 'react';

export function useKeyboard() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardWillShow', info => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(info.keyboardHeight);
    });

    const hideListener = Keyboard.addListener('keyboardWillHide', () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return { isKeyboardVisible, keyboardHeight };
}
```

```tsx
// Utilisation dans les formulaires
function CommentInput() {
  const { keyboardHeight } = useKeyboard();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 transition-all"
      style={{ paddingBottom: keyboardHeight || 'env(safe-area-inset-bottom)' }}
    >
      <Input ref={inputRef} placeholder="Écrire un commentaire..." />
    </div>
  );
}
```

**Package à installer**: `@capacitor/keyboard`

---

#### 10. Animations de Like/Interaction
**Problème**: Les interactions manquent de "juice" visuel.

**Solution**:

```tsx
// components/animated-heart.tsx
export function AnimatedHeart({ isLiked, onClick }: { isLiked: boolean; onClick: () => void }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <button 
      onClick={handleClick}
      className="relative p-2 -m-2"
    >
      <Heart 
        className={cn(
          "w-6 h-6 transition-all duration-200",
          isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground",
          isAnimating && "scale-125"
        )} 
      />
      {isAnimating && isLiked && (
        <>
          {/* Particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${i * 60}deg) translateY(-20px)`,
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </>
      )}
    </button>
  );
}
```

---

#### 11. Gestion des Erreurs Réseau Visuelles
**Problème**: Les erreurs réseau ne sont pas affichées de manière user-friendly.

**Solution**:

```tsx
// components/error-boundary.tsx
export function NetworkErrorFallback({ 
  error, 
  retry 
}: { 
  error: Error; 
  retry: () => void 
}) {
  const isNetworkError = error.message.includes('network') || 
                         error.message.includes('fetch') ||
                         !navigator.onLine;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        {isNetworkError ? (
          <WifiOff className="w-8 h-8 text-destructive" />
        ) : (
          <AlertCircle className="w-8 h-8 text-destructive" />
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {isNetworkError ? t('errors.network.title') : t('errors.generic.title')}
      </h3>
      <p className="text-muted-foreground mb-4">
        {isNetworkError ? t('errors.network.description') : error.message}
      </p>
      <Button onClick={retry} variant="outline" className="gap-2">
        <RefreshCw className="w-4 h-4" />
        {t('common.retry')}
      </Button>
    </div>
  );
}
```

---

## 📦 Packages Capacitor à Installer

```bash
pnpm add @capacitor/splash-screen @capacitor/status-bar @capacitor/haptics @capacitor/network @capacitor/keyboard
npx cap sync
```

---

## 📁 Structure des Nouveaux Fichiers

```
apps/mobile/src/
├── components/
│   ├── animated-heart.tsx          # Animation de like
│   ├── bottom-sheet.tsx            # Bottom sheet natif
│   ├── offline-banner.tsx          # Bannière mode offline
│   ├── pull-to-refresh.tsx         # Pull-to-refresh
│   └── skeletons/
│       ├── feed-skeleton.tsx
│       ├── profile-skeleton.tsx
│       └── review-card-skeleton.tsx
├── hooks/
│   ├── use-keyboard.ts             # Gestion clavier
│   ├── use-network-status.ts       # Détection online/offline
│   ├── use-page-transition.ts      # Transitions de page
│   ├── use-splash-screen.ts        # Contrôle splash screen
│   └── use-status-bar.ts           # Status bar dynamique
├── services/
│   └── haptics.service.ts          # Feedback haptique
└── styles/
    └── page-transitions.css        # Animations CSS
```

---

## 🔄 Ordre d'Implémentation Recommandé

### Phase 1 - Fondations (Semaine 1)
1. ✅ Installer les packages Capacitor
2. ✅ Configurer le Splash Screen
3. ✅ Implémenter useNetworkStatus + OfflineBanner
4. ✅ Créer HapticsService et l'intégrer aux mutations

### Phase 2 - Feedback Visuel (Semaine 2)
5. ✅ Créer les Skeleton loaders
6. ✅ Implémenter Pull-to-Refresh
7. ✅ Améliorer les transitions de page

### Phase 3 - Polish (Semaine 3)
8. ✅ Status Bar dynamique
9. ✅ Keyboard handling
10. ✅ Bottom Sheet
11. ✅ Animations de like

### Phase 4 - Tests & Ajustements
12. ✅ Tests sur devices réels iOS
13. ✅ Optimisation performances
14. ✅ Ajustements animations (timing, easing)

---

## 📊 Métriques de Succès

| Métrique | Avant | Objectif |
|----------|-------|----------|
| First Contentful Paint | ~500ms | <300ms |
| Time to Interactive | ~1.5s | <1s |
| Note App Store (UX) | - | >4.5/5 |
| Crash rate | - | <0.1% |
| Temps de réponse perçu | Moyen | Instantané |

---

## ⚠️ Points d'Attention

1. **Performance**: Toutes les animations doivent utiliser `transform` et `opacity` uniquement pour éviter le repaint
2. **Battery**: Les listeners réseau doivent être nettoyés au unmount
3. **Accessibility**: Les animations doivent respecter `prefers-reduced-motion`
4. **Testing**: Tester sur iPhone réel, le simulateur ne reproduit pas fidèlement le comportement haptique et les performances

---

## 🔗 Traductions à Ajouter

```json
// fr.json
{
  "network": {
    "offline": "Vous êtes hors ligne",
    "backOnline": "Connexion rétablie"
  },
  "errors": {
    "network": {
      "title": "Problème de connexion",
      "description": "Vérifiez votre connexion internet et réessayez"
    },
    "generic": {
      "title": "Une erreur est survenue"
    }
  }
}
```

```json
// en.json
{
  "network": {
    "offline": "You are offline",
    "backOnline": "Connection restored"
  },
  "errors": {
    "network": {
      "title": "Connection problem",
      "description": "Check your internet connection and try again"
    },
    "generic": {
      "title": "An error occurred"
    }
  }
}
```
