"use client";

import { HomeScreen, OnboardingScreen } from "@repo/ui";
import { useAuth } from "@/providers/auth-provider";
import { logoutAction } from "./_auth/actions";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.refresh();
  };

  const goToLogin = () => {
    router.push("/login");
  };

  const goToRegister = () => {
    router.push("/register");
  };

  if (user) {
    return <HomeScreen userName={user.userName} onLogout={handleLogout} />;
  }

  return <OnboardingScreen onLoginClick={goToLogin} onRegisterClick={goToRegister} />;
}
