import { cookies } from "next/headers";
import type { AuthResponse } from "@repo/types";

export class WebStorageService {
  static async setAuthCookies(auth: AuthResponse) {
    const store = await cookies();
    store.set("tbr_access_token", auth.token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    store.set("tbr_refresh_token", auth.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  static async clearAuthCookies() {
    const store = await cookies();
    store.delete("tbr_access_token");
    store.delete("tbr_refresh_token");
  }

  static async getAccessToken(): Promise<string | undefined> {
    const store = await cookies();
    return store.get("tbr_access_token")?.value;
  }

  static async getRefreshToken(): Promise<string | undefined> {
    const store = await cookies();
    return store.get("tbr_refresh_token")?.value;
  }

  static async setAccessToken(token: string) {
    const store = await cookies();
    store.set("tbr_access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  static async setRefreshToken(token: string) {
    const store = await cookies();
    store.set("tbr_refresh_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }
}
