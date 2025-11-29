import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthProvider } from "../providers/auth-provider";
import { I18nProvider } from "../providers/i18n-provider";
import { NotificationProvider } from "../providers/notification-provider";
import { Toaster } from "@repo/ui";

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <I18nProvider>
        <NotificationProvider>
          <Outlet />
          <Toaster />
          <TanStackRouterDevtools />
        </NotificationProvider>
      </I18nProvider>
    </AuthProvider>
  ),
});
