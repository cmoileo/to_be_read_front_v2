import { cookies } from "next/headers";
import type { AuthResponse } from "@repo/types";

export class WebStorageService {
  static readonly REMEMBER_ME_MAX_AGE = 365 * 24 * 60 * 60;
  static readonly SESSION_MAX_AGE = 24 * 60 * 60;

  static async setAuthCookies(auth: AuthResponse, rememberMe: boolean = false) {
    const store = await cookies();
    const maxAge = rememberMe ? this.REMEMBER_ME_MAX_AGE : this.SESSION_MAX_AGE;

    store.set("tbr_access_token", auth.token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    store.set("tbr_refresh_token", auth.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    store.set("tbr_remember_me", rememberMe ? "true" : "false", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
  }

  static async clearAuthCookies() {
    const store = await cookies();
    store.delete("tbr_access_token");
    store.delete("tbr_refresh_token");
    store.delete("tbr_remember_me");
  }

  static async getAccessToken(): Promise<string | undefined> {
    const store = await cookies();
    return store.get("tbr_access_token")?.value;
  }

  static async getRefreshToken(): Promise<string | undefined> {
    const store = await cookies();
    return store.get("tbr_refresh_token")?.value;
  }

  static async getRememberMe(): Promise<boolean> {
    const store = await cookies();
    return store.get("tbr_remember_me")?.value === "true";
  }

  static async setAccessToken(token: string, rememberMe: boolean = false) {
    const store = await cookies();
    const maxAge = rememberMe ? this.REMEMBER_ME_MAX_AGE : this.SESSION_MAX_AGE;

    store.set("tbr_access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
  }

  static async setRefreshToken(token: string, rememberMe: boolean = false) {
    const store = await cookies();
    const maxAge = rememberMe ? this.REMEMBER_ME_MAX_AGE : this.SESSION_MAX_AGE;

    store.set("tbr_refresh_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
  }
}
