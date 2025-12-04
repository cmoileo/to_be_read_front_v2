"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Sparkles, Heart, Users, ArrowRight, useTranslation } from "@repo/ui";

export function VisitorHomeClient() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section with Background Image */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/onboarding-bg.jpg"
            alt="People reading books together"
            fill
            className="object-cover"
            priority
            quality={85}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl w-full px-6 py-20 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>{t("visitorHome.tagline", "Votre prochain coup de cœur littéraire vous attend")}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
            {t("visitorHome.heroTitle")}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t("visitorHome.heroSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {t("visitorHome.createAccount")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-background/80 backdrop-blur-sm border-2 border-border px-8 py-4 text-lg font-semibold hover:bg-accent hover:border-primary/30 transition-all duration-300"
            >
              {t("visitorHome.exploreCta")}
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("visitorHome.whyJoin")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("visitorHome.communityDescription", "Une communauté bienveillante de passionnés de lecture")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-7 w-7" />}
              title={t("visitorHome.feature1Title")}
              description={t("visitorHome.feature1Description")}
              gradient="from-blue-500/20 to-cyan-500/20"
              iconColor="text-blue-500"
            />
            <FeatureCard
              icon={<Heart className="h-7 w-7" />}
              title={t("visitorHome.feature2Title")}
              description={t("visitorHome.feature2Description")}
              gradient="from-rose-500/20 to-pink-500/20"
              iconColor="text-rose-500"
            />
            <FeatureCard
              icon={<Users className="h-7 w-7" />}
              title={t("visitorHome.feature3Title")}
              description={t("visitorHome.feature3Description")}
              gradient="from-violet-500/20 to-purple-500/20"
              iconColor="text-violet-500"
            />
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-16 px-6 bg-muted/30 border-t border-border/50">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">{t("visitorHome.readyToStart")}</h2>
          <p className="text-muted-foreground text-lg">
            {t("visitorHome.readyDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105"
            >
              {t("visitorHome.createAccount")}
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border-2 border-input bg-background px-8 py-3 font-semibold hover:bg-accent hover:border-primary/30 transition-all duration-300"
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
  gradient,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}) {
  return (
    <div className="group relative p-8 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative space-y-4">
        <div className={`inline-flex p-3 rounded-xl bg-muted ${iconColor}`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
