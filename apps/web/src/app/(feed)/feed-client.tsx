"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FeedScreen, ReportDialog, AuthPromptDialog, type AuthPromptType } from "@repo/ui";
import { useConnectedUser } from "@repo/stores";
import { useFeedViewModel } from "@/viewmodels/use-feed-viewmodel";
import { useReportViewModel } from "@/viewmodels/use-report-viewmodel";
import { useNotificationRegistration } from "@/hooks/use-notification-registration";
import type { Review, PaginatedResponse } from "@repo/types";

interface FeedClientProps {
  initialFeedResponse: PaginatedResponse<Review> | null;
}

export default function FeedClient({ initialFeedResponse }: FeedClientProps) {
  const router = useRouter();
  const { user } = useConnectedUser();
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authPromptType, setAuthPromptType] = useState<AuthPromptType>("like");

  useNotificationRegistration();

  const {
    reviews,
    isLoading,
    hasMore,
    isFetchingMore,
    isRefreshing,
    handleLoadMore,
    handleLike,
    handleRefresh,
  } = useFeedViewModel({ initialFeedResponse });

  const reportViewModel = useReportViewModel();

  const showAuthPrompt = (type: AuthPromptType) => {
    setAuthPromptType(type);
    setAuthPromptOpen(true);
  };

  const handleAuthorClick = (authorId: number) => {
    router.push(`/user/${authorId}`);
  };

  const handleReviewClick = (reviewId: number) => {
    router.push(`/review/${reviewId}`);
  };

  const handleCreateReview = () => {
    router.push("/review");
  };

  const handleSearch = () => {
    router.push("/search");
  };

  const handleReportReview = (reviewId: number) => {
    if (!user) {
      showAuthPrompt("like");
      return;
    }
    reportViewModel.openReportDialog("review", reviewId);
  };

  return (
    <div className="container py-6 max-w-2xl mx-auto">
      <FeedScreen
        reviews={reviews}
        isLoading={isLoading}
        hasMore={hasMore}
        isFetchingMore={isFetchingMore}
        isRefreshing={isRefreshing}
        onLoadMore={handleLoadMore}
        onLike={handleLike}
        onAuthorClick={handleAuthorClick}
        onReviewClick={handleReviewClick}
        onRefresh={handleRefresh}
        onCreateReview={handleCreateReview}
        onSearch={handleSearch}
        onReport={user ? handleReportReview : undefined}
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
    </div>
  );
}
