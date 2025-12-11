import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@repo/ui';
import { usePlatform } from '../hooks/use-platform';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  /** Type d'animation */
  animation?: 'slide-up' | 'slide-left' | 'fade' | 'scale';
}

/**
 * Composant wrapper pour animer l'entrée des pages
 * Uniquement actif sur mobile pour ne pas impacter le web
 */
export function PageTransition({ 
  children, 
  className,
  animation = 'fade'
}: PageTransitionProps) {
  const { isMobile } = usePlatform();
  const [isVisible, setIsVisible] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) {
      // Petit délai pour permettre le mount avant l'animation
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }
  }, [isMobile]);

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  const animations = {
    'slide-up': {
      initial: 'translate-y-4 opacity-0',
      visible: 'translate-y-0 opacity-100',
    },
    'slide-left': {
      initial: 'translate-x-4 opacity-0',
      visible: 'translate-x-0 opacity-100',
    },
    'fade': {
      initial: 'opacity-0',
      visible: 'opacity-100',
    },
    'scale': {
      initial: 'scale-95 opacity-0',
      visible: 'scale-100 opacity-100',
    },
  };

  const anim = animations[animation];

  return (
    <div 
      className={cn(
        'transition-all duration-300 ease-out',
        isVisible ? anim.visible : anim.initial,
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Composant pour animer les items d'une liste avec stagger
 */
interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
  /** Délai entre chaque item (ms) */
  staggerDelay?: number;
}

export function AnimatedList({ 
  children, 
  className,
  staggerDelay = 50 
}: AnimatedListProps) {
  const { isMobile } = usePlatform();
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    if (!isMobile) {
      setVisibleItems(children.map((_, i) => i));
      return;
    }

    // Animation staggered pour chaque item
    children.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, index]);
      }, index * staggerDelay);
    });

    return () => setVisibleItems([]);
  }, [children.length, isMobile, staggerDelay]);

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            isMobile && 'transition-all duration-300 ease-out',
            isMobile && (
              visibleItems.includes(index)
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0'
            )
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
