import { createContext, useContext } from "react";
import type { AuthState } from "../auth.model";

interface AuthContextValue extends AuthState {
  setUser: (user: AuthState["user"]) => void;
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
