import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileFeedService } from "../services/mobile-feed.service";
import { feedKeys, toggleLikeInFeed } from "@repo/stores";

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
    queryKey: feedKeys.list(),
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
      await queryClient.cancelQueries({ queryKey: feedKeys.list() });

      const previousData = queryClient.getQueryData(feedKeys.list());

      toggleLikeInFeed(queryClient, reviewId);

      return { previousData };
    },
    onError: (_err, _reviewId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(feedKeys.list(), context.previousData);
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
