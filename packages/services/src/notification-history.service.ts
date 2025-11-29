import type { NotificationsResponse, UnreadCountResponse } from "@repo/types";

export interface NotificationHistoryServiceConfig {
  baseUrl: string;
  getAccessToken: () => Promise<string | null>;
}

export class NotificationHistoryService {
  private config: NotificationHistoryServiceConfig;

  constructor(config: NotificationHistoryServiceConfig) {
    this.config = config;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = await this.config.getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getNotifications(
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<NotificationsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(unreadOnly ? { unread_only: "true" } : {}),
    });

    const response = await fetch(`${this.config.baseUrl}/notifications?${params}`, {
      method: "GET",
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    return response.json();
  }

  async getUnreadCount(): Promise<number> {
    const response = await fetch(`${this.config.baseUrl}/notifications/unread-count`, {
      method: "GET",
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch unread count");
    }

    const data: UnreadCountResponse = await response.json();
    return data.count;
  }

  async markAsRead(notificationId: number): Promise<boolean> {
    const response = await fetch(`${this.config.baseUrl}/notifications/${notificationId}/read`, {
      method: "PATCH",
      headers: await this.getHeaders(),
    });

    return response.ok;
  }

  async markAllAsRead(): Promise<boolean> {
    const response = await fetch(`${this.config.baseUrl}/notifications/mark-all-read`, {
      method: "POST",
      headers: await this.getHeaders(),
    });

    return response.ok;
  }

  async deleteNotification(notificationId: number): Promise<boolean> {
    const response = await fetch(`${this.config.baseUrl}/notifications/${notificationId}`, {
      method: "DELETE",
      headers: await this.getHeaders(),
    });

    return response.ok;
  }
}

export function createNotificationHistoryService(
  config: NotificationHistoryServiceConfig
): NotificationHistoryService {
  return new NotificationHistoryService(config);
}
