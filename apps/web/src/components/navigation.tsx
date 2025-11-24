"use client";

import { TopNav } from "@repo/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/models/hooks/use-auth-context";

export function Navigation() {
  const pathname = usePathname();
  const { user, clearUser } = useAuthContext();

  const handleLogout = async () => {
    await clearUser();
  };

  if (!user) {
    return null;
  }

  return (
    <TopNav
      userName={user.userName}
      onLogout={handleLogout}
      currentPath={pathname}
      Link={Link as any}
    />
  );
}
