import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import type { CreateCommentData } from "@repo/types";
import { CommentsApi } from "../apis/comments.api";
import { reviewKeys } from "./use-reviews";

export const commentKeys = {
  all: ["comments"] as const,
  reviewComments: (reviewId: number) => [...commentKeys.all, "review", reviewId] as const,
};

export const useReviewComments = (reviewId: number) => {
  return useInfiniteQuery({
    queryKey: commentKeys.reviewComments(reviewId),
    queryFn: ({ pageParam = 1 }) => CommentsApi.getComments(reviewId, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.lastPage
        ? lastPage.meta.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) => CommentsApi.createComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.reviewComments(variables.reviewId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.detail(variables.reviewId) });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => CommentsApi.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => CommentsApi.likeComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
};
