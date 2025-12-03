import type { QueryClient } from "@tanstack/react-query";
import type { Review } from "@repo/types";

export const feedKeys = {
  all: ["feed"] as const,
  list: () => [...feedKeys.all, "list"] as const,
};

/**
 * Removes all reviews from a specific user from the feed cache
 * Used when unfollowing someone
 */
export const removeUserReviewsFromFeed = (queryClient: QueryClient, userId: number) => {
  queryClient.setQueryData(feedKeys.list(), (old: any) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: page.data.filter((review: Review) => review.author.id !== userId),
      })),
    };
  });
};

/**
 * Invalidates the feed to refetch fresh data
 * Used when following someone to include their reviews
 */
export const invalidateFeed = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: feedKeys.list() });
};

/**
 * Updates a specific review in the feed cache
 */
export const updateReviewInFeed = (
  queryClient: QueryClient,
  reviewId: number,
  updates: Partial<Review>
) => {
  queryClient.setQueryData(feedKeys.list(), (old: any) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: page.data.map((review: Review) =>
          review.id === reviewId ? { ...review, ...updates } : review
        ),
      })),
    };
  });
};

/**
 * Toggle like on a review in the feed cache (optimistic update)
 */
export const toggleLikeInFeed = (queryClient: QueryClient, reviewId: number) => {
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
};
