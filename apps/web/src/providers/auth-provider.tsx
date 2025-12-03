"use client";

import { useRef, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { connectedUserKeys } from "@repo/stores";
import type { User } from "@repo/types";

interface AuthProviderProps {
  children: ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const isHydrated = useRef(false);

  // Hydrate the query cache synchronously on first render (not in useEffect)
  if (!isHydrated.current) {
    queryClient.setQueryData(connectedUserKeys.profile(), initialUser);
    isHydrated.current = true;
  }

  return <>{children}</>;
}
