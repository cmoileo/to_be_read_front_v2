import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";
import { AuthApi } from "@repo/api-client";
import type { NotificationPermissionStatus } from "@repo/types";

class MobileNotificationService {
  private initialized = false;
  private currentToken: string | null = null;
  private tokenPromiseResolve: ((token: string) => void) | null = null;
  private tokenPromiseReject: ((error: Error) => void) | null = null;

  async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    console.log("=== [MobileNotification] INITIALIZE START ===");
    console.log("[MobileNotification] Platform:", Capacitor.getPlatform());
    console.log("[MobileNotification] Is native platform:", Capacitor.isNativePlatform());

    if (!Capacitor.isNativePlatform()) {
      console.log("[MobileNotification] Not a native platform, skipping initialization");
      this.initialized = true;
      return true;
    }

    try {
      console.log("[MobileNotification] Registering listeners...");
      await this.registerListeners();
      this.initialized = true;
      console.log("[MobileNotification] Initialized successfully");
      return true;
    } catch (error) {
      console.error("[MobileNotification] Failed to initialize:", error);
      return false;
    }
  }

  private async registerListeners(): Promise<void> {
    // Listen for successful registration - receives FCM token from AppDelegate
    await PushNotifications.addListener("registration", (token) => {
      console.log("=== [MobileNotification] REGISTRATION SUCCESS ===");
      console.log("[MobileNotification] Token received, length:", token.value?.length);
      console.log("[MobileNotification] Token preview:", token.value?.substring(0, 50) + "...");
      this.currentToken = token.value;
      
      if (this.tokenPromiseResolve) {
        this.tokenPromiseResolve(token.value);
        this.tokenPromiseResolve = null;
        this.tokenPromiseReject = null;
      }
    });

    // Listen for registration errors
    await PushNotifications.addListener("registrationError", (error) => {
      console.error("=== [MobileNotification] REGISTRATION ERROR ===");
      console.error("[MobileNotification] Error:", JSON.stringify(error));
      
      if (this.tokenPromiseReject) {
        this.tokenPromiseReject(new Error(error.error || "Registration failed"));
        this.tokenPromiseResolve = null;
        this.tokenPromiseReject = null;
      }
    });

    // Listen for foreground notifications
    await PushNotifications.addListener("pushNotificationReceived", (notification) => {
      console.log("[MobileNotification] Notification received:", JSON.stringify(notification));
    });

    // Listen for notification taps
    await PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
      console.log("[MobileNotification] Notification action:", JSON.stringify(action));
    });

    console.log("[MobileNotification] All listeners registered");
  }

  async requestPermission(): Promise<NotificationPermissionStatus> {
    if (!Capacitor.isNativePlatform()) {
      if (!("Notification" in window)) return "denied";
      const permission = await Notification.requestPermission();
      return permission as NotificationPermissionStatus;
    }

    try {
      console.log("[MobileNotification] Requesting permission...");
      const result = await PushNotifications.requestPermissions();
      console.log("[MobileNotification] Permission result:", result.receive);
      
      if (result.receive === "granted") {
        console.log("[MobileNotification] Permission granted, calling register()...");
        await PushNotifications.register();
        console.log("[MobileNotification] register() called, waiting for token...");
        return "granted";
      }
      
      return result.receive === "denied" ? "denied" : "default";
    } catch (error) {
      console.error("[MobileNotification] Permission request failed:", error);
      return "denied";
    }
  }

  async getPermissionStatus(): Promise<NotificationPermissionStatus> {
    if (!Capacitor.isNativePlatform()) {
      if (!("Notification" in window)) return "denied";
      return Notification.permission as NotificationPermissionStatus;
    }

    try {
      const result = await PushNotifications.checkPermissions();
      console.log("[MobileNotification] Current permission status:", result.receive);
      return result.receive as NotificationPermissionStatus;
    } catch (error) {
      console.error("[MobileNotification] Failed to check permissions:", error);
      return "denied";
    }
  }

  async getToken(): Promise<string | null> {
    console.log("=== [MobileNotification] GET TOKEN START ===");

    if (!Capacitor.isNativePlatform()) {
      console.warn("[MobileNotification] Not a native platform");
      return null;
    }

    // Return cached token if available
    if (this.currentToken) {
      console.log("[MobileNotification] Returning cached token:", this.currentToken.substring(0, 40) + "...");
      return this.currentToken;
    }

    const permission = await this.getPermissionStatus();
    if (permission !== "granted") {
      console.log("[MobileNotification] Permission not granted");
      return null;
    }

    console.log("[MobileNotification] Waiting for FCM token from Firebase...");
    
    try {
      const token = await Promise.race([
        new Promise<string>((resolve, reject) => {
          this.tokenPromiseResolve = resolve;
          this.tokenPromiseReject = reject;
          
          // Trigger registration which will call AppDelegate
          PushNotifications.register().catch(reject);
        }),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            console.error("[MobileNotification] Token timeout after 10 seconds");
            reject(new Error("Token timeout"));
          }, 10000);
        })
      ]);
      
      console.log("[MobileNotification] Token obtained:", token.substring(0, 40) + "...");
      return token;
    } catch (error) {
      console.error("[MobileNotification] Failed to get token:", error);
      return null;
    }
  }

  async registerToken(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) {
      console.warn("[MobileNotification] No token available to register");
      return false;
    }

    try {
      console.log("[MobileNotification] Registering token with backend...");
      console.log("[MobileNotification] Token length:", token.length);
      await AuthApi.storeDeviceToken({
        fcmToken: token,
        platform: this.getPlatform(),
      });
      console.log("[MobileNotification] Token registered successfully");
      return true;
    } catch (error) {
      console.error("[MobileNotification] Failed to register token:", error);
      return false;
    }
  }

  private getPlatform(): "ios" | "android" | "desktop" {
    const platform = Capacitor.getPlatform();
    if (platform === "ios") return "ios";
    if (platform === "android") return "android";
    return "desktop";
  }

  getCurrentToken(): string | null {
    return this.currentToken;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const mobileNotificationService = new MobileNotificationService();
