"use client";

import { useRouter } from "next/navigation";
import { FeedScreen } from "@repo/ui";
import { useFeedViewModel } from "@/viewmodels/use-feed-viewmodel";
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

  const handleAuthorClick = (authorId: number) => {
    router.push(`/user/${authorId}`);
  };

  const handleReviewClick = (reviewId: number) => {
    router.push(`/review/${reviewId}`);
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
      />
    </div>
  );
}
