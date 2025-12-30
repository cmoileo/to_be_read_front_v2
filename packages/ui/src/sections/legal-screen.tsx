"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Separator } from "../components/separator";

export function LegalScreen() {
  const { t, i18n } = useTranslation();

  const lastUpdated = new Date().toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t("legal.page_title")}</h1>
        <p className="text-muted-foreground">
          {t("legal.last_updated", { date: lastUpdated })}
        </p>
      </div>

      <div className="space-y-6">
        <Card id="privacy">
          <CardHeader>
            <CardTitle className="text-2xl">{t("legal.privacy.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t("legal.privacy.intro")}</p>

            <div>
              <h3 className="font-semibold mb-2">{t("legal.privacy.data_collected_title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("legal.privacy.data_collected_content")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t("legal.privacy.purpose_title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("legal.privacy.purpose_content")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t("legal.privacy.cookies_title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("legal.privacy.cookies_content")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t("legal.privacy.sharing_title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("legal.privacy.sharing_content")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t("legal.privacy.user_rights_title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("legal.privacy.user_rights_content")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card id="terms">
          <CardHeader>
            <CardTitle className="text-2xl">{t("legal.terms.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t("legal.terms.intro")}</p>

            <div>
              <h3 className="font-semibold mb-2">{t("legal.terms.access_title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("legal.terms.access_content")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t("legal.terms.account_security_title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("legal.terms.account_security_content")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t("legal.terms.intellectual_property_title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("legal.terms.intellectual_property_content")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t("legal.terms.google_books_title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("legal.terms.google_books_content")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t("legal.terms.liability_title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("legal.terms.liability_content")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card id="mentions">
          <CardHeader>
            <CardTitle className="text-2xl">{t("legal.mentions.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{t("legal.mentions.editor_title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("legal.mentions.editor_content")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t("legal.mentions.hosting_title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("legal.mentions.hosting_content")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t("legal.mentions.director_title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("legal.mentions.director_content")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground border-t pt-6">
        <p>{t("legal.contact_us", { email: "contact@inkgora.com" })}</p>
      </div>
    </div>
  );
}
