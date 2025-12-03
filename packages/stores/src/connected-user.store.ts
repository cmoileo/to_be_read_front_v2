import type { QueryClient } from "@tanstack/react-query";
import type { User } from "@repo/types";

export const connectedUserKeys = {
  all: ["connectedUser"] as const,
  profile: () => [...connectedUserKeys.all, "profile"] as const,
};

/**
 * Safely convert a value to a number, returning 0 if NaN
 */
const toSafeNumber = (value: unknown): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

/**
 * Get the connected user from the cache
 */
export const getConnectedUser = (queryClient: QueryClient): User | null => {
  return queryClient.getQueryData<User>(connectedUserKeys.profile()) ?? null;
};

/**
 * Set the connected user in the cache
 */
export const setConnectedUser = (queryClient: QueryClient, user: User | null) => {
  if (user) {
    // Ensure all count fields are numbers
    const sanitizedUser = {
      ...user,
      followingCount: toSafeNumber(user.followingCount),
      followersCount: toSafeNumber(user.followersCount),
      reviewsCount: toSafeNumber(user.reviewsCount),
    };
    queryClient.setQueryData(connectedUserKeys.profile(), sanitizedUser);
  } else {
    queryClient.setQueryData(connectedUserKeys.profile(), null);
  }
};

/**
 * Clear the connected user from the cache
 */
export const clearConnectedUser = (queryClient: QueryClient) => {
  queryClient.setQueryData(connectedUserKeys.profile(), null);
  queryClient.removeQueries({ queryKey: connectedUserKeys.profile() });
};

/**
 * Update the connected user's following count (optimistic update)
 */
export const updateFollowingCount = (queryClient: QueryClient, delta: number) => {
  queryClient.setQueryData<User>(connectedUserKeys.profile(), (oldUser) => {
    if (!oldUser) return oldUser;
    const currentCount = toSafeNumber(oldUser.followingCount);
    const safeDelta = toSafeNumber(delta);
    return {
      ...oldUser,
      followingCount: Math.max(0, currentCount + safeDelta),
    };
  });
};

/**
 * Update the connected user's followers count (optimistic update)
 */
export const updateFollowersCount = (queryClient: QueryClient, delta: number) => {
  queryClient.setQueryData<User>(connectedUserKeys.profile(), (oldUser) => {
    if (!oldUser) return oldUser;
    const currentCount = toSafeNumber(oldUser.followersCount);
    const safeDelta = toSafeNumber(delta);
    return {
      ...oldUser,
      followersCount: Math.max(0, currentCount + safeDelta),
    };
  });
};

/**
 * Update the connected user's reviews count (optimistic update)
 */
export const updateReviewsCount = (queryClient: QueryClient, delta: number) => {
  queryClient.setQueryData<User>(connectedUserKeys.profile(), (oldUser) => {
    if (!oldUser) return oldUser;
    const currentCount = toSafeNumber(oldUser.reviewsCount);
    const safeDelta = toSafeNumber(delta);
    return {
      ...oldUser,
      reviewsCount: Math.max(0, currentCount + safeDelta),
    };
  });
};

/**
 * Update the connected user with partial data
 */
export const updateConnectedUser = (queryClient: QueryClient, updates: Partial<User>) => {
  queryClient.setQueryData<User>(connectedUserKeys.profile(), (oldUser) => {
    if (!oldUser) return oldUser;
    return {
      ...oldUser,
      ...updates,
    };
  });
};

/**
 * Invalidate the connected user to refetch from server
 */
export const invalidateConnectedUser = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: connectedUserKeys.profile() });
};
