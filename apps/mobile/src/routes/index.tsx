import { createFileRoute, redirect } from "@tanstack/react-router";
import { HomeScreen } from "@repo/ui";
import { useAuthModel } from "../models/hooks/use-auth-model";
import { MobileStorage } from "../services/mobile-storage.service";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: Index,
});

function Index() {
  const { user, clearUser } = useAuthModel();

  const handleLogout = () => {
    clearUser();
  };

  return <HomeScreen userName={user?.userName || "Lecteur"} onLogout={handleLogout} />;
}
