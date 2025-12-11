const ACCESS_TOKEN_KEY = "tbr_access_token";
const REFRESH_TOKEN_KEY = "tbr_refresh_token";
const REMEMBER_ME_KEY = "tbr_remember_me";

class MobileStorageService {
  async setAccessToken(token: string): Promise<void> {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  }

  async getAccessToken(): Promise<string | null> {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
  }

  async setRefreshToken(token: string): Promise<void> {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  }

  async getRefreshToken(): Promise<string | null> {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  }

  async setRememberMe(rememberMe: boolean): Promise<void> {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? "true" : "false");
    }
  }

  async getRememberMe(): Promise<boolean> {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(REMEMBER_ME_KEY) === "true";
    }
    return false;
  }

  async clearTokens(): Promise<void> {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  async hasTokens(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    const refreshToken = await this.getRefreshToken();
    return !!accessToken && !!refreshToken;
  }
}

export const MobileStorage = new MobileStorageService();
