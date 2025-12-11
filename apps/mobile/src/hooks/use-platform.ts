import { useEffect, useState } from 'react';

interface PlatformInfo {
  isCapacitor: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isWeb: boolean;
}

/**
 * Hook pour détecter la plateforme (Capacitor vs Web)
 * Permet d'appliquer des comportements spécifiques au mobile
 */
export function usePlatform(): PlatformInfo {
  const [platform, setPlatform] = useState<PlatformInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isCapacitor: false,
        isIOS: false,
        isAndroid: false,
        isMobile: false,
        isWeb: true,
      };
    }

    const isCapacitor = !!(window as any).Capacitor;
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    return {
      isCapacitor,
      isIOS: isCapacitor && isIOS,
      isAndroid: isCapacitor && isAndroid,
      isMobile: isCapacitor,
      isWeb: !isCapacitor,
    };
  });

  useEffect(() => {
    // Mettre à jour après hydration si nécessaire
    const isCapacitor = !!(window as any).Capacitor;
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    setPlatform({
      isCapacitor,
      isIOS: isCapacitor && isIOS,
      isAndroid: isCapacitor && isAndroid,
      isMobile: isCapacitor,
      isWeb: !isCapacitor,
    });
  }, []);

  return platform;
}

/**
 * Retourne les classes CSS pour les safe areas
 */
export function useSafeArea() {
  const { isMobile } = usePlatform();

  return {
    // Padding top pour la barre de status
    paddingTop: isMobile ? 'pt-[calc(env(safe-area-inset-top)+0.5rem)]' : '',
    // Padding bottom pour la barre de navigation
    paddingBottom: isMobile ? 'pb-[calc(env(safe-area-inset-bottom)+0.5rem)]' : '',
    // Classe complète pour un container safe
    safeContainer: isMobile 
      ? 'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]'
      : '',
  };
}
