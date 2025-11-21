import { createContext, useContext } from "react";
import type { AuthState } from "../auth.model";
import type { User, UserBasic } from "@repo/types";

interface AuthContextValue extends AuthState {
  setUser: (user: User | UserBasic) => void;
  clearUser: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuthModel = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthModel must be used within AuthProvider");
  }
  return context;
};
