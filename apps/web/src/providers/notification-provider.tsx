"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { webNotificationService } from "@/services/web-notification.service";
import type { NotificationPermissionStatus } from "@repo/types";

interface NotificationContextValue {
  permissionStatus: NotificationPermissionStatus;
  isInitialized: boolean;
  isSupported: boolean;
  requestPermission: () => Promise<NotificationPermissionStatus>;
  registerForPushNotifications: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>("default");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const initNotifications = async () => {
      const supported = webNotificationService.isSupported();
      setIsSupported(supported);

      if (!supported) {
        setIsInitialized(true);
        return;
      }

      const success = await webNotificationService.initialize();
      if (success) {
        const status = webNotificationService.getPermissionStatus();
        setPermissionStatus(status);
      }
      setIsInitialized(true);
    };

    initNotifications();
  }, []);

  const requestPermission = async (): Promise<NotificationPermissionStatus> => {
    const status = await webNotificationService.requestPermission();
    setPermissionStatus(status);
    return status;
  };

  const registerForPushNotifications = async (): Promise<boolean> => {
    if (!isSupported) return false;

    if (permissionStatus !== "granted") {
      const newStatus = await requestPermission();
      if (newStatus !== "granted") return false;
    }

    const token = await webNotificationService.getToken();
    if (!token) return false;

    try {
      const response = await fetch("/api/notifications/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, platform: "web" }),
      });
      return response.ok;
    } catch (error) {
      console.error("Failed to register push notifications:", error);
      return false;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        permissionStatus,
        isInitialized,
        isSupported,
        requestPermission,
        registerForPushNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
