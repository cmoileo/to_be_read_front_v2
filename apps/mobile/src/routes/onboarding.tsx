import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OnboardingScreen } from "@repo/ui";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate({ to: "/login" });
  };

  const goToRegister = () => {
    navigate({ to: "/register" });
  };

  return <OnboardingScreen onLoginClick={goToLogin} onRegisterClick={goToRegister} />;
}
