import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileReviewService, SingleReview, SingleComment } from "../services/mobile-review.service";

export const reviewKeys = {
  all: ["reviews"] as const,
  detail: (reviewId: number) => [...reviewKeys.all, "detail", reviewId] as const,
  comments: (reviewId: number) => [...reviewKeys.all, "comments", reviewId] as const,
};

export const useSingleReviewViewModel = (reviewId: number) => {
  const queryClient = useQueryClient();

  const {
    data: review,
    isLoading: isLoadingReview,
    error: reviewError,
  } = useQuery({
    queryKey: reviewKeys.detail(reviewId),
    queryFn: () => MobileReviewService.getReview(reviewId),
    enabled: !!reviewId,
  });

  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingComments,
  } = useInfiniteQuery({
    queryKey: reviewKeys.comments(reviewId),
    queryFn: ({ pageParam = 1 }) => MobileReviewService.getComments(reviewId, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage < lastPage.meta.lastPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!reviewId,
  });

  const likeReviewMutation = useMutation({
    mutationFn: () => MobileReviewService.likeReview(reviewId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: reviewKeys.detail(reviewId) });
      const previousReview = queryClient.getQueryData<SingleReview>(reviewKeys.detail(reviewId));

      if (previousReview) {
        const isCurrentlyLiked = previousReview.isLiked;
        queryClient.setQueryData<SingleReview>(reviewKeys.detail(reviewId), {
          ...previousReview,
          isLiked: !isCurrentlyLiked,
          likesCount: isCurrentlyLiked ? previousReview.likesCount - 1 : previousReview.likesCount + 1,
        });
      }

      return { previousReview };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousReview) {
        queryClient.setQueryData(reviewKeys.detail(reviewId), context.previousReview);
      }
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: (commentId: number) => MobileReviewService.likeComment(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: reviewKeys.comments(reviewId) });
      const previousComments = queryClient.getQueryData(reviewKeys.comments(reviewId));

      queryClient.setQueryData(reviewKeys.comments(reviewId), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((comment: SingleComment) => {
              if (comment.id === commentId) {
                const isCurrentlyLiked = comment.isLiked;
                const currentLikesCount = Number(comment.likesCount) || 0;
                return {
                  ...comment,
                  isLiked: !isCurrentlyLiked,
                  likesCount: isCurrentlyLiked ? currentLikesCount - 1 : currentLikesCount + 1,
                };
              }
              return comment;
            }),
          })),
        };
      });

      return { previousComments };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(reviewKeys.comments(reviewId), context.previousComments);
      }
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => MobileReviewService.createComment(reviewId, content),
    onSuccess: (newComment) => {
      queryClient.setQueryData(reviewKeys.comments(reviewId), (oldData: any) => {
        if (!oldData) return oldData;
        const firstPage = oldData.pages[0];
        return {
          ...oldData,
          pages: [
            {
              ...firstPage,
              data: [newComment, ...firstPage.data],
              meta: {
                ...firstPage.meta,
                total: firstPage.meta.total + 1,
              },
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => MobileReviewService.deleteComment(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: reviewKeys.comments(reviewId) });
      const previousComments = queryClient.getQueryData(reviewKeys.comments(reviewId));

      queryClient.setQueryData(reviewKeys.comments(reviewId), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((comment: SingleComment) => comment.id !== commentId),
            meta: {
              ...page.meta,
              total: page.meta.total - 1,
            },
          })),
        };
      });

      return { previousComments };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(reviewKeys.comments(reviewId), context.previousComments);
      }
    },
  });

  const handleLikeReview = () => {
    likeReviewMutation.mutate();
  };

  const handleLikeComment = (commentId: number) => {
    likeCommentMutation.mutate(commentId);
  };

  const handleCreateComment = async (content: string) => {
    await createCommentMutation.mutateAsync(content);
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId);
  };

  const handleLoadMoreComments = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const allComments = commentsData?.pages.flatMap((page) => page.data) ?? [];

  return {
    review: review ?? null,
    comments: allComments,
    isLoading: isLoadingReview || isLoadingComments,
    isLoadingReview,
    isLoadingComments,
    hasMoreComments: hasNextPage ?? false,
    isFetchingMoreComments: isFetchingNextPage,
    isCreatingComment: createCommentMutation.isPending,
    reviewError,
    handleLikeReview,
    handleLikeComment,
    handleCreateComment,
    handleDeleteComment,
    handleLoadMoreComments,
  };
};
