import type { QueryClient } from "@tanstack/react-query";
import type { User } from "@repo/types";

export const connectedUserKeys = {
  all: ["connectedUser"] as const,
  profile: () => [...connectedUserKeys.all, "profile"] as const,
  pendingRequests: () => [...connectedUserKeys.all, "pendingRequests"] as const,
};

const toSafeNumber = (value: unknown): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export const getConnectedUser = (queryClient: QueryClient): User | null => {
  return queryClient.getQueryData<User>(connectedUserKeys.profile()) ?? null;
};

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

export const clearConnectedUser = (queryClient: QueryClient) => {
  queryClient.setQueryData(connectedUserKeys.profile(), null);
  queryClient.removeQueries({ queryKey: connectedUserKeys.profile() });
};

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

export const updateConnectedUser = (queryClient: QueryClient, updates: Partial<User>) => {
  queryClient.setQueryData<User>(connectedUserKeys.profile(), (oldUser) => {
    if (!oldUser) return oldUser;
    return {
      ...oldUser,
      ...updates,
    };
  });
};

export const invalidateConnectedUser = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: connectedUserKeys.profile() });
};

export const getPendingRequestsCount = (queryClient: QueryClient): number => {
  return queryClient.getQueryData<number>(connectedUserKeys.pendingRequests()) ?? 0;
};

export const setPendingRequestsCount = (queryClient: QueryClient, count: number) => {
  queryClient.setQueryData(connectedUserKeys.pendingRequests(), count);
};

export const updatePendingRequestsCount = (queryClient: QueryClient, delta: number) => {
  queryClient.setQueryData<number>(connectedUserKeys.pendingRequests(), (old) => {
    return Math.max(0, (old ?? 0) + delta);
  });
};

export const updatePrivacyStatus = (queryClient: QueryClient, isPrivate: boolean) => {
  queryClient.setQueryData<User>(connectedUserKeys.profile(), (oldUser) => {
    if (!oldUser) return oldUser;
    return {
      ...oldUser,
      isPrivate,
    };
  });
};

export const isUserPrivate = (queryClient: QueryClient): boolean => {
  const user = getConnectedUser(queryClient);
  return user?.isPrivate ?? false;
};
