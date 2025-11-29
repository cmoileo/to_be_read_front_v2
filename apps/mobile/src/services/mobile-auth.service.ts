import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UserDetailed,
} from "@repo/types";
import { HttpInterceptor } from "./http-interceptor.service";
import { MobileStorage } from "./mobile-storage.service";

export class MobileAuthService {
  static async register(data: RegisterCredentials): Promise<AuthResponse> {
    return HttpInterceptor.post<AuthResponse>("/register", data, { requiresAuth: false });
  }

  static async login(data: LoginCredentials): Promise<AuthResponse> {
    return HttpInterceptor.post<AuthResponse>("/login", data, { requiresAuth: false });
  }

  static async logout(): Promise<{ message: string }> {
    const result = await HttpInterceptor.post<{ message: string }>("/logout");
    await MobileStorage.clearTokens();
    return result;
  }

  static async getMe(): Promise<{ user: UserDetailed }> {
    return HttpInterceptor.get<{ user: UserDetailed }>("/me");
  }

  static async revokeRefreshToken(): Promise<void> {
    const refreshToken = await MobileStorage.getRefreshToken();
    if (refreshToken) {
      await HttpInterceptor.post("/revoke-refresh-token", { refreshToken });
    }
  }

  static async deleteAccount(): Promise<{ isSuccessfull: boolean }> {
    const result = await HttpInterceptor.delete<{ isSuccessfull: boolean }>("/me");
    await MobileStorage.clearTokens();
    return result;
  }

  static async updateNotificationSettings(
    pushNotificationsEnabled: boolean
  ): Promise<{ pushNotificationsEnabled: boolean }> {
    return HttpInterceptor.put<{ pushNotificationsEnabled: boolean }>("/me/notification-settings", {
      pushNotificationsEnabled,
    });
  }
}
