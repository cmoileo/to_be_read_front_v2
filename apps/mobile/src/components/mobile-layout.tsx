import { ReactNode } from 'react';
import { usePlatform } from '../hooks/use-platform';
import { cn } from '@repo/ui';

interface MobileLayoutProps {
  children: ReactNode;
  /** Header fixe en haut (avec safe area) */
  header?: ReactNode;
  /** Footer/TabBar fixe en bas (avec safe area) */
  footer?: ReactNode;
  /** Classe CSS additionnelle pour le contenu */
  className?: string;
  /** Désactiver le scroll sur le contenu principal */
  noScroll?: boolean;
}

/**
 * Layout mobile avec gestion des safe areas iOS
 * Utilise les variables CSS env() pour les encoches
 */
export function MobileLayout({ 
  children, 
  header, 
  footer, 
  className,
  noScroll = false 
}: MobileLayoutProps) {
  const { isMobile } = usePlatform();

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      {/* Header avec safe area top */}
      {header && (
        <header 
          className={cn(
            "flex-shrink-0 bg-background border-b border-border z-50",
            isMobile && "pt-[env(safe-area-inset-top)]"
          )}
        >
          {header}
        </header>
      )}

      {/* Contenu principal scrollable */}
      <main 
        className={cn(
          "flex-1 overflow-y-auto overscroll-y-contain",
          noScroll && "overflow-hidden",
          // Smooth scroll pour iOS
          "scroll-smooth [-webkit-overflow-scrolling:touch]",
          className
        )}
      >
        {children}
      </main>

      {/* Footer/TabBar avec safe area bottom */}
      {footer && (
        <footer 
          className={cn(
            "flex-shrink-0 bg-background border-t border-border z-50",
            isMobile && "pb-[env(safe-area-inset-bottom)]"
          )}
        >
          {footer}
        </footer>
      )}
    </div>
  );
}

/**
 * Container avec padding safe area sur tous les côtés
 */
export function SafeAreaView({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  const { isMobile } = usePlatform();

  return (
    <div 
      className={cn(
        isMobile && [
          "pt-[env(safe-area-inset-top)]",
          "pb-[env(safe-area-inset-bottom)]",
          "pl-[env(safe-area-inset-left)]",
          "pr-[env(safe-area-inset-right)]",
        ],
        className
      )}
    >
      {children}
    </div>
  );
}
