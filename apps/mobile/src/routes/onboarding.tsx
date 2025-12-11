import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OnboardingScreen } from "@repo/ui";
import { PageTransition } from "../components/page-transition";

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

  return (
    <PageTransition className="safe-area-inset-top safe-area-inset-bottom">
      <OnboardingScreen onLoginClick={goToLogin} onRegisterClick={goToRegister} />
    </PageTransition>
  );
}
