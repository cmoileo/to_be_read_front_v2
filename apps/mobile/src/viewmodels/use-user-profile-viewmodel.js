import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileUserService } from "../services/mobile-user.service";
import { queryKeys, followUserInCache, unfollowUserInCache, cancelFollowRequestInCache, rollbackFollowState, initializeFollowState, } from "@repo/stores";
import { HapticsService } from "../services/native";
export const useUserProfileViewModel = (userId) => {
    const queryClient = useQueryClient();
    const { data: user, isLoading: isLoadingUser, } = useQuery({
        queryKey: queryKeys.users.detail(userId),
        queryFn: async () => {
            const userData = await MobileUserService.getUser(userId);
            initializeFollowState(queryClient, userId, userData.isFollowing, userData.followersCount, userData.followRequestStatus);
            return userData;
        },
        enabled: !!userId,
    });
    const { data: reviewsData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isLoadingReviews, } = useInfiniteQuery({
        queryKey: queryKeys.users.reviews(userId),
        queryFn: ({ pageParam = 1 }) => MobileUserService.getUserReviews(userId, pageParam),
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.currentPage < lastPage.meta.lastPage) {
                return lastPage.meta.currentPage + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!userId,
    });
    const followMutation = useMutation({
        mutationFn: () => MobileUserService.followUser(userId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: queryKeys.users.detail(userId) });
            HapticsService.lightImpact();
            const isPrivate = user?.isPrivate ?? false;
            const { previousState } = followUserInCache(queryClient, userId, isPrivate);
            return { previousState };
        },
        onSuccess: () => {
            HapticsService.success();
        },
        onError: (_err, _vars, context) => {
            HapticsService.error();
            if (context?.previousState) {
                rollbackFollowState(queryClient, userId, context.previousState);
            }
        },
    });
    const unfollowMutation = useMutation({
        mutationFn: () => MobileUserService.unfollowUser(userId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: queryKeys.users.detail(userId) });
            HapticsService.mediumImpact();
            const { previousState } = unfollowUserInCache(queryClient, userId);
            return { previousState };
        },
        onSuccess: () => {
            HapticsService.success();
        },
        onError: (_err, _vars, context) => {
            HapticsService.error();
            if (context?.previousState) {
                rollbackFollowState(queryClient, userId, context.previousState);
            }
        },
    });
    const cancelRequestMutation = useMutation({
        mutationFn: () => MobileUserService.cancelFollowRequest(userId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: queryKeys.users.detail(userId) });
            const { previousState } = cancelFollowRequestInCache(queryClient, userId);
            return { previousState };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousState) {
                rollbackFollowState(queryClient, userId, context.previousState);
            }
        },
    });
    const handleFollow = () => {
        followMutation.mutate();
    };
    const handleUnfollow = () => {
        unfollowMutation.mutate();
    };
    const handleCancelRequest = () => {
        cancelRequestMutation.mutate();
    };
    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };
    const allReviews = reviewsData?.pages.flatMap((page) => page.data) ?? [];
    return {
        user: user ?? null,
        reviews: allReviews,
        isLoading: isLoadingUser || isLoadingReviews,
        hasMore: hasNextPage ?? false,
        isFetchingMore: isFetchingNextPage,
        isFollowLoading: followMutation.isPending || unfollowMutation.isPending || cancelRequestMutation.isPending,
        handleFollow,
        handleUnfollow,
        handleCancelRequest,
        handleLoadMore,
    };
};
