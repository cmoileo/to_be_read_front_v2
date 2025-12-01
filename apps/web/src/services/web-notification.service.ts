import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";
import type { NotificationPermissionStatus } from "@repo/types";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

const getFirebaseConfig = (): FirebaseConfig => ({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
});

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

class WebNotificationService {
  private firebaseApp: FirebaseApp | null = null;
  private messaging: Messaging | null = null;
  private initialized = false;
  private currentToken: string | null = null;
  private swRegistration: ServiceWorkerRegistration | null = null;

  async initialize(): Promise<boolean> {
    if (this.initialized) return true;
    if (typeof window === "undefined") return false;

    try {
      const config = getFirebaseConfig();
      if (!this.isFirebaseConfigured(config)) {
        console.warn("Firebase not configured, notifications disabled");
        return false;
      }

      if (!getApps().length) {
        this.firebaseApp = initializeApp(config);
      } else {
        this.firebaseApp = getApps()[0];
      }

      if ("serviceWorker" in navigator) {
        this.swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

        await navigator.serviceWorker.ready;

        if (this.swRegistration.active) {
          this.swRegistration.active.postMessage({
            type: "FIREBASE_CONFIG",
            config,
          });
        }

        this.messaging = getMessaging(this.firebaseApp);

        onMessage(this.messaging, (payload) => {
          this.handleForegroundMessage(payload);
        });
      }

      this.initialized = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize notifications:", error);
      return false;
    }
  }

  private isFirebaseConfigured(config: FirebaseConfig): boolean {
    return !!(config.apiKey && config.projectId && config.messagingSenderId);
  }

  async requestPermission(): Promise<NotificationPermissionStatus> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied";
    }

    try {
      const permission = await Notification.requestPermission();
      return permission as NotificationPermissionStatus;
    } catch (error) {
      console.error("Failed to request notification permission:", error);
      return "denied";
    }
  }

  getPermissionStatus(): NotificationPermissionStatus {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied";
    }
    return Notification.permission as NotificationPermissionStatus;
  }

  async getToken(): Promise<string | null> {
    if (!this.messaging) {
      console.warn("Firebase messaging not initialized");
      return null;
    }

    try {
      const permission = this.getPermissionStatus();
      if (permission !== "granted") {
        return null;
      }

      const token = await getToken(this.messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: this.swRegistration || undefined,
      });

      this.currentToken = token;
      return token;
    } catch (error) {
      console.error("Failed to get FCM token:", error);
      return null;
    }
  }

  private handleForegroundMessage(payload: any): void {
    const title = payload.notification?.title || "Inkgora";
    const body = payload.notification?.body || "";

    if (this.getPermissionStatus() === "granted") {
      new Notification(title, {
        body,
        icon: "/icon-192.png",
        data: payload.data,
      });
    }
  }

  getCurrentToken(): string | null {
    return this.currentToken;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  isSupported(): boolean {
    return (
      typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator
    );
  }
}

export const webNotificationService = new WebNotificationService();
