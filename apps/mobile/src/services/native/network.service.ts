import { Network, ConnectionStatus } from "@capacitor/network";
import { Capacitor } from "@capacitor/core";

type NetworkListener = (status: ConnectionStatus) => void;

class NetworkServiceClass {
  private isNative = Capacitor.isNativePlatform();
  private listeners: Set<NetworkListener> = new Set();
  private currentStatus: ConnectionStatus | null = null;

  async getStatus(): Promise<ConnectionStatus> {
    if (!this.isNative) {
      return { connected: navigator.onLine, connectionType: "wifi" };
    }
    return Network.getStatus();
  }

  async isOnline(): Promise<boolean> {
    const status = await this.getStatus();
    return status.connected;
  }

  addListener(callback: NetworkListener): () => void {
    this.listeners.add(callback);

    if (this.listeners.size === 1) {
      this.startListening();
    }

    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0) {
        this.stopListening();
      }
    };
  }

  private async startListening(): Promise<void> {
    this.currentStatus = await this.getStatus();

    if (this.isNative) {
      Network.addListener("networkStatusChange", (status) => {
        this.currentStatus = status;
        this.notifyListeners(status);
      });
    } else {
      window.addEventListener("online", this.handleOnline);
      window.addEventListener("offline", this.handleOffline);
    }
  }

  private stopListening(): void {
    if (this.isNative) {
      Network.removeAllListeners();
    } else {
      window.removeEventListener("online", this.handleOnline);
      window.removeEventListener("offline", this.handleOffline);
    }
  }

  private handleOnline = (): void => {
    const status: ConnectionStatus = { connected: true, connectionType: "wifi" };
    this.currentStatus = status;
    this.notifyListeners(status);
  };

  private handleOffline = (): void => {
    const status: ConnectionStatus = { connected: false, connectionType: "none" };
    this.currentStatus = status;
    this.notifyListeners(status);
  };

  private notifyListeners(status: ConnectionStatus): void {
    this.listeners.forEach((listener) => listener(status));
  }

  getCurrentStatus(): ConnectionStatus | null {
    return this.currentStatus;
  }
}

export const NetworkService = new NetworkServiceClass();
