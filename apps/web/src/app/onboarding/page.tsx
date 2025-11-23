"use client";

import { OnboardingScreen } from "@repo/ui";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/login");
  };

  const goToRegister = () => {
    router.push("/register");
  };

  return <OnboardingScreen onLoginClick={goToLogin} onRegisterClick={goToRegister} />;
}
