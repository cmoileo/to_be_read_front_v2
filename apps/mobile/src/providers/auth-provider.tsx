import { ReactNode, useState, useEffect } from "react";
import { TokenStorage } from "@repo/services";
import { AuthContext } from "../models/hooks/use-auth-model";
import { getInitialAuthState, setAuthUser, clearAuthUser } from "../models/auth.model";
import type { User } from "@repo/types";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState(getInitialAuthState());

  useEffect(() => {
    const hasToken = TokenStorage.hasToken();
    if (!hasToken) {
      setAuthState(clearAuthUser());
    }
  }, []);

  const setUser = (user: User | null) => {
    if (user) {
      setAuthState(setAuthUser(user));
    } else {
      setAuthState(clearAuthUser());
    }
  };

  const clearUser = () => {
    TokenStorage.clearToken();
    setAuthState(clearAuthUser());
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
