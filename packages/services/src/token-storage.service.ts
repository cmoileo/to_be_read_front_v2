const TOKEN_KEY = "tbr_access_token";

export class TokenStorage {
  private static getStorage(): Storage | null {
    if (typeof window !== "undefined") {
      return window.localStorage;
    }
    return null;
  }

  static setToken(token: string): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem(TOKEN_KEY, token);
    }
  }

  static getToken(): string | null {
    const storage = this.getStorage();
    return storage ? storage.getItem(TOKEN_KEY) : null;
  }

  static clearToken(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem(TOKEN_KEY);
    }
  }

  static hasToken(): boolean {
    return !!this.getToken();
  }
}
