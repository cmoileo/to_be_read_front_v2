"use client";

import { TopNav } from "@repo/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/models/hooks/use-auth-context";

const AUTH_PAGES = ["/login", "/register", "/onboarding", "/reset-password"];

export function Navigation() {
  const pathname = usePathname();
  const { user, clearUser } = useAuthContext();

  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));

  if (isAuthPage) {
    return null;
  }

  const handleLogout = async () => {
    await clearUser();
  };

  return (
    <TopNav
      userName={user?.userName}
      onLogout={user ? handleLogout : undefined}
      currentPath={pathname}
      Link={Link as any}
      isVisitor={!user}
    />
  );
}
