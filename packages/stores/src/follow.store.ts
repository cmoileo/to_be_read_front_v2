import type { QueryClient } from "@tanstack/react-query";
import type { User } from "@repo/types";
import { queryKeys } from "./keys/query-keys";
import { updateFollowingCount, updateFollowersCount } from "./connected-user.store";

export const followKeys = queryKeys.follow;

type FollowRequestStatus = "none" | "pending" | "accepted" | "rejected";

interface FollowState {
  isFollowing: boolean;
  followersCount: number;
  followRequestStatus: FollowRequestStatus;
}

export const getUserFollowState = (
  queryClient: QueryClient,
  userId: number
): FollowState | null => {
  return queryClient.getQueryData<FollowState>(followKeys.user(userId)) ?? null;
};

export const setUserFollowState = (
  queryClient: QueryClient,
  userId: number,
  state: FollowState
) => {
  queryClient.setQueryData(followKeys.user(userId), state);
};

export const initializeFollowState = (
  queryClient: QueryClient,
  userId: number,
  isFollowing: boolean,
  followersCount: number,
  followRequestStatus: FollowRequestStatus = "none"
) => {
  const existing = getUserFollowState(queryClient, userId);
  if (!existing) {
    setUserFollowState(queryClient, userId, { isFollowing, followersCount, followRequestStatus });
  }
};

export const followUserInCache = (
  queryClient: QueryClient,
  userId: number,
  isPrivateAccount: boolean
): { previousState: FollowState | null } => {
  const previousState = getUserFollowState(queryClient, userId);

  const newState: FollowState = {
    isFollowing: !isPrivateAccount,
    followersCount: !isPrivateAccount
      ? (previousState?.followersCount ?? 0) + 1
      : previousState?.followersCount ?? 0,
    followRequestStatus: isPrivateAccount ? "pending" : "none",
  };

  setUserFollowState(queryClient, userId, newState);

  if (!isPrivateAccount) {
    updateFollowingCount(queryClient, 1);
    invalidateFeedForNewFollowing(queryClient);
  }

  syncFollowStateToUserProfile(queryClient, userId, newState);
  syncFollowStateToFollowLists(queryClient, userId, newState);

  return { previousState };
};

export const unfollowUserInCache = (
  queryClient: QueryClient,
  userId: number
): { previousState: FollowState | null } => {
  const previousState = getUserFollowState(queryClient, userId);

  const newState: FollowState = {
    isFollowing: false,
    followersCount: Math.max(0, (previousState?.followersCount ?? 0) - 1),
    followRequestStatus: "none",
  };

  setUserFollowState(queryClient, userId, newState);

  updateFollowingCount(queryClient, -1);
  removeUserReviewsFromFeedInternal(queryClient, userId);

  syncFollowStateToUserProfile(queryClient, userId, newState);
  syncFollowStateToFollowLists(queryClient, userId, newState);

  return { previousState };
};

export const cancelFollowRequestInCache = (
  queryClient: QueryClient,
  userId: number
): { previousState: FollowState | null } => {
  const previousState = getUserFollowState(queryClient, userId);

  const newState: FollowState = {
    isFollowing: false,
    followersCount: previousState?.followersCount ?? 0,
    followRequestStatus: "none",
  };

  setUserFollowState(queryClient, userId, newState);
  syncFollowStateToUserProfile(queryClient, userId, newState);

  return { previousState };
};

export const acceptFollowRequestInCache = (
  queryClient: QueryClient,
  requesterId: number
) => {
  updateFollowersCount(queryClient, 1);

  queryClient.invalidateQueries({ queryKey: queryKeys.followList.followers(requesterId) });
};

export const rollbackFollowState = (
  queryClient: QueryClient,
  userId: number,
  previousState: FollowState | null
) => {
  if (previousState) {
    setUserFollowState(queryClient, userId, previousState);
    syncFollowStateToUserProfile(queryClient, userId, previousState);
  }
};

const syncFollowStateToUserProfile = (
  queryClient: QueryClient,
  userId: number,
  state: FollowState
) => {
  queryClient.setQueryData(queryKeys.users.detail(userId), (old: User | undefined) => {
    if (!old) return old;
    return {
      ...old,
      isFollowing: state.isFollowing,
      followersCount: state.followersCount,
      followRequestStatus: state.followRequestStatus,
    };
  });
};

const syncFollowStateToFollowLists = (
  queryClient: QueryClient,
  userId: number,
  state: FollowState
) => {
  const queries = queryClient.getQueryCache().findAll({
    predicate: (query) =>
      Array.isArray(query.queryKey) && query.queryKey[0] === "followList",
  });

  queries.forEach((query) => {
    queryClient.setQueryData(query.queryKey, (old: any) => {
      if (!old?.pages) return old;
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          data: page.data.map((user: any) =>
            user.id === userId ? { ...user, isFollowing: state.isFollowing } : user
          ),
        })),
      };
    });
  });
};

const invalidateFeedForNewFollowing = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.feed.list() });
};

const removeUserReviewsFromFeedInternal = (queryClient: QueryClient, userId: number) => {
  queryClient.setQueryData(queryKeys.feed.list(), (old: any) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: page.data.filter((review: any) => review.author?.id !== userId),
      })),
    };
  });
};

export const invalidateFollowLists = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.followList.all });
};
