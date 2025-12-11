import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from '@tanstack/react-router';
import { usePlatform } from './use-platform';

interface SwipeBackOptions {
  /** Largeur de la zone de détection du swipe depuis le bord gauche (en px) */
  edgeWidth?: number;
  /** Distance minimale pour déclencher le back (en px) */
  threshold?: number;
  /** Désactiver le swipe back */
  disabled?: boolean;
}

/**
 * Hook pour gérer le swipe back gesture (comme sur iOS natif)
 * Swipe depuis le bord gauche vers la droite pour revenir en arrière
 */
export function useSwipeBack(options: SwipeBackOptions = {}) {
  const { edgeWidth = 30, threshold = 100, disabled = false } = options;
  const { isMobile } = usePlatform();
  const router = useRouter();
  
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const canGoBack = useCallback(() => {
    return window.history.length > 1;
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || !isMobile) return;
    
    const touch = e.touches[0];
    // Seulement si on touche près du bord gauche
    if (touch.clientX <= edgeWidth) {
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      isSwiping.current = true;
      
      // Créer l'overlay visuel
      if (!overlayRef.current) {
        const overlay = document.createElement('div');
        overlay.className = 'swipe-back-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 30%);
          opacity: 0;
          pointer-events: none;
          z-index: 9999;
          transition: opacity 0.1s ease-out;
        `;
        document.body.appendChild(overlay);
        overlayRef.current = overlay;
      }
    }
  }, [disabled, isMobile, edgeWidth]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isSwiping.current) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    
    // Annuler si le mouvement est plus vertical qu'horizontal
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      isSwiping.current = false;
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '0';
      }
      return;
    }
    
    // Seulement swipe vers la droite
    if (deltaX > 0 && overlayRef.current) {
      const progress = Math.min(deltaX / threshold, 1);
      overlayRef.current.style.opacity = String(progress * 0.5);
      
      // Ajouter un léger décalage visuel au contenu
      document.body.style.transform = `translateX(${Math.min(deltaX * 0.3, 50)}px)`;
      document.body.style.transition = 'none';
    }
  }, [threshold]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isSwiping.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    
    // Reset du body
    document.body.style.transform = '';
    document.body.style.transition = 'transform 0.2s ease-out';
    
    // Supprimer l'overlay
    if (overlayRef.current) {
      overlayRef.current.style.opacity = '0';
      setTimeout(() => {
        overlayRef.current?.remove();
        overlayRef.current = null;
      }, 200);
    }
    
    // Déclencher le back si on a dépassé le seuil
    if (deltaX >= threshold && canGoBack()) {
      router.history.back();
    }
    
    isSwiping.current = false;
  }, [threshold, canGoBack, router]);

  useEffect(() => {
    if (!isMobile || disabled) return;
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      // Cleanup
      overlayRef.current?.remove();
      document.body.style.transform = '';
    };
  }, [isMobile, disabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { canGoBack: canGoBack() };
}
