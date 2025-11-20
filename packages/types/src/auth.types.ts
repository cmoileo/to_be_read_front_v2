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
}

export interface AuthResponse {
  user: {
    id: number;
    userName: string;
  };
  token: Token;
}

export interface UpdateProfileData {
  userName?: string;
  biography?: string;
  email?: string;
  avatar?: File;
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
  platform: "ios" | "android";
}
