import type { NotificationPermissionStatus } from "@repo/types";

export interface NotificationServiceConfig {
  vapidKey?: string;
  onTokenReceived?: (token: string) => Promise<void>;
  onNotificationReceived?: (notification: NotificationPayload) => void;
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  icon?: string;
}

export abstract class BaseNotificationService {
  protected config: NotificationServiceConfig;

  constructor(config: NotificationServiceConfig = {}) {
    this.config = config;
  }

  abstract initialize(): Promise<boolean>;
  abstract requestPermission(): Promise<NotificationPermissionStatus>;
  abstract getToken(): Promise<string | null>;
  abstract isSupported(): boolean;

  getPermissionStatus(): NotificationPermissionStatus {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied";
    }
    return Notification.permission as NotificationPermissionStatus;
  }

  showLocalNotification(payload: NotificationPayload): void {
    if (this.getPermissionStatus() !== "granted") {
      return;
    }

    new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || "/icon-192.png",
      data: payload.data,
    });
  }
}
