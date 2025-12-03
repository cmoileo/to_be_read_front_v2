import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Review, PaginatedResponse } from "@repo/types";
import { getFeedAction, likeReviewAction } from "@/app/_feed/actions";
import { feedKeys, toggleLikeInFeed } from "@repo/stores";

interface UseFeedViewModelProps {
  initialFeedResponse: PaginatedResponse<Review> | null;
}

export function useFeedViewModel({ initialFeedResponse }: UseFeedViewModelProps) {
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
    queryFn: async ({ pageParam = 1 }) => {
      return getFeedAction(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage < lastPage.meta.lastPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    initialData: initialFeedResponse
      ? {
          pages: [initialFeedResponse],
          pageParams: [1],
        }
      : undefined,
  });

  const likeMutation = useMutation({
    mutationFn: (reviewId: number) => likeReviewAction(reviewId),
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
}
