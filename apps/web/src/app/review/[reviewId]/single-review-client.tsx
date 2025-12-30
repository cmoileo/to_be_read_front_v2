"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SingleReviewScreen, AuthPromptDialog, ReportDialog, type AuthPromptType } from "@repo/ui";
import { useConnectedUser } from "@repo/stores";
import { useSingleReviewViewModel } from "@/viewmodels/use-single-review-viewmodel";
import { useReportViewModel } from "@/viewmodels/use-report-viewmodel";
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
  const { user } = useConnectedUser();
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authPromptType, setAuthPromptType] = useState<AuthPromptType>("like");

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

  const reportViewModel = useReportViewModel();

  const showAuthPrompt = (type: AuthPromptType) => {
    setAuthPromptType(type);
    setAuthPromptOpen(true);
  };

  const handleBack = () => {
    router.back();
  };

  const handleAuthorClick = (authorId: number) => {
    router.push(`/user/${authorId}`);
  };

  const handleBookClick = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  const handleLikeReviewWithAuth = () => {
    if (!user) {
      showAuthPrompt("like");
      return;
    }
    handleLikeReview();
  };

  const handleLikeCommentWithAuth = (commentId: number) => {
    if (!user) {
      showAuthPrompt("like");
      return;
    }
    handleLikeComment(commentId);
  };

  const handleCreateCommentWithAuth = async (content: string) => {
    if (!user) {
      showAuthPrompt("comment");
      return;
    }
    await handleCreateComment(content);
  };

  const handleReportReview = (reviewId: number) => {
    if (!user) {
      showAuthPrompt("like");
      return;
    }
    reportViewModel.openReportDialog("review", reviewId);
  };

  const handleReportComment = (commentId: number) => {
    if (!user) {
      showAuthPrompt("like");
      return;
    }
    reportViewModel.openReportDialog("comment", commentId);
  };

  return (
    <>
      <SingleReviewScreen
        review={review}
        comments={comments}
        isLoading={isLoading}
        hasMoreComments={hasMoreComments}
        isFetchingMoreComments={isFetchingMoreComments}
        isCreatingComment={isCreatingComment}
        onBack={handleBack}
        onLikeReview={handleLikeReviewWithAuth}
        onLikeComment={handleLikeCommentWithAuth}
        onDeleteComment={handleDeleteComment}
        onCreateComment={handleCreateCommentWithAuth}
        onLoadMoreComments={handleLoadMoreComments}
        onAuthorClick={handleAuthorClick}
        onBookClick={handleBookClick}
        onReportReview={handleReportReview}
        onReportComment={handleReportComment}
      />
      <AuthPromptDialog
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
        promptType={authPromptType}
        onLogin={() => router.push("/login")}
        onRegister={() => router.push("/register")}
      />
      <ReportDialog
        open={reportViewModel.isOpen}
        onOpenChange={reportViewModel.closeReportDialog}
        entityType={reportViewModel.entityType}
        entityId={reportViewModel.entityId}
        onSubmit={reportViewModel.submitReport}
        isLoading={reportViewModel.isLoading}
      />
    </>
  );
}
