import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthProvider } from "../providers/auth-provider";
import { I18nProvider } from "../providers/i18n-provider";
import { Toaster } from "@repo/ui";

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <I18nProvider>
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools />
      </I18nProvider>
    </AuthProvider>
  ),
});
