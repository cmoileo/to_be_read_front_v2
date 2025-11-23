import { createContext, useContext } from "react";
import type { AuthState } from "../auth.model";
import type { User } from "@repo/types";

interface AuthContextValue extends AuthState {
  setUser: (user: User | null) => void;
  clearUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
