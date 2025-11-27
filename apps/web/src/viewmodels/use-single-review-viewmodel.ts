"use client";

import { useState, useCallback, useTransition } from "react";
import type { SingleReview, SingleComment, CommentsPaginatedResponse } from "@/services/web-review.service";
import {
  likeReviewAction,
  likeCommentAction,
  createCommentAction,
  deleteCommentAction,
  getCommentsAction,
} from "@/app/review/[reviewId]/actions";

interface UseSingleReviewViewModelProps {
  initialReview: SingleReview;
  initialCommentsResponse: CommentsPaginatedResponse;
}

export const useSingleReviewViewModel = ({
  initialReview,
  initialCommentsResponse,
}: UseSingleReviewViewModelProps) => {
  const [review, setReview] = useState<SingleReview>(initialReview);
  const [comments, setComments] = useState<SingleComment[]>(initialCommentsResponse.data);
  const [currentPage, setCurrentPage] = useState(initialCommentsResponse.meta.currentPage);
  const [hasMoreComments, setHasMoreComments] = useState(
    initialCommentsResponse.meta.currentPage < initialCommentsResponse.meta.lastPage
  );
  const [isFetchingMoreComments, setIsFetchingMoreComments] = useState(false);
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const [isLikeLoading, startLikeTransition] = useTransition();

  const handleLikeReview = useCallback(() => {
    startLikeTransition(async () => {
      const wasLiked = review.isLiked;
      
      // Optimistic update
      setReview((prev) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1,
      }));

      try {
        await likeReviewAction(review.id);
      } catch (error) {
        // Rollback on error
        setReview((prev) => ({
          ...prev,
          isLiked: wasLiked,
          likesCount: wasLiked ? prev.likesCount + 1 : prev.likesCount - 1,
        }));
        console.error("Failed to like review:", error);
      }
    });
  }, [review.id, review.isLiked]);

  const handleLikeComment = useCallback((commentId: number) => {
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;

    const wasLiked = comment.isLiked;

    // Optimistic update
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              isLiked: !c.isLiked,
              likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1,
            }
          : c
      )
    );

    likeCommentAction(commentId).catch((error) => {
      // Rollback on error
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                isLiked: wasLiked,
                likesCount: wasLiked ? c.likesCount + 1 : c.likesCount - 1,
              }
            : c
        )
      );
      console.error("Failed to like comment:", error);
    });
  }, [comments]);

  const handleCreateComment = useCallback(async (content: string) => {
    setIsCreatingComment(true);
    try {
      const newComment = await createCommentAction(review.id, content);
      setComments((prev) => [newComment, ...prev]);
    } catch (error) {
      console.error("Failed to create comment:", error);
      throw error;
    } finally {
      setIsCreatingComment(false);
    }
  }, [review.id]);

  const handleDeleteComment = useCallback((commentId: number) => {
    const commentToDelete = comments.find((c) => c.id === commentId);
    
    // Optimistic update
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    deleteCommentAction(commentId).catch((error) => {
      // Rollback on error
      if (commentToDelete) {
        setComments((prev) => [...prev, commentToDelete].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
      console.error("Failed to delete comment:", error);
    });
  }, [comments]);

  const handleLoadMoreComments = useCallback(async () => {
    if (isFetchingMoreComments || !hasMoreComments) return;

    setIsFetchingMoreComments(true);
    try {
      const nextPage = currentPage + 1;
      const response = await getCommentsAction(review.id, nextPage);

      setComments((prev) => [...prev, ...response.data]);
      setCurrentPage(response.meta.currentPage);
      setHasMoreComments(response.meta.currentPage < response.meta.lastPage);
    } catch (error) {
      console.error("Failed to load more comments:", error);
    } finally {
      setIsFetchingMoreComments(false);
    }
  }, [currentPage, hasMoreComments, isFetchingMoreComments, review.id]);

  return {
    review,
    comments,
    isLoading: false,
    hasMoreComments,
    isFetchingMoreComments,
    isCreatingComment,
    handleLikeReview,
    handleLikeComment,
    handleCreateComment,
    handleDeleteComment,
    handleLoadMoreComments,
  };
};
