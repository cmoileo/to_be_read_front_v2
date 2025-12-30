import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { connectedUserKeys } from "@repo/stores";
import { mobileNotificationService } from "../services/mobile-notification.service";
import type { NotificationPermissionStatus, User } from "@repo/types";

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
  const [hasAttemptedRegistration, setHasAttemptedRegistration] = useState(false);
  const queryClient = useQueryClient();

  // Initialize notification service
  useEffect(() => {
    const initNotifications = async () => {
      console.log("[NotificationProvider] Initializing...");
      const success = await mobileNotificationService.initialize();
      if (success) {
        const status = await mobileNotificationService.getPermissionStatus();
        console.log("[NotificationProvider] Current permission status:", status);
        setPermissionStatus(status);
        setIsInitialized(true);
      }
    };

    initNotifications();
  }, []);

  useEffect(() => {
    if (!isInitialized || hasAttemptedRegistration) return;

    const checkUserAndRegister = async () => {
      const user = queryClient.getQueryData<User>(connectedUserKeys.profile());
      
      if (user) {
        console.log("[NotificationProvider] User is logged in, requesting notification permission...");
        setHasAttemptedRegistration(true);
        
        try {
          const success = await registerForPushNotificationsInternal();
          console.log("[NotificationProvider] Push notification registration result:", success);
        } catch (error) {
          console.error("[NotificationProvider] Failed to register for push notifications:", error);
        }
      }
    };

    checkUserAndRegister();

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey[0] === "connectedUser" && event.type === "updated") {
        checkUserAndRegister();
      }
    });

    return () => unsubscribe();
  }, [isInitialized, hasAttemptedRegistration, queryClient]);

  const requestPermission = async (): Promise<NotificationPermissionStatus> => {
    const status = await mobileNotificationService.requestPermission();
    setPermissionStatus(status);
    return status;
  };

  const registerForPushNotificationsInternal = async (): Promise<boolean> => {
    console.log("[NotificationProvider] Starting push notification registration...");
    console.log("[NotificationProvider] Current permission status:", permissionStatus);
    
    const status = await mobileNotificationService.requestPermission();
    console.log("[NotificationProvider] Permission status after request:", status);
    setPermissionStatus(status);
    
    if (status !== "granted") {
      console.log("[NotificationProvider] Permission not granted, aborting registration");
      return false;
    }

    console.log("[NotificationProvider] Permission granted, attempting to register token...");
    const result = await mobileNotificationService.registerToken();
    console.log("[NotificationProvider] Token registration result:", result);
    return result;
  };

  const registerForPushNotifications = async (): Promise<boolean> => {
    return registerForPushNotificationsInternal();
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
