"use client";

import { useRef, useEffect, type ReactNode } from "react";
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
  const lastUserId = useRef<number | null>(null);

  if (!isHydrated.current) {
    queryClient.setQueryData(connectedUserKeys.profile(), initialUser);
    lastUserId.current = initialUser?.id ?? null;
    isHydrated.current = true;
  }

  useEffect(() => {
    const currentUserId = initialUser?.id ?? null;
    if (lastUserId.current !== currentUserId) {
      queryClient.setQueryData(connectedUserKeys.profile(), initialUser);
      lastUserId.current = currentUserId;
    }
  }, [initialUser, queryClient]);

  return <>{children}</>;
}
