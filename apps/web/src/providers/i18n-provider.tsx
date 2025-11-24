"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "@repo/ui/src/i18n/config";
import { useEffect, useState, type ReactNode } from "react";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.init();
    }
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
