import { Store } from "@tauri-apps/plugin-store";

const ACCESS_TOKEN_KEY = "tbr_access_token";
const REFRESH_TOKEN_KEY = "tbr_refresh_token";

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
        this.initialized = true;
      }
    }
  }

  async setAccessToken(token: string): Promise<void> {
    await this.initStore();
    if (this.store) {
      await this.store.set(ACCESS_TOKEN_KEY, token);
      await this.store.save();
    } else {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
      }
    }
  }

  async getAccessToken(): Promise<string | null> {
    await this.initStore();
    if (this.store) {
      const token = await this.store.get<string>(ACCESS_TOKEN_KEY);
      return token || null;
    } else {
      if (typeof window !== "undefined") {
        return window.localStorage.getItem(ACCESS_TOKEN_KEY);
      }
      return null;
    }
  }

  async setRefreshToken(token: string): Promise<void> {
    await this.initStore();
    if (this.store) {
      await this.store.set(REFRESH_TOKEN_KEY, token);
      await this.store.save();
    } else {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
      }
    }
  }

  async getRefreshToken(): Promise<string | null> {
    await this.initStore();
    if (this.store) {
      const token = await this.store.get<string>(REFRESH_TOKEN_KEY);
      return token || null;
    } else {
      if (typeof window !== "undefined") {
        return window.localStorage.getItem(REFRESH_TOKEN_KEY);
      }
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    await this.initStore();
    if (this.store) {
      await this.store.delete(ACCESS_TOKEN_KEY);
      await this.store.delete(REFRESH_TOKEN_KEY);
      await this.store.save();
    } else {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(ACCESS_TOKEN_KEY);
        window.localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
  }

  async hasTokens(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    const refreshToken = await this.getRefreshToken();
    return !!accessToken && !!refreshToken;
  }
}

export const MobileStorage = new MobileStorageService();
