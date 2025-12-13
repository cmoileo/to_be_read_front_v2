import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileUserService } from "../services/mobile-user.service";
import type { User } from "@repo/types";
import { removeUserReviewsFromFeed, invalidateFeed, updateFollowingCount } from "@repo/stores";

export const userKeys = {
  all: ["users"] as const,
  detail: (userId: number) => [...userKeys.all, "detail", userId] as const,
  reviews: (userId: number) => [...userKeys.all, "reviews", userId] as const,
};

export const useUserProfileViewModel = (userId: number) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isLoadingUser,
  } = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => MobileUserService.getUser(userId),
    enabled: !!userId,
  });

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingReviews,
  } = useInfiniteQuery({
    queryKey: userKeys.reviews(userId),
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
      await queryClient.cancelQueries({ queryKey: userKeys.detail(userId) });

      const previousUser = queryClient.getQueryData<User>(userKeys.detail(userId));

      if (previousUser) {
        const isPrivateAccount = previousUser.isPrivate;
        queryClient.setQueryData<User>(userKeys.detail(userId), {
          ...previousUser,
          isFollowing: !isPrivateAccount,
          followersCount: !isPrivateAccount ? (Number(previousUser.followersCount) || 0) + 1 : Number(previousUser.followersCount) || 0,
          followRequestStatus: isPrivateAccount ? "pending" : previousUser.followRequestStatus,
        });
      }

      if (!previousUser?.isPrivate) {
        updateFollowingCount(queryClient, 1);
      }

      return { previousUser };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.detail(userId), context.previousUser);
      }
      if (!context?.previousUser?.isPrivate) {
        updateFollowingCount(queryClient, -1);
      }
    },
    onSuccess: (data) => {
      if (data.followed) {
        invalidateFeed(queryClient);
      }
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => MobileUserService.unfollowUser(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: userKeys.detail(userId) });

      const previousUser = queryClient.getQueryData<User>(userKeys.detail(userId));

      if (previousUser) {
        queryClient.setQueryData<User>(userKeys.detail(userId), {
          ...previousUser,
          isFollowing: false,
          followersCount: Math.max(0, (Number(previousUser.followersCount) || 0) - 1),
        });
      }

      updateFollowingCount(queryClient, -1);
      removeUserReviewsFromFeed(queryClient, userId);

      return { previousUser };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.detail(userId), context.previousUser);
      }
      updateFollowingCount(queryClient, 1);
      invalidateFeed(queryClient);
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

  const cancelRequestMutation = useMutation({
    mutationFn: () => MobileUserService.cancelFollowRequest(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: userKeys.detail(userId) });

      const previousUser = queryClient.getQueryData<User>(userKeys.detail(userId));

      if (previousUser) {
        queryClient.setQueryData<User>(userKeys.detail(userId), {
          ...previousUser,
          followRequestStatus: "none",
        });
      }

      return { previousUser };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.detail(userId), context.previousUser);
      }
    },
  });

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
