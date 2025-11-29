import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
  createChannel,
  Importance,
} from "@tauri-apps/plugin-notification";
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";
import { AuthApi } from "@repo/api-client";
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

const FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "";

class MobileNotificationService {
  private firebaseApp: FirebaseApp | null = null;
  private messaging: Messaging | null = null;
  private initialized = false;
  private currentToken: string | null = null;

  async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    try {
      await this.setupNotificationChannel();

      // Firebase Web Messaging requires a service worker which doesn't work
      // in Tauri dev mode (localhost). Skip Firebase init in dev mode.
      // For production mobile builds, push notifications are handled natively.
      if (this.isFirebaseConfigured() && !this.isTauriDevMode()) {
        this.firebaseApp = initializeApp(FIREBASE_CONFIG);
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

  private isTauriDevMode(): boolean {
    // In Tauri dev mode, we're running on localhost and service workers won't work
    // for Firebase messaging. Skip FCM initialization in this case.
    return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  }

  private isFirebaseConfigured(): boolean {
    return !!(
      FIREBASE_CONFIG.apiKey &&
      FIREBASE_CONFIG.projectId &&
      FIREBASE_CONFIG.messagingSenderId
    );
  }

  private async setupNotificationChannel(): Promise<void> {
    try {
      await createChannel({
        id: "inkerclub-default",
        name: "InkerClub",
        description: "Notifications de l'application InkerClub",
        importance: Importance.High,
        vibration: true,
        sound: "default",
      });
    } catch (error) {
      console.warn("Failed to create notification channel:", error);
    }
  }

  async requestPermission(): Promise<NotificationPermissionStatus> {
    try {
      const granted = await isPermissionGranted();
      if (granted) return "granted";

      const permission = await requestPermission();
      return permission === "granted" ? "granted" : "denied";
    } catch (error) {
      console.error("Failed to request notification permission:", error);
      return "denied";
    }
  }

  async getPermissionStatus(): Promise<NotificationPermissionStatus> {
    try {
      const granted = await isPermissionGranted();
      return granted ? "granted" : "default";
    } catch {
      return "denied";
    }
  }

  async getToken(): Promise<string | null> {
    // Skip FCM token in Tauri dev mode (no service worker available)
    if (this.isTauriDevMode()) {
      console.info("FCM token not available in Tauri dev mode");
      return null;
    }

    if (!this.messaging || !this.isFirebaseConfigured()) {
      console.warn("Firebase messaging not configured");
      return null;
    }

    try {
      const permission = await this.getPermissionStatus();
      if (permission !== "granted") {
        return null;
      }

      const token = await getToken(this.messaging, { vapidKey: VAPID_KEY });
      this.currentToken = token;
      return token;
    } catch (error) {
      console.error("Failed to get FCM token:", error);
      return null;
    }
  }

  async registerToken(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) return false;

    try {
      await AuthApi.storeDeviceToken({
        token,
        platform: this.getPlatform(),
      });
      return true;
    } catch (error) {
      console.error("Failed to register device token:", error);
      return false;
    }
  }

  private getPlatform(): "ios" | "android" | "desktop" {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) return "ios";
    if (/android/.test(userAgent)) return "android";
    return "desktop";
  }

  private handleForegroundMessage(payload: any): void {
    const title = payload.notification?.title || "InkerClub";
    const body = payload.notification?.body || "";

    this.showLocalNotification({
      title,
      body,
      data: payload.data,
    });
  }

  async showLocalNotification(payload: NotificationPayload): Promise<void> {
    try {
      const permission = await this.getPermissionStatus();
      if (permission !== "granted") return;

      await sendNotification({
        title: payload.title,
        body: payload.body,
        channelId: "inkerclub-default",
      });
    } catch (error) {
      console.error("Failed to show notification:", error);
    }
  }

  getCurrentToken(): string | null {
    return this.currentToken;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const mobileNotificationService = new MobileNotificationService();
