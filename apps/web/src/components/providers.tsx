"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";
import { AuthProvider } from "@/providers/auth-provider";
import { I18nProvider } from "@/providers/i18n-provider";
import { NotificationProvider } from "@/providers/notification-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { User, UserDetailed } from "@repo/types";

export function Providers({
  children,
  initialUser,
  initialAccessToken,
}: {
  children: ReactNode;
  initialUser: User | null;
  initialAccessToken?: string;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const userTheme = (initialUser as UserDetailed | null)?.theme;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme={userTheme}>
        <I18nProvider>
          <AuthProvider initialUser={initialUser} initialAccessToken={initialAccessToken}>
            <NotificationProvider>{children}</NotificationProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
