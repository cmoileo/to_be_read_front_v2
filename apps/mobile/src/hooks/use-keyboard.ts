import { useState, useEffect, useCallback } from "react";
import { KeyboardService } from "../services/native";

interface UseKeyboardResult {
  isVisible: boolean;
  keyboardHeight: number;
  hide: () => Promise<void>;
}

export function useKeyboard(): UseKeyboardResult {
  const [isVisible, setIsVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const unsubscribeShow = KeyboardService.addShowListener((info) => {
      setIsVisible(true);
      setKeyboardHeight(info.keyboardHeight);
    });

    const unsubscribeHide = KeyboardService.addHideListener(() => {
      setIsVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      unsubscribeShow();
      unsubscribeHide();
    };
  }, []);

  const hide = useCallback(async () => {
    await KeyboardService.hide();
  }, []);

  return {
    isVisible,
    keyboardHeight,
    hide,
  };
}
