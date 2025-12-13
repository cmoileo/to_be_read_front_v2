import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthProvider } from "../providers/auth-provider";
import { I18nProvider } from "../providers/i18n-provider";
import { NotificationProvider } from "../providers/notification-provider";
import { Toaster } from "@repo/ui";
import { useSwipeBack } from "../hooks/use-swipe-back";
import { useSplashScreen } from "../hooks/use-splash-screen";
import { OfflineBanner } from "../components/offline-banner";
import { BottomSheetProvider } from "../components/bottom-sheet";
import { useEffect } from "react";

function RootComponent() {
  useSwipeBack();
  const { setReady } = useSplashScreen();

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady();
    }, 500);

    return () => clearTimeout(timer);
  }, [setReady]);

  return (
    <AuthProvider>
      <I18nProvider>
        <NotificationProvider>
          <BottomSheetProvider>
            <OfflineBanner />
            <Outlet />
            <Toaster />
            {import.meta.env.DEV && <TanStackRouterDevtools />}
          </BottomSheetProvider>
        </NotificationProvider>
      </I18nProvider>
    </AuthProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
