import type { NotificationItem } from "@repo/types";

export interface SSENotificationEvent {
  type: "new_notification" | "unread_count";
  notification?: NotificationItem;
  count?: number;
}

export type SSEEventHandler = (event: SSENotificationEvent) => void;

export interface SSENotificationServiceConfig {
  apiUrl: string;
  getAccessToken: () => Promise<string | null>;
  userId: number;
  onEvent: SSEEventHandler;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

/**
 * SSE Notification Service for real-time updates
 * Uses Server-Sent Events to receive notifications and unread count updates
 */
export class SSENotificationService {
  private eventSource: EventSource | null = null;
  private config: SSENotificationServiceConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  constructor(config: SSENotificationServiceConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (this.eventSource || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const token = await this.config.getAccessToken();
      if (!token) {
        throw new Error("No access token available");
      }

      const channel = `notifications/users/${this.config.userId}`;
      const url = `${this.config.apiUrl}/__transmit/events?channels=${encodeURIComponent(channel)}`;

      this.eventSource = new EventSource(url, {
        withCredentials: false,
      });

      await this.subscribeToChannel(token, channel);

      this.eventSource.onopen = () => {
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.config.onConnect?.();
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as SSENotificationEvent;
          this.config.onEvent(data);
        } catch (error) {
          console.error("Failed to parse SSE event:", error);
        }
      };

      this.eventSource.onerror = () => {
        this.isConnecting = false;
        this.config.onDisconnect?.();
        this.handleReconnect();
      };
    } catch (error) {
      this.isConnecting = false;
      this.config.onError?.(error as Error);
      this.handleReconnect();
    }
  }

  private async subscribeToChannel(token: string, channel: string): Promise<void> {
    try {
      const response = await fetch(`${this.config.apiUrl}/__transmit/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ channel }),
      });

      if (!response.ok) {
        throw new Error(`Failed to subscribe to channel: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to subscribe to SSE channel:", error);
      throw error;
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnect attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      this.disconnect();
      this.connect();
    }, delay);
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnecting = false;
  }

  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}
