"use client";

import { TopNav } from "@repo/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/models/hooks/use-auth-context";
import { useState, useEffect, useCallback, useRef } from "react";
import { Transmit } from "@adonisjs/transmit-client";

const AUTH_PAGES = ["/login", "/register", "/onboarding", "/reset-password"];
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function Navigation() {
  const pathname = usePathname();
  const { user, clearUser } = useAuthContext();
  const [unreadCount, setUnreadCount] = useState(0);
  const transmitRef = useRef<Transmit | null>(null);
  const subscriptionRef = useRef<any>(null);

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
    if (!user?.id) return;

    const connectSSE = async () => {
      try {
        const tokenResponse = await fetch("/api/auth/token");
        if (!tokenResponse.ok) return;
        const { accessToken } = await tokenResponse.json();
        if (!accessToken) return;

        const token = accessToken;

        const transmit = new Transmit({
          baseUrl: API_URL,
          httpClientFactory: (baseUrl, uid) =>
            ({
              createRequest: (path: string, body: Record<string, unknown>) => {
                return new Request(`${baseUrl}${path}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ uid, ...body }),
                  credentials: "include",
                });
              },
              send: (request: Request) => fetch(request),
            }) as any,
        });

        transmitRef.current = transmit;

        const channel = `notifications/users/${user.id}`;
        const subscription = transmit.subscription(channel);

        subscription.onMessage((data: any) => {
          if (data.type === "unread_count") {
            setUnreadCount(data.count);
          } else if (data.type === "new_notification") {
            if (typeof data.count === "number") {
              setUnreadCount(data.count);
            } else {
              setUnreadCount((prev) => prev + 1);
            }
          }
        });

        await subscription.create();
        subscriptionRef.current = subscription;
      } catch (error) {
        console.error("Failed to connect to SSE:", error);
      }
    };

    fetchUnreadCount();
    connectSSE();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.delete().catch(() => {});
        subscriptionRef.current = null;
      }
      transmitRef.current = null;
    };
  }, [user?.id, fetchUnreadCount]);

  useEffect(() => {
    const handleNotificationRead = () => {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };
    const handleAllRead = () => {
      setUnreadCount(0);
    };
    window.addEventListener("notification-read", handleNotificationRead);
    window.addEventListener("notifications-all-read", handleAllRead);
    return () => {
      window.removeEventListener("notification-read", handleNotificationRead);
      window.removeEventListener("notifications-all-read", handleAllRead);
    };
  }, []);

  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));

  if (isAuthPage) {
    return null;
  }

  const handleLogout = async () => {
    if (subscriptionRef.current) {
      await subscriptionRef.current.delete().catch(() => {});
    }
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
