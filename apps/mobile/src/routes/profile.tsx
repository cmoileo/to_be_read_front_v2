import { createFileRoute, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { MobileStorage } from "../services/mobile-storage.service";
import { useAuthModel } from "../models/hooks/use-auth-model";
import { Button, BottomNav, useTranslation } from "@repo/ui";

export const Route = createFileRoute("/profile")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { user, clearUser } = useAuthModel();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleLogout = () => {
    clearUser();
  };

  const navItems = [
    {
      label: t("navigation.home"),
      icon: "🏠",
      href: "/",
      isActive: currentPath === "/",
    },
    {
      label: t("navigation.search"),
      icon: "🔍",
      href: "/search",
      isActive: currentPath === "/search",
    },
    {
      label: t("navigation.createReview"),
      icon: "✍️",
      href: "/review",
      isActive: currentPath === "/review",
    },
    {
      label: t("navigation.profile"),
      icon: "👤",
      href: "/profile",
      isActive: currentPath === "/profile",
    },
  ];

  const handleNavigate = (href: string) => {
    navigate({ to: href });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 p-6 pb-20">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profil</h1>
          <Button variant="ghost" onClick={handleLogout} size="sm">
            Déconnexion
          </Button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="max-w-md w-full text-center space-y-4">
            <p className="text-4xl">👤</p>
            <h2 className="text-2xl font-bold">{user?.userName}</h2>
            <p className="text-muted-foreground">Page de profil à venir</p>
          </div>
        </div>
      </div>

      <BottomNav items={navItems} onNavigate={handleNavigate} />
    </div>
  );
}
