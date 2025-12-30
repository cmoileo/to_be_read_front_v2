import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useConnectedUser } from "@repo/stores";
import "@repo/ui/src/i18n/config";
export function I18nProvider({ children }) {
    const { i18n } = useTranslation();
    const { user } = useConnectedUser();
    useEffect(() => {
        if (user && "locale" in user) {
            const userDetailed = user;
            if (userDetailed.locale) {
                i18n.changeLanguage(userDetailed.locale);
            }
        }
        else {
            const deviceLanguage = navigator.language.split("-")[0];
            const supportedLanguage = ["fr", "en"].includes(deviceLanguage) ? deviceLanguage : "fr";
            i18n.changeLanguage(supportedLanguage);
        }
    }, [user, i18n]);
    return _jsx(_Fragment, { children: children });
}
