import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthProvider } from "../providers/auth-provider";
import { I18nProvider } from "../providers/i18n-provider";
import { NotificationProvider } from "../providers/notification-provider";
import { Toaster } from "@repo/ui";
import { useSwipeBack } from "../hooks/use-swipe-back";

function RootComponent() {
  // Activer le swipe back gesture sur mobile
  useSwipeBack();

  return (
    <AuthProvider>
      <I18nProvider>
        <NotificationProvider>
          <Outlet />
          <Toaster />
          {import.meta.env.DEV && <TanStackRouterDevtools />}
        </NotificationProvider>
      </I18nProvider>
    </AuthProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
