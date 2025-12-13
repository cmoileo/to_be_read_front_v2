import { useEffect, useCallback, useState } from "react";
import { SplashScreenService } from "../services/native";

interface UseSplashScreenResult {
  hideSplash: () => Promise<void>;
  showSplash: () => Promise<void>;
  isReady: boolean;
  setReady: () => void;
}

export function useSplashScreen(): UseSplashScreenResult {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isReady) {
      SplashScreenService.hide();
    }
  }, [isReady]);

  const hideSplash = useCallback(async () => {
    await SplashScreenService.hide();
  }, []);

  const showSplash = useCallback(async () => {
    await SplashScreenService.show();
  }, []);

  const setReady = useCallback(() => {
    setIsReady(true);
  }, []);

  return {
    hideSplash,
    showSplash,
    isReady,
    setReady,
  };
}
