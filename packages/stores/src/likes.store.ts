import type { QueryClient } from "@tanstack/react-query";
import type { Review } from "@repo/types";
import { queryKeys } from "./keys/query-keys";

export const likesKeys = queryKeys.likes;

interface LikeState {
  isLiked: boolean;
  likesCount: number;
}

export const getReviewLikeState = (queryClient: QueryClient, reviewId: number): LikeState | null => {
  return queryClient.getQueryData<LikeState>(likesKeys.review(reviewId)) ?? null;
};

export const setReviewLikeState = (queryClient: QueryClient, reviewId: number, state: LikeState) => {
  queryClient.setQueryData(likesKeys.review(reviewId), state);
};

export const toggleReviewLike = (queryClient: QueryClient, reviewId: number) => {
  const currentState = getReviewLikeState(queryClient, reviewId);
  const newState: LikeState = currentState
    ? {
        isLiked: !currentState.isLiked,
        likesCount: currentState.isLiked ? currentState.likesCount - 1 : currentState.likesCount + 1,
      }
    : { isLiked: true, likesCount: 1 };

  setReviewLikeState(queryClient, reviewId, newState);

  syncLikeInFeed(queryClient, reviewId, newState);
  syncLikeInReviewDetail(queryClient, reviewId, newState);
  syncLikeInUserReviews(queryClient, reviewId, newState);
  syncLikeInMyReviews(queryClient, reviewId, newState);
  syncLikeInBookReviews(queryClient, reviewId, newState);
};

export const initializeLikeState = (
  queryClient: QueryClient,
  reviewId: number,
  isLiked: boolean,
  likesCount: number
) => {
  const existing = getReviewLikeState(queryClient, reviewId);
  if (!existing) {
    setReviewLikeState(queryClient, reviewId, { isLiked, likesCount });
  }
};

const syncLikeInFeed = (queryClient: QueryClient, reviewId: number, state: LikeState) => {
  queryClient.setQueryData(queryKeys.feed.list(), (old: any) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: page.data.map((review: Review) =>
          review.id === reviewId
            ? { ...review, isLiked: state.isLiked, likesCount: state.likesCount }
            : review
        ),
      })),
    };
  });
};

const syncLikeInReviewDetail = (queryClient: QueryClient, reviewId: number, state: LikeState) => {
  queryClient.setQueryData(queryKeys.reviews.detail(reviewId), (old: any) => {
    if (!old) return old;
    return { ...old, isLiked: state.isLiked, likesCount: state.likesCount };
  });
};

const syncLikeInUserReviews = (queryClient: QueryClient, reviewId: number, state: LikeState) => {
  const queries = queryClient.getQueryCache().findAll({
    predicate: (query) =>
      Array.isArray(query.queryKey) &&
      query.queryKey[0] === "users" &&
      query.queryKey[1] === "reviews",
  });

  queries.forEach((query) => {
    queryClient.setQueryData(query.queryKey, (old: any) => {
      if (!old?.pages) return old;
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          data: page.data.map((review: Review) =>
            review.id === reviewId
              ? { ...review, isLiked: state.isLiked, likesCount: state.likesCount }
              : review
          ),
        })),
      };
    });
  });
};

const syncLikeInMyReviews = (queryClient: QueryClient, reviewId: number, state: LikeState) => {
  const queries = queryClient.getQueryCache().findAll({
    predicate: (query) =>
      Array.isArray(query.queryKey) && query.queryKey[0] === "myReviews",
  });

  queries.forEach((query) => {
    queryClient.setQueryData(query.queryKey, (old: any) => {
      if (!old?.pages) return old;
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          data: page.data.map((review: Review) =>
            review.id === reviewId
              ? { ...review, isLiked: state.isLiked, likesCount: state.likesCount }
              : review
          ),
        })),
      };
    });
  });
};

const syncLikeInBookReviews = (queryClient: QueryClient, reviewId: number, state: LikeState) => {
  const queries = queryClient.getQueryCache().findAll({
    predicate: (query) =>
      Array.isArray(query.queryKey) &&
      query.queryKey[0] === "books" &&
      query.queryKey[1] === "reviews",
  });

  queries.forEach((query) => {
    queryClient.setQueryData(query.queryKey, (old: any) => {
      if (!old?.pages) return old;
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          data: page.data.map((review: Review) =>
            review.id === reviewId
              ? { ...review, isLiked: state.isLiked, likesCount: state.likesCount }
              : review
          ),
        })),
      };
    });
  });
};

export const rollbackLikeState = (queryClient: QueryClient, reviewId: number) => {
  toggleReviewLike(queryClient, reviewId);
};
