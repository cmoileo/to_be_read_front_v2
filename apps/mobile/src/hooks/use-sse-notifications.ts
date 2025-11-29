import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Transmit } from "@adonisjs/transmit-client";
import { MobileStorage } from "../services/mobile-storage.service";
import { notificationKeys } from "../viewmodels/use-notifications-viewmodel";

const API_URL = import.meta.env.VITE_API_URL;

interface SSEEvent {
  type: "new_notification" | "unread_count";
  notification?: any;
  count?: number;
}

export function useSSENotifications(userId: number | undefined) {
  const queryClient = useQueryClient();
  const transmitRef = useRef<Transmit | null>(null);
  const subscriptionRef = useRef<any>(null);
  const isConnectingRef = useRef(false);

  const connect = useCallback(async () => {
    if (!userId || isConnectingRef.current || transmitRef.current) return;

    isConnectingRef.current = true;

    try {
      const accessToken = await MobileStorage.getAccessToken();
      if (!accessToken) {
        isConnectingRef.current = false;
        return;
      }

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

      const channel = `notifications/users/${userId}`;
      const subscription = transmit.subscription(channel);

      subscription.onMessage((data: SSEEvent) => {
        if (data.type === "unread_count") {
          queryClient.setQueryData(notificationKeys.unreadCount(), data.count);
        } else if (data.type === "new_notification") {
          queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
          queryClient.setQueryData(notificationKeys.unreadCount(), (old: number = 0) => old + 1);
        }
      });

      await subscription.create();
      subscriptionRef.current = subscription;
      isConnectingRef.current = false;

      console.info("SSE connected for notifications");
    } catch (error) {
      console.error("Failed to connect to SSE:", error);
      isConnectingRef.current = false;
      transmitRef.current = null;
    }
  }, [userId, queryClient]);

  const disconnect = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.delete().catch(() => {});
      subscriptionRef.current = null;
    }
    transmitRef.current = null;
    isConnectingRef.current = false;
  }, []);

  useEffect(() => {
    if (userId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userId, connect, disconnect]);

  return {
    isConnected: !!transmitRef.current,
    reconnect: connect,
    disconnect,
  };
}
