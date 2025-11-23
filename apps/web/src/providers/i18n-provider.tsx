"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "@repo/ui/src/i18n/config";
import { useEffect, type ReactNode } from "react";

export function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize i18n for browser
    if (!i18n.isInitialized) {
      i18n.init();
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
