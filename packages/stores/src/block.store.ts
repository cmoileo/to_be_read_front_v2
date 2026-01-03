import type { QueryClient } from "@tanstack/react-query";
import type { User } from "@repo/types";
import { queryKeys } from "./keys/query-keys";

export const blockKeys = {
  all: ["blocks"] as const,
  list: () => [...blockKeys.all, "list"] as const,
  status: (userId: number) => [...blockKeys.all, "status", userId] as const,
};

interface BlockState {
  isBlocked: boolean;
  hasBlockedMe: boolean;
}

export const getBlockState = (
  queryClient: QueryClient,
  userId: number
): BlockState | null => {
  return queryClient.getQueryData<BlockState>(blockKeys.status(userId)) ?? null;
};

export const setBlockState = (
  queryClient: QueryClient,
  userId: number,
  state: BlockState
) => {
  queryClient.setQueryData(blockKeys.status(userId), state);
};

export const blockUserInCache = (
  queryClient: QueryClient,
  userId: number
): { previousState: BlockState | null; previousUserData: User | null } => {
  const previousState = getBlockState(queryClient, userId);
  const previousUserData = queryClient.getQueryData<User>(queryKeys.users.detail(userId)) ?? null;

  // Update block status
  setBlockState(queryClient, userId, {
    isBlocked: true,
    hasBlockedMe: previousState?.hasBlockedMe ?? false,
  });

  // Update user profile - also remove follow relationship
  queryClient.setQueryData(queryKeys.users.detail(userId), (old: User | undefined) => {
    if (!old) return old;
    return {
      ...old,
      isBlocked: true,
      isFollowing: false,
      followRequestStatus: "none" as const,
    };
  });

  return { previousState, previousUserData };
};

export const unblockUserInCache = (
  queryClient: QueryClient,
  userId: number
): { previousState: BlockState | null } => {
  const previousState = getBlockState(queryClient, userId);

  setBlockState(queryClient, userId, {
    isBlocked: false,
    hasBlockedMe: previousState?.hasBlockedMe ?? false,
  });

  // Update user profile
  queryClient.setQueryData(queryKeys.users.detail(userId), (old: User | undefined) => {
    if (!old) return old;
    return {
      ...old,
      isBlocked: false,
    };
  });

  return { previousState };
};

export const rollbackBlockState = (
  queryClient: QueryClient,
  userId: number,
  previousState: BlockState | null,
  previousUserData?: User | null
) => {
  if (previousState) {
    setBlockState(queryClient, userId, previousState);
  }
  if (previousUserData) {
    queryClient.setQueryData(queryKeys.users.detail(userId), previousUserData);
  }
};

export const invalidateBlockRelatedCaches = (queryClient: QueryClient, userId: number) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.followList.followers(userId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.followList.followings(userId) });
  queryClient.invalidateQueries({ queryKey: blockKeys.list() });
};
