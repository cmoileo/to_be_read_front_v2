import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useSyncExternalStore } from "react";
import type { User } from "@repo/types";
import { 
  connectedUserKeys, 
  setConnectedUser as setUserInCache, 
  clearConnectedUser,
  updateConnectedUser as updateUserInCache,
  updateFollowingCount as updateFollowingInCache,
  updateFollowersCount as updateFollowersInCache,
  updateReviewsCount as updateReviewsInCache,
  getConnectedUser,
} from "../connected-user.store";

/**
 * Hook to manage the connected user using TanStack Query as the single source of truth.
 * Replaces the old AuthContext pattern.
 */
export function useConnectedUser() {
  const queryClient = useQueryClient();

  // Subscribe to query cache changes for the connected user
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
        if (event.query.queryKey[0] === connectedUserKeys.all[0]) {
          onStoreChange();
        }
      });
      return unsubscribe;
    },
    [queryClient]
  );

  const getSnapshot = useCallback(() => {
    return getConnectedUser(queryClient);
  }, [queryClient]);

  const user = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const isAuthenticated = !!user;

  const setUser = useCallback((newUser: User | null) => {
    if (newUser) {
      setUserInCache(queryClient, newUser);
    } else {
      clearConnectedUser(queryClient);
    }
  }, [queryClient]);

  const clearUser = useCallback(() => {
    clearConnectedUser(queryClient);
  }, [queryClient]);

  const updateUser = useCallback((updates: Partial<User>) => {
    updateUserInCache(queryClient, updates);
  }, [queryClient]);

  const updateFollowingCount = useCallback((delta: number) => {
    updateFollowingInCache(queryClient, delta);
  }, [queryClient]);

  const updateFollowersCount = useCallback((delta: number) => {
    updateFollowersInCache(queryClient, delta);
  }, [queryClient]);

  const updateReviewsCount = useCallback((delta: number) => {
    updateReviewsInCache(queryClient, delta);
  }, [queryClient]);

  return {
    user,
    isAuthenticated,
    setUser,
    clearUser,
    updateUser,
    updateFollowingCount,
    updateFollowersCount,
    updateReviewsCount,
    queryClient,
  };
}

/**
 * Initialize the connected user in the query cache.
 * Should be called once at app startup with the initial user data.
 */
export function initConnectedUser(queryClient: ReturnType<typeof useQueryClient>, user: User | null) {
  queryClient.setQueryData(connectedUserKeys.profile(), user);
}
