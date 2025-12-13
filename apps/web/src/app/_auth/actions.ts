"use server";

import type { LoginCredentials, RegisterCredentials } from "@repo/types";
import { WebAuthService } from "@/services/web-auth.service";
import { WebStorageService } from "@/services/web-storage.service";

export async function loginAction(credentials: LoginCredentials & { rememberMe?: boolean }) {
  const data = await WebAuthService.login(credentials);
  await WebStorageService.setAuthCookies(data, credentials.rememberMe ?? false);
  return { user: data.user };
}

export async function registerAction(credentials: RegisterCredentials & { rememberMe?: boolean }) {
  const data = await WebAuthService.register(credentials);
  await WebStorageService.setAuthCookies(data, credentials.rememberMe ?? false);
  return { user: data.user };
}

export async function logoutAction() {
  await WebStorageService.clearAuthCookies();
  await WebAuthService.logout();
}

export async function refreshAction() {
  const refreshToken = await WebStorageService.getRefreshToken();
  if (!refreshToken) throw new Error("Missing refresh token");

  const rememberMe = await WebStorageService.getRememberMe();
  const data = await WebAuthService.refresh(refreshToken);
  await WebStorageService.setAccessToken(data.token.token, rememberMe);
  await WebStorageService.setRefreshToken(data.refreshToken, rememberMe);
  return true;
}

export async function getUserFromCookies() {
  const access = await WebStorageService.getAccessToken();
  if (!access) return null;
  
  try {
    const data = await WebAuthService.getMe(access);
    return data.user;
  } catch {
    const refreshToken = await WebStorageService.getRefreshToken();
    if (!refreshToken) return null;
    
    try {
      const rememberMe = await WebStorageService.getRememberMe();
      const refreshData = await WebAuthService.refresh(refreshToken);
      await WebStorageService.setAccessToken(refreshData.token.token, rememberMe);
      await WebStorageService.setRefreshToken(refreshData.refreshToken, rememberMe);
      
      const userData = await WebAuthService.getMe(refreshData.token.token);
      return userData.user;
    } catch {
      await WebStorageService.clearAuthCookies();
      return null;
    }
  }
}

export async function checkUsernameAvailability(username: string) {
  return WebAuthService.checkUsernameAvailability(username);
}

export async function resetPasswordRequest(email: string) {
  return WebAuthService.resetPasswordRequest(email);
}

export async function resetPasswordConfirm(data: { token: string; password: string }) {
  return WebAuthService.resetPasswordConfirm(data);
}

export async function deleteAccountAction() {
  const result = await WebAuthService.deleteAccount();
  await WebStorageService.clearAuthCookies();
  return result;
}

export async function updateNotificationSettingsAction(pushNotificationsEnabled: boolean) {
  const accessToken = await WebStorageService.getAccessToken();
  if (!accessToken) throw new Error("Not authenticated");
  return WebAuthService.updateNotificationSettings(accessToken, pushNotificationsEnabled);
}

export async function updatePrivacySettingsAction(isPrivate: boolean) {
  const accessToken = await WebStorageService.getAccessToken();
  if (!accessToken) throw new Error("Not authenticated");
  return WebAuthService.updatePrivacySettings(accessToken, isPrivate);
}
