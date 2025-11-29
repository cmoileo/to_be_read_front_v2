"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "@/providers/notification-provider";
import { useAuthContext } from "@/models/hooks/use-auth-context";

export function useNotificationRegistration() {
  const { registerForPushNotifications, isInitialized, isSupported, permissionStatus } =
    useNotifications();
  const { user, isAuthenticated } = useAuthContext();
  const hasRegistered = useRef(false);

  useEffect(() => {
    const registerNotifications = async () => {
      if (isAuthenticated && user && isInitialized && isSupported && !hasRegistered.current) {
        hasRegistered.current = true;

        if (permissionStatus === "default") {
          await registerForPushNotifications();
        } else if (permissionStatus === "granted") {
          await registerForPushNotifications();
        }
      }
    };

    registerNotifications();
  }, [
    isAuthenticated,
    user,
    isInitialized,
    isSupported,
    permissionStatus,
    registerForPushNotifications,
  ]);

  return {
    requestPermission: registerForPushNotifications,
    permissionStatus,
    isSupported,
  };
}
