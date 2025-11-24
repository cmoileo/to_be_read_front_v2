"use client";

import { OnboardingScreen, useTranslation } from "@repo/ui";
import { useAuthContext } from "@/models/hooks/use-auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goToLogin = () => {
    router.push("/login");
  };

  const goToRegister = () => {
    router.push("/register");
  };

  if (!mounted) {
    return null;
  }

  if (user) {
    return (
      <div className="container py-8">
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <div className="max-w-2xl w-full space-y-6 text-center">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold">
                {t("home.welcome")} {user.userName} !
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl">
                Votre bibliothèque littéraire personnelle
              </p>
            </div>

            <div className="text-6xl md:text-8xl">📚</div>
            <p className="text-muted-foreground text-lg">Contenu de la page d'accueil à venir</p>
          </div>
        </div>
      </div>
    );
  }

  return <OnboardingScreen onLoginClick={goToLogin} onRegisterClick={goToRegister} />;
}
