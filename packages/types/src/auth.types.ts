export interface Token {
  type: string;
  token: string;
  expiresAt?: string;
}

export interface LoginCredentials {
  email?: string;
  userName?: string;
  password: string;
}

export interface RegisterCredentials {
  userName: string;
  email: string;
  password: string;
  locale?: "en" | "fr";
  theme?: "light" | "dark" | "system";
}

export interface AuthResponse {
  user: {
    id: number;
    userName: string;
  };
  token: Token;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: Token;
  refreshToken: string;
}

export interface RevokeRefreshTokenRequest {
  refreshToken: string;
}

export interface AuthUser {
  id: number;
  userName: string;
}

export interface UpdateProfileData {
  userName?: string;
  biography?: string;
  email?: string;
  avatar?: File;
}

export interface UpdatePrivacySettingsData {
  isPrivate: boolean;
}

export interface UpdatePrivacySettingsResponse {
  status: string;
  message: string;
  isPrivate: boolean;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordConfirm {
  email: string;
  code: string;
}

export interface DeviceToken {
  token: string;
  platform: "ios" | "android" | "web" | "desktop";
}

export type NotificationPermissionStatus = "granted" | "denied" | "default";

export interface NotificationData {
  type: "like" | "comment" | "follow";
  reviewId?: number;
  userId?: number;
  userName?: string;
}
