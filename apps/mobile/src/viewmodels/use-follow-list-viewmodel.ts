import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileUserService, FollowUser } from "../services/mobile-user.service";
import { useMemo, useState, useCallback } from "react";

export const followListKeys = {
  all: ["followList"] as const,
  followers: (userId: number) => [...followListKeys.all, "followers", userId] as const,
  followings: (userId: number) => [...followListKeys.all, "followings", userId] as const,
};

export const useFollowListViewModel = (userId: number, type: "followers" | "following") => {
  const queryClient = useQueryClient();
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<number, boolean>>(new Map());

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey:
      type === "followers" ? followListKeys.followers(userId) : followListKeys.followings(userId),
    queryFn: ({ pageParam = 1 }) =>
      type === "followers"
        ? MobileUserService.getFollowers(userId, pageParam)
        : MobileUserService.getFollowings(userId, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage < lastPage.meta.lastPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!userId,
  });

  const users = useMemo(() => {
    if (!data) return [];
    return data.pages
      .flatMap((page) => page.data)
      .map((user): FollowUser => {
        const optimisticValue = optimisticUpdates.get(user.id);
        return optimisticValue !== undefined ? { ...user, isFollowing: optimisticValue } : user;
      });
  }, [data, optimisticUpdates]);

  const followMutation = useMutation({
    mutationFn: (targetUserId: number) => MobileUserService.followUser(targetUserId),
    onMutate: async (targetUserId: number) => {
      setOptimisticUpdates((prev) => new Map(prev).set(targetUserId, true));
    },
    onError: (_err, targetUserId) => {
      setOptimisticUpdates((prev) => {
        const newMap = new Map(prev);
        newMap.delete(targetUserId);
        return newMap;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (targetUserId: number) => MobileUserService.unfollowUser(targetUserId),
    onMutate: async (targetUserId: number) => {
      setOptimisticUpdates((prev) => new Map(prev).set(targetUserId, false));
    },
    onError: (_err, targetUserId) => {
      setOptimisticUpdates((prev) => {
        const newMap = new Map(prev);
        newMap.delete(targetUserId);
        return newMap;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFollow = useCallback(
    (targetUserId: number) => {
      followMutation.mutate(targetUserId);
    },
    [followMutation]
  );

  const handleUnfollow = useCallback(
    (targetUserId: number) => {
      unfollowMutation.mutate(targetUserId);
    },
    [unfollowMutation]
  );

  return {
    users,
    isLoading,
    hasMore: hasNextPage ?? false,
    isFetchingMore: isFetchingNextPage,
    handleLoadMore,
    handleFollow,
    handleUnfollow,
  };
};
