import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileUserService } from "../services/mobile-user.service";
import { useMemo, useState, useCallback } from "react";
import { queryKeys, removeUserReviewsFromFeed, invalidateFeed, updateFollowingCount, } from "@repo/stores";
export const useFollowListViewModel = (userId, type) => {
    const queryClient = useQueryClient();
    const [optimisticUpdates, setOptimisticUpdates] = useState(new Map());
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: type === "followers"
            ? queryKeys.followList.followers(userId)
            : queryKeys.followList.followings(userId),
        queryFn: ({ pageParam = 1 }) => type === "followers"
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
        if (!data)
            return [];
        return data.pages
            .flatMap((page) => page.data)
            .map((user) => {
            const optimisticValue = optimisticUpdates.get(user.id);
            return optimisticValue !== undefined ? { ...user, isFollowing: optimisticValue } : user;
        });
    }, [data, optimisticUpdates]);
    const followMutation = useMutation({
        mutationFn: (targetUserId) => MobileUserService.followUser(targetUserId),
        onMutate: async (targetUserId) => {
            setOptimisticUpdates((prev) => new Map(prev).set(targetUserId, true));
            updateFollowingCount(queryClient, 1);
        },
        onError: (_err, targetUserId) => {
            setOptimisticUpdates((prev) => {
                const newMap = new Map(prev);
                newMap.delete(targetUserId);
                return newMap;
            });
            updateFollowingCount(queryClient, -1);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            // Invalidate feed to include the new user's reviews
            invalidateFeed(queryClient);
        },
    });
    const unfollowMutation = useMutation({
        mutationFn: (targetUserId) => MobileUserService.unfollowUser(targetUserId),
        onMutate: async (targetUserId) => {
            setOptimisticUpdates((prev) => new Map(prev).set(targetUserId, false));
            updateFollowingCount(queryClient, -1);
            // Optimistically remove user's reviews from feed
            removeUserReviewsFromFeed(queryClient, targetUserId);
        },
        onError: (_err, targetUserId) => {
            setOptimisticUpdates((prev) => {
                const newMap = new Map(prev);
                newMap.delete(targetUserId);
                return newMap;
            });
            updateFollowingCount(queryClient, 1);
            // Refetch feed to restore removed reviews
            invalidateFeed(queryClient);
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
    const handleFollow = useCallback((targetUserId) => {
        followMutation.mutate(targetUserId);
    }, [followMutation]);
    const handleUnfollow = useCallback((targetUserId) => {
        unfollowMutation.mutate(targetUserId);
    }, [unfollowMutation]);
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
