import type { User, UserBasic } from "@repo/types";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const getInitialAuthState = (): AuthState => ({
  user: null,
  isAuthenticated: false,
});

export const setAuthUser = (user: User | UserBasic): AuthState => ({
  user: user as User,
  isAuthenticated: true,
});

export const clearAuthUser = (): AuthState => ({
  user: null,
  isAuthenticated: false,
});
