import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileReviewService } from "../services/mobile-review.service";
import { queryKeys, toggleReviewLike, rollbackLikeState, initializeLikeState } from "@repo/stores";
import { HapticsService } from "../services/native";
export const useSingleReviewViewModel = (reviewId) => {
    const queryClient = useQueryClient();
    const { data: review, isLoading: isLoadingReview, error: reviewError, } = useQuery({
        queryKey: queryKeys.reviews.detail(reviewId),
        queryFn: async () => {
            const reviewData = await MobileReviewService.getReview(reviewId);
            initializeLikeState(queryClient, reviewId, reviewData.isLiked, reviewData.likesCount);
            return reviewData;
        },
        enabled: !!reviewId,
    });
    const { data: commentsData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isLoadingComments, } = useInfiniteQuery({
        queryKey: queryKeys.reviews.comments(reviewId),
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
            await queryClient.cancelQueries({ queryKey: queryKeys.reviews.detail(reviewId) });
            HapticsService.lightImpact();
            toggleReviewLike(queryClient, reviewId);
            return { reviewId };
        },
        onSuccess: () => {
            HapticsService.success();
        },
        onError: (_err, _vars, context) => {
            HapticsService.error();
            if (context?.reviewId) {
                rollbackLikeState(queryClient, context.reviewId);
            }
        },
    });
    const likeCommentMutation = useMutation({
        mutationFn: (commentId) => MobileReviewService.likeComment(commentId),
        onMutate: async (commentId) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.reviews.comments(reviewId) });
            const previousComments = queryClient.getQueryData(queryKeys.reviews.comments(reviewId));
            queryClient.setQueryData(queryKeys.reviews.comments(reviewId), (oldData) => {
                if (!oldData)
                    return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        data: page.data.map((comment) => {
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
                queryClient.setQueryData(queryKeys.reviews.comments(reviewId), context.previousComments);
            }
        },
    });
    const createCommentMutation = useMutation({
        mutationFn: (content) => MobileReviewService.createComment(reviewId, content),
        onSuccess: (newComment) => {
            queryClient.setQueryData(queryKeys.reviews.comments(reviewId), (oldData) => {
                if (!oldData)
                    return oldData;
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
        mutationFn: (commentId) => MobileReviewService.deleteComment(commentId),
        onMutate: async (commentId) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.reviews.comments(reviewId) });
            const previousComments = queryClient.getQueryData(queryKeys.reviews.comments(reviewId));
            queryClient.setQueryData(queryKeys.reviews.comments(reviewId), (oldData) => {
                if (!oldData)
                    return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        data: page.data.filter((comment) => comment.id !== commentId),
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
                queryClient.setQueryData(queryKeys.reviews.comments(reviewId), context.previousComments);
            }
        },
    });
    const handleLikeReview = () => {
        likeReviewMutation.mutate();
    };
    const handleLikeComment = (commentId) => {
        likeCommentMutation.mutate(commentId);
    };
    const handleCreateComment = async (content) => {
        await createCommentMutation.mutateAsync(content);
    };
    const handleDeleteComment = (commentId) => {
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
