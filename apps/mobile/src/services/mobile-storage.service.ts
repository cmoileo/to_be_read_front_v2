import { Store } from "@tauri-apps/plugin-store";

const TOKEN_KEY = "tbr_access_token";

class MobileStorageService {
  private store: Store | null = null;
  private initialized = false;

  private async initStore() {
    if (!this.initialized) {
      try {
        this.store = await Store.load("app.store");
        this.initialized = true;
      } catch (error) {
        console.error("Failed to initialize mobile storage:", error);
        // Fallback to localStorage for web preview
        this.initialized = true;
      }
    }
  }

  async setToken(token: string): Promise<void> {
    await this.initStore();
    if (this.store) {
      await this.store.set(TOKEN_KEY, token);
      await this.store.save();
    } else {
      // Fallback to localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_KEY, token);
      }
    }
  }

  async getToken(): Promise<string | null> {
    await this.initStore();
    if (this.store) {
      const token = await this.store.get<string>(TOKEN_KEY);
      return token || null;
    } else {
      // Fallback to localStorage
      if (typeof window !== "undefined") {
        return window.localStorage.getItem(TOKEN_KEY);
      }
      return null;
    }
  }

  async clearToken(): Promise<void> {
    await this.initStore();
    if (this.store) {
      await this.store.delete(TOKEN_KEY);
      await this.store.save();
    } else {
      // Fallback to localStorage
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_KEY);
      }
    }
  }

  async hasToken(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export const MobileStorage = new MobileStorageService();
