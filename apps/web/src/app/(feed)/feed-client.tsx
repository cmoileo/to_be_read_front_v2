"use client";

import { useRouter } from "next/navigation";
import { FeedScreen, ReportDialog } from "@repo/ui";
import { useFeedViewModel } from "@/viewmodels/use-feed-viewmodel";
import { useReportViewModel } from "@/viewmodels/use-report-viewmodel";
import { useNotificationRegistration } from "@/hooks/use-notification-registration";
import type { Review, PaginatedResponse } from "@repo/types";

interface FeedClientProps {
  initialFeedResponse: PaginatedResponse<Review> | null;
}

export default function FeedClient({ initialFeedResponse }: FeedClientProps) {
  const router = useRouter();

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
        onReport={handleReportReview}
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
