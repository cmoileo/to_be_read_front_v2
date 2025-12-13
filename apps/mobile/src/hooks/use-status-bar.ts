import { useCallback } from "react";
import { StatusBarService } from "../services/native";

interface UseStatusBarResult {
  setLight: () => Promise<void>;
  setDark: () => Promise<void>;
  setBackgroundColor: (color: string) => Promise<void>;
  hide: () => Promise<void>;
  show: () => Promise<void>;
}

export function useStatusBar(): UseStatusBarResult {
  const setLight = useCallback(async () => {
    await StatusBarService.setStyleLight();
  }, []);

  const setDark = useCallback(async () => {
    await StatusBarService.setStyleDark();
  }, []);

  const setBackgroundColor = useCallback(async (color: string) => {
    await StatusBarService.setBackgroundColor(color);
  }, []);

  const hide = useCallback(async () => {
    await StatusBarService.hide();
  }, []);

  const show = useCallback(async () => {
    await StatusBarService.show();
  }, []);

  return {
    setLight,
    setDark,
    setBackgroundColor,
    hide,
    show,
  };
}
