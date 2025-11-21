import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AuthContext } from "../models/hooks/use-auth-model";
import { getInitialAuthState, setAuthUser, clearAuthUser } from "../models/auth.model";
import type { User, UserBasic } from "@repo/types";
import { MobileStorage } from "../services/mobile-storage.service";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState(getInitialAuthState());
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const hasToken = await MobileStorage.hasToken();
      if (!hasToken) {
        setAuthState(clearAuthUser());
      }
    };
    checkAuth();
  }, []);

  const setUser = (user: User | UserBasic | null) => {
    if (user) {
      setAuthState(setAuthUser(user));
    } else {
      setAuthState(clearAuthUser());
    }
  };

  const clearUser = async () => {
    await MobileStorage.clearToken();
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
