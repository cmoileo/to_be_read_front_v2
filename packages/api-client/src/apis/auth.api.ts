import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UserDetailed,
  UpdateProfileData,
  ResetPasswordRequest,
  ResetPasswordConfirm,
  DeviceToken,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RevokeRefreshTokenRequest,
} from "@repo/types";
import { TokenStorage } from "@repo/services";
import { HttpClient } from "../http-client";

export class AuthApi {
  static async register(data: RegisterCredentials): Promise<AuthResponse> {
    return HttpClient.post<AuthResponse>("/register", data, { requiresAuth: false });
  }

  static async login(data: LoginCredentials): Promise<AuthResponse> {
    return HttpClient.post<AuthResponse>("/login", data, { requiresAuth: false });
  }

  static async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return HttpClient.post<RefreshTokenResponse>("/refresh", data, { requiresAuth: false });
  }

  static async revokeRefreshToken(data: RevokeRefreshTokenRequest): Promise<{ status: string; code: string; message: string }> {
    return HttpClient.post<{ status: string; code: string; message: string }>("/revoke-refresh-token", data);
  }

  static async logout(): Promise<{ message: string }> {
    return HttpClient.post<{ message: string }>("/logout");
  }

  static async getMe(): Promise<{ user: UserDetailed }> {
    return HttpClient.get<{ user: UserDetailed }>("/me");
  }

  static async updateMe(data: UpdateProfileData): Promise<{ user: UserDetailed }> {
    const formData = new FormData();
    if (data.userName) formData.append("userName", data.userName);
    if (data.biography) formData.append("biography", data.biography);
    if (data.email) formData.append("email", data.email);
    if (data.avatar) formData.append("avatar", data.avatar);

    const response = await fetch(`${HttpClient}/me`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${TokenStorage.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return response.json();
  }

  static async deleteMe(): Promise<{ message: string }> {
    return HttpClient.delete<{ message: string }>("/me");
  }

  static async isUsernameAvailable(username: string): Promise<{ available: boolean }> {
    return HttpClient.get<{ available: boolean }>(`/is-username-available/${username}`, {
      requiresAuth: false,
    });
  }

  static async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return HttpClient.post<{ message: string }>("/password/reset", data, { requiresAuth: false });
  }

  static async resetPasswordConfirm(data: ResetPasswordConfirm): Promise<{ message: string }> {
    return HttpClient.post<{ message: string }>("/password/reset/confirm", data, {
      requiresAuth: false,
    });
  }

  static async storeDeviceToken(data: DeviceToken): Promise<{ message: string }> {
    return HttpClient.post<{ message: string }>("/device-token", data);
  }
}
