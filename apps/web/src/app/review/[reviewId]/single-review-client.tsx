"use client";

import { useRouter } from "next/navigation";
import { SingleReviewScreen } from "@repo/ui";
import { useSingleReviewViewModel } from "@/viewmodels/use-single-review-viewmodel";
import type { SingleReview, CommentsPaginatedResponse } from "@/services/web-review.service";

interface SingleReviewClientProps {
  initialReview: SingleReview;
  initialCommentsResponse: CommentsPaginatedResponse;
}

export default function SingleReviewClient({
  initialReview,
  initialCommentsResponse,
}: SingleReviewClientProps) {
  const router = useRouter();

  const {
    review,
    comments,
    isLoading,
    hasMoreComments,
    isFetchingMoreComments,
    isCreatingComment,
    handleLikeReview,
    handleLikeComment,
    handleCreateComment,
    handleDeleteComment,
    handleLoadMoreComments,
  } = useSingleReviewViewModel({ initialReview, initialCommentsResponse });

  const handleBack = () => {
    router.back();
  };

  const handleAuthorClick = (authorId: number) => {
    router.push(`/user/${authorId}`);
  };

  const handleBookClick = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  return (
    <SingleReviewScreen
      review={review}
      comments={comments}
      isLoading={isLoading}
      hasMoreComments={hasMoreComments}
      isFetchingMoreComments={isFetchingMoreComments}
      isCreatingComment={isCreatingComment}
      onBack={handleBack}
      onLikeReview={handleLikeReview}
      onLikeComment={handleLikeComment}
      onDeleteComment={handleDeleteComment}
      onCreateComment={handleCreateComment}
      onLoadMoreComments={handleLoadMoreComments}
      onAuthorClick={handleAuthorClick}
      onBookClick={handleBookClick}
    />
  );
}
