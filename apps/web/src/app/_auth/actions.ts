"use server";

import type { LoginCredentials, RegisterCredentials } from "@repo/types";
import { WebAuthService } from "@/services/web-auth.service";
import { WebStorageService } from "@/services/web-storage.service";

export async function loginAction(credentials: LoginCredentials) {
  const data = await WebAuthService.login(credentials);
  await WebStorageService.setAuthCookies(data);
  return { user: data.user };
}

export async function registerAction(credentials: RegisterCredentials) {
  const data = await WebAuthService.register(credentials);
  await WebStorageService.setAuthCookies(data);
  return { user: data.user };
}

export async function logoutAction() {
  await WebAuthService.logout();
  await WebStorageService.clearAuthCookies();
}

export async function refreshAction() {
  const refreshToken = await WebStorageService.getRefreshToken();
  if (!refreshToken) throw new Error("Missing refresh token");
  
  const data = await WebAuthService.refresh(refreshToken);
  await WebStorageService.setAccessToken(data.token.token);
  await WebStorageService.setRefreshToken(data.refreshToken);
  return true;
}

export async function getUserFromCookies() {
  const access = await WebStorageService.getAccessToken();
  if (!access) return null;
  try {
    const data = await WebAuthService.getMe(access);
    return data.user;
  } catch {
    return null;
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
