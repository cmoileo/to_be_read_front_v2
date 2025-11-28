import { Button } from "../components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";
import { useTranslation } from "react-i18next";
import { BookOpen, Star, Users, Sparkles } from "lucide-react";

interface OnboardingScreenProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function OnboardingScreen({ onLoginClick, onRegisterClick }: OnboardingScreenProps) {
  const { t } = useTranslation();

  const features = [
    { icon: <BookOpen className="w-6 h-6 text-primary" />, text: t("onboarding.feature1") },
    { icon: <Star className="w-6 h-6 text-amber-500" />, text: t("onboarding.feature2") },
    { icon: <Users className="w-6 h-6 text-primary" />, text: t("onboarding.feature3") },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full space-y-8">
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl mb-2 shadow-soft">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {t("onboarding.appTitle")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("onboarding.subtitle")}
          </p>
        </div>

        <Card className="border-0 shadow-soft-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">{t("onboarding.welcomeTitle")}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("onboarding.welcomeDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full text-base h-14 font-semibold shadow-soft hover:shadow-glow transition-all duration-300"
                onClick={onRegisterClick}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {t("onboarding.createAccount")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full text-base h-14 font-medium border-2 hover:bg-muted/50 transition-all duration-300"
                onClick={onLoginClick}
              >
                {t("onboarding.login")}
              </Button>
            </div>

            <div className="pt-4 space-y-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 transition-colors hover:bg-muted"
                >
                  <div className="shrink-0">{feature.icon}</div>
                  <p className="text-sm text-muted-foreground">{feature.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
