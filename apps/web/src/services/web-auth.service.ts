import type { AuthResponse, LoginCredentials, RegisterCredentials } from "@repo/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function callApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Erreur" }));
    throw new Error(data.message || "Erreur");
  }
  return res.json();
}

export class WebAuthService {
  static async register(data: RegisterCredentials): Promise<AuthResponse> {
    return callApi<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async login(data: LoginCredentials): Promise<AuthResponse> {
    return callApi<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async logout(): Promise<void> {
    try {
      await callApi("/logout", { method: "POST" });
    } catch {}
  }

  static async getMe(accessToken: string): Promise<{ user: any }> {
    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  }

  static async refresh(
    refreshToken: string
  ): Promise<{ token: { token: string }; refreshToken: string }> {
    return callApi("/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  static async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    return callApi(`/auth/check-username/${username}`);
  }

  static async resetPasswordRequest(email: string): Promise<void> {
    return callApi("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  static async resetPasswordConfirm(data: { token: string; password: string }): Promise<void> {
    return callApi("/auth/reset-password/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async deleteAccount(): Promise<{ isSuccessfull: boolean }> {
    return callApi<{ isSuccessfull: boolean }>("/me", { method: "DELETE" });
  }

  static async updateNotificationSettings(
    accessToken: string,
    pushNotificationsEnabled: boolean
  ): Promise<{ pushNotificationsEnabled: boolean }> {
    const res = await fetch(`${API_URL}/me/notification-settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ pushNotificationsEnabled }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to update notification settings");
    return res.json();
  }
}
