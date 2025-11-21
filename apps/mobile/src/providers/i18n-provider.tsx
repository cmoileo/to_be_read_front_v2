import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuthModel } from "../models/hooks/use-auth-model";
import "@repo/ui/src/i18n/config";
import type { UserDetailed } from "@repo/types";

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const { i18n } = useTranslation();
  const { user } = useAuthModel();

  useEffect(() => {
    // Si l'utilisateur est connecté et a une locale, utiliser celle-ci
    if (user && "locale" in user) {
      const userDetailed = user as UserDetailed;
      if (userDetailed.locale) {
        i18n.changeLanguage(userDetailed.locale);
      }
    } else {
      // Sinon, détecter depuis le navigateur/device
      const deviceLanguage = navigator.language.split("-")[0];
      const supportedLanguage = ["fr", "en"].includes(deviceLanguage) ? deviceLanguage : "fr";
      i18n.changeLanguage(supportedLanguage);
    }
  }, [user, i18n]);

  return <>{children}</>;
}
