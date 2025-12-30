import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { connectedUserKeys } from "@repo/stores";
import { mobileNotificationService } from "../services/mobile-notification.service";
const NotificationContext = createContext(null);
export function NotificationProvider({ children }) {
    const [permissionStatus, setPermissionStatus] = useState("default");
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
        if (!isInitialized || hasAttemptedRegistration)
            return;
        const checkUserAndRegister = async () => {
            const user = queryClient.getQueryData(connectedUserKeys.profile());
            if (user) {
                console.log("[NotificationProvider] User is logged in, requesting notification permission...");
                setHasAttemptedRegistration(true);
                try {
                    const success = await registerForPushNotificationsInternal();
                    console.log("[NotificationProvider] Push notification registration result:", success);
                }
                catch (error) {
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
    const requestPermission = async () => {
        const status = await mobileNotificationService.requestPermission();
        setPermissionStatus(status);
        return status;
    };
    const registerForPushNotificationsInternal = async () => {
        const status = await mobileNotificationService.requestPermission();
        setPermissionStatus(status);
        if (status !== "granted") {
            console.log("[NotificationProvider] Permission not granted:", status);
            return false;
        }
        return mobileNotificationService.registerToken();
    };
    const registerForPushNotifications = async () => {
        return registerForPushNotificationsInternal();
    };
    return (_jsx(NotificationContext.Provider, { value: {
            permissionStatus,
            isInitialized,
            requestPermission,
            registerForPushNotifications,
        }, children: children }));
}
export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
