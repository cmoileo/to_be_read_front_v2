"use client";

import Link from "next/link";
import { Search, BookOpen, Users, Star, ArrowRight, useTranslation } from "@repo/ui";

export function VisitorHomeClient() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-2xl w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">{t("visitorHome.heroTitle")}</h1>
            <p className="text-xl text-muted-foreground">
              {t("visitorHome.heroSubtitle")}
            </p>
          </div>

          {/* Search CTA */}
          <div className="pt-4">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
            >
              <Search className="h-5 w-5" />
              {t("visitorHome.exploreCta")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">
            {t("visitorHome.whyJoin")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title={t("visitorHome.feature1Title")}
              description={t("visitorHome.feature1Description")}
            />
            <FeatureCard
              icon={<Star className="h-8 w-8" />}
              title={t("visitorHome.feature2Title")}
              description={t("visitorHome.feature2Description")}
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title={t("visitorHome.feature3Title")}
              description={t("visitorHome.feature3Description")}
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-muted/30">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h2 className="text-2xl font-semibold">{t("visitorHome.readyToStart")}</h2>
          <p className="text-muted-foreground">
            {t("visitorHome.readyDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("visitorHome.createAccount")}
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {t("visitorHome.signIn")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-background border shadow-sm">
      <div className="p-3 rounded-full bg-primary/10 text-primary">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
