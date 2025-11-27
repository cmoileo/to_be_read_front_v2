import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileUserService } from "../services/mobile-user.service";
import type { User } from "@repo/types";

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
        queryClient.setQueryData<User>(userKeys.detail(userId), {
          ...previousUser,
          isFollowing: true,
          followersCount: previousUser.followersCount + 1,
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

  const unfollowMutation = useMutation({
    mutationFn: () => MobileUserService.unfollowUser(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: userKeys.detail(userId) });

      const previousUser = queryClient.getQueryData<User>(userKeys.detail(userId));

      if (previousUser) {
        queryClient.setQueryData<User>(userKeys.detail(userId), {
          ...previousUser,
          isFollowing: false,
          followersCount: previousUser.followersCount - 1,
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

  const handleFollow = () => {
    followMutation.mutate();
  };

  const handleUnfollow = () => {
    unfollowMutation.mutate();
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
    isFollowLoading: followMutation.isPending || unfollowMutation.isPending,
    handleFollow,
    handleUnfollow,
    handleLoadMore,
  };
};
