import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileFeedService } from "../services/mobile-feed.service";
import type { Review } from "@repo/types";

export const feedKeys = {
  all: ["feed"] as const,
  list: () => [...feedKeys.all, "list"] as const,
};

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

      queryClient.setQueryData(feedKeys.list(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((review: Review) =>
              review.id === reviewId
                ? {
                    ...review,
                    isLiked: !review.isLiked,
                    likesCount: review.isLiked ? review.likesCount - 1 : review.likesCount + 1,
                  }
                : review
            ),
          })),
        };
      });

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
