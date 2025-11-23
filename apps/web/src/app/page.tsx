"use client";

import { HomeScreen, OnboardingScreen } from "@repo/ui";
import { useAuthContext } from "@/models/hooks/use-auth-context";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, clearUser } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    await clearUser();
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
