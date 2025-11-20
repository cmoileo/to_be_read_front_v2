import type { User } from "@repo/types";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const getInitialAuthState = (): AuthState => ({
  user: null,
  isAuthenticated: false,
});

export const setAuthUser = (user: User): AuthState => ({
  user,
  isAuthenticated: true,
});

export const clearAuthUser = (): AuthState => ({
  user: null,
  isAuthenticated: false,
});
