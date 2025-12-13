import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileFeedService } from "../services/mobile-feed.service";
import { queryKeys, toggleReviewLike, rollbackLikeState } from "@repo/stores";
import { HapticsService } from "../services/native";

export const useFeedViewModel = () => {
  const queryClient = useQueryClient();

  const {
    data: feedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: queryKeys.feed.list(),
    queryFn: ({ pageParam = 1 }) => MobileFeedService.getFeed(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage < lastPage.meta.lastPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const likeMutation = useMutation({
    mutationFn: (reviewId: number) => MobileFeedService.likeReview(reviewId),
    onMutate: async (reviewId: number) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.feed.list() });
      HapticsService.lightImpact();
      toggleReviewLike(queryClient, reviewId);
      return { reviewId };
    },
    onSuccess: () => {
      HapticsService.success();
    },
    onError: (_err, _reviewId, context) => {
      HapticsService.error();
      if (context?.reviewId) {
        rollbackLikeState(queryClient, context.reviewId);
      }
    },
  });

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleLike = (reviewId: number) => {
    likeMutation.mutate(reviewId);
  };

  const handleRefresh = () => {
    refetch();
  };

  const allReviews = feedData?.pages.flatMap((page) => page.data) ?? [];

  return {
    reviews: allReviews,
    isLoading,
    hasMore: hasNextPage ?? false,
    isFetchingMore: isFetchingNextPage,
    isRefreshing: isRefetching,
    handleLoadMore,
    handleLike,
    handleRefresh,
  };
};
