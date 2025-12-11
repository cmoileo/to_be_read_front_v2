import { ReactNode } from 'react';
import { cn } from '@repo/ui';
import { usePlatform } from '../hooks/use-platform';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

interface MobileHeaderProps {
  /** Titre de la page */
  title?: string;
  /** Contenu personnalisé à gauche */
  leftContent?: ReactNode;
  /** Contenu personnalisé à droite */
  rightContent?: ReactNode;
  /** Afficher le bouton retour */
  showBack?: boolean;
  /** Callback personnalisé pour le retour */
  onBack?: () => void;
  /** Classes CSS additionnelles */
  className?: string;
  /** Rendre le header transparent */
  transparent?: boolean;
}

/**
 * Header mobile avec gestion des safe areas et bouton retour
 */
export function MobileHeader({
  title,
  leftContent,
  rightContent,
  showBack = false,
  onBack,
  className,
  transparent = false,
}: MobileHeaderProps) {
  const { isMobile } = usePlatform();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.history.back();
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 px-4 py-3 flex items-center justify-between",
        !transparent && "bg-background/95 backdrop-blur-lg border-b border-border/50",
        // Safe area pour iOS
        isMobile && "pt-[calc(env(safe-area-inset-top)+0.75rem)]",
        className
      )}
    >
      {/* Zone gauche */}
      <div className="flex items-center gap-2 min-w-[60px]">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-accent/50 active:scale-95 transition-all duration-150 touch-manipulation"
            aria-label="Retour"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {leftContent}
      </div>

      {/* Titre central */}
      {title && (
        <h1 className="text-lg font-semibold text-center flex-1 truncate">
          {title}
        </h1>
      )}

      {/* Zone droite */}
      <div className="flex items-center gap-2 min-w-[60px] justify-end">
        {rightContent}
      </div>
    </header>
  );
}
