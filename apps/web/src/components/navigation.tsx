"use client";

import { TopNav } from "@repo/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/models/hooks/use-auth-context";
import { useState, useEffect, useCallback } from "react";

const AUTH_PAGES = ["/login", "/register", "/onboarding", "/reset-password"];

export function Navigation() {
  const pathname = usePathname();
  const { user, clearUser } = useAuthContext();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch("/api/notifications/unread-count");
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch unread notifications count:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchUnreadCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Listen for notification events to refresh count
  useEffect(() => {
    const handleNotificationRead = () => {
      fetchUnreadCount();
    };
    window.addEventListener("notification-read", handleNotificationRead);
    return () => window.removeEventListener("notification-read", handleNotificationRead);
  }, [fetchUnreadCount]);

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
      unreadNotificationsCount={unreadCount}
    />
  );
}
