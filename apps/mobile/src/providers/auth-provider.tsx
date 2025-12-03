import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AuthContext } from "../models/hooks/use-auth-model";
import { getInitialAuthState, setAuthUser, clearAuthUser } from "../models/auth.model";
import type { User, UserBasic } from "@repo/types";
import { MobileStorage } from "../services/mobile-storage.service";
import { MobileAuthService } from "../services/mobile-auth.service";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState(getInitialAuthState());
  const navigate = useNavigate();

  useEffect(() => {
    const hydrateAuth = async () => {
      const hasTokens = await MobileStorage.hasTokens();
      if (!hasTokens) {
        setAuthState(clearAuthUser());
        return;
      }
      try {
        const me = await MobileAuthService.getMe();
        setAuthState(setAuthUser(me.user));
      } catch (error) {
        await MobileStorage.clearTokens();
        setAuthState(clearAuthUser());
        navigate({ to: "/onboarding" });
      }
    };
    hydrateAuth();
  }, []);

  const setUser = (user: User | UserBasic | null) => {
    if (user) {
      setAuthState(setAuthUser(user));
    } else {
      setAuthState(clearAuthUser());
    }
  };

  const clearUser = async () => {
    try {
      const rememberMe = await MobileStorage.getRememberMe();
      if (!rememberMe) {
        // Only clear tokens if user didn't check "remember me"
        await MobileStorage.clearTokens();
      }
      await MobileAuthService.logout();
    } catch (error) {
      const rememberMe = await MobileStorage.getRememberMe();
      if (!rememberMe) {
        await MobileStorage.clearTokens();
      }
    }
    setAuthState(clearAuthUser());
    navigate({ to: "/onboarding" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        setUser,
        clearUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
