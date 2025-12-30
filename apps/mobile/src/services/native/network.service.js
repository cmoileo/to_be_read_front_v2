import { Network } from "@capacitor/network";
import { Capacitor } from "@capacitor/core";
class NetworkServiceClass {
    constructor() {
        Object.defineProperty(this, "isNative", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Capacitor.isNativePlatform()
        });
        Object.defineProperty(this, "listeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "currentStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "handleOnline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const status = { connected: true, connectionType: "wifi" };
                this.currentStatus = status;
                this.notifyListeners(status);
            }
        });
        Object.defineProperty(this, "handleOffline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const status = { connected: false, connectionType: "none" };
                this.currentStatus = status;
                this.notifyListeners(status);
            }
        });
    }
    async getStatus() {
        if (!this.isNative) {
            return { connected: navigator.onLine, connectionType: "wifi" };
        }
        return Network.getStatus();
    }
    async isOnline() {
        const status = await this.getStatus();
        return status.connected;
    }
    addListener(callback) {
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
    async startListening() {
        this.currentStatus = await this.getStatus();
        if (this.isNative) {
            Network.addListener("networkStatusChange", (status) => {
                this.currentStatus = status;
                this.notifyListeners(status);
            });
        }
        else {
            window.addEventListener("online", this.handleOnline);
            window.addEventListener("offline", this.handleOffline);
        }
    }
    stopListening() {
        if (this.isNative) {
            Network.removeAllListeners();
        }
        else {
            window.removeEventListener("online", this.handleOnline);
            window.removeEventListener("offline", this.handleOffline);
        }
    }
    notifyListeners(status) {
        this.listeners.forEach((listener) => listener(status));
    }
    getCurrentStatus() {
        return this.currentStatus;
    }
}
export const NetworkService = new NetworkServiceClass();
