import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import type { CreateReviewData } from "@repo/types";
import { ReviewsApi } from "../apis/reviews.api";

export const reviewKeys = {
  all: ["reviews"] as const,
  detail: (id: number) => [...reviewKeys.all, "detail", id] as const,
  userReviews: (userId: number) => [...reviewKeys.all, "user", userId] as const,
  feed: () => [...reviewKeys.all, "feed"] as const,
};

export const useReview = (id: number) => {
  return useQuery({
    queryKey: reviewKeys.detail(id),
    queryFn: async () => {
      const response = await ReviewsApi.getReview(id);
      return response.review;
    },
  });
};

export const useUserReviews = (userId: number) => {
  return useInfiniteQuery({
    queryKey: reviewKeys.userReviews(userId),
    queryFn: ({ pageParam = 1 }) => ReviewsApi.getUserReviews(userId, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.lastPage
        ? lastPage.meta.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });
};

export const useFeed = () => {
  return useInfiniteQuery({
    queryKey: reviewKeys.feed(),
    queryFn: ({ pageParam = 1 }) => ReviewsApi.getFeed(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.lastPage
        ? lastPage.meta.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewData) => ReviewsApi.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.feed() });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ReviewsApi.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
};

export const useLikeReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ReviewsApi.likeReview(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.feed() });
    },
  });
};
