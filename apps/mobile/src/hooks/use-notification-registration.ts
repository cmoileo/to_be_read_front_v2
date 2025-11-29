import { useEffect, useRef } from "react";
import { useNotifications } from "../providers/notification-provider";
import { useAuthModel } from "../models/hooks/use-auth-model";

export function useNotificationRegistration() {
  const { registerForPushNotifications, isInitialized, permissionStatus } = useNotifications();
  const { user, isAuthenticated } = useAuthModel();
  const hasRegistered = useRef(false);

  useEffect(() => {
    const registerNotifications = async () => {
      if (isAuthenticated && user && isInitialized && !hasRegistered.current) {
        hasRegistered.current = true;

        if (permissionStatus === "default") {
          await registerForPushNotifications();
        } else if (permissionStatus === "granted") {
          await registerForPushNotifications();
        }
      }
    };

    registerNotifications();
  }, [isAuthenticated, user, isInitialized, permissionStatus, registerForPushNotifications]);

  return {
    requestPermission: registerForPushNotifications,
    permissionStatus,
  };
}
