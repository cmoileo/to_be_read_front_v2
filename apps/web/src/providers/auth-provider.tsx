"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/models/hooks/use-auth-context";
import { getInitialAuthState, setAuthUser, clearAuthUser } from "@/models/auth.model";
import { logoutAction } from "@/app/_auth/actions";
import type { User } from "@repo/types";

interface AuthProviderProps {
  children: ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [authState, setAuthState] = useState(() =>
    initialUser ? setAuthUser(initialUser) : getInitialAuthState()
  );
  const router = useRouter();

  useEffect(() => {
    if (initialUser) {
      setAuthState(setAuthUser(initialUser));
    } else {
      setAuthState(clearAuthUser());
    }
  }, [initialUser]);

  const setUser = (user: User | null) => {
    if (user) {
      setAuthState(setAuthUser(user));
    } else {
      setAuthState(clearAuthUser());
    }
  };

  const clearUser = async () => {
    await logoutAction();
    setAuthState(clearAuthUser());
    router.push("/login");
    router.refresh();
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
