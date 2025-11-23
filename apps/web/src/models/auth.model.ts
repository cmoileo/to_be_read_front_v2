import type { User } from "@repo/types";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const getInitialAuthState = (): AuthState => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
});

export const setAuthUser = (user: User): AuthState => ({
  user,
  isAuthenticated: true,
  isLoading: false,
});

export const clearAuthUser = (): AuthState => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
});

export const setAuthLoading = (isLoading: boolean, currentState: AuthState): AuthState => ({
  ...currentState,
  isLoading,
});
