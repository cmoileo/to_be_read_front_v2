import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { mobileNotificationService } from "../services/mobile-notification.service";
import type { NotificationPermissionStatus } from "@repo/types";

interface NotificationContextValue {
  permissionStatus: NotificationPermissionStatus;
  isInitialized: boolean;
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

  useEffect(() => {
    const initNotifications = async () => {
      const success = await mobileNotificationService.initialize();
      if (success) {
        const status = await mobileNotificationService.getPermissionStatus();
        setPermissionStatus(status);
        setIsInitialized(true);
      }
    };

    initNotifications();
  }, []);

  const requestPermission = async (): Promise<NotificationPermissionStatus> => {
    const status = await mobileNotificationService.requestPermission();
    setPermissionStatus(status);
    return status;
  };

  const registerForPushNotifications = async (): Promise<boolean> => {
    if (permissionStatus !== "granted") {
      const newStatus = await requestPermission();
      if (newStatus !== "granted") return false;
    }

    return mobileNotificationService.registerToken();
  };

  return (
    <NotificationContext.Provider
      value={{
        permissionStatus,
        isInitialized,
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
