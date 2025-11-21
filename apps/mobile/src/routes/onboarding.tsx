import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, useTranslation } from "@repo/ui";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate({ to: "/login" });
  };

  const goToRegister = () => {
    navigate({ to: "/register" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">{t("onboarding.appTitle")}</h1>
          <p className="text-xl text-muted-foreground">
            {t("onboarding.subtitle")}
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t("onboarding.welcomeTitle")}</CardTitle>
            <CardDescription>
              {t("onboarding.welcomeDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full text-lg h-12"
                onClick={goToRegister}
              >
                {t("onboarding.createAccount")}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full text-lg h-12"
                onClick={goToLogin}
              >
                {t("onboarding.login")}
              </Button>
            </div>

            <div className="pt-4 space-y-2 text-center text-sm text-muted-foreground">
              <p>{t("onboarding.feature1")}</p>
              <p>{t("onboarding.feature2")}</p>
              <p>{t("onboarding.feature3")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
