"use client";

import { SingleBookScreen } from "@repo/ui";
import { useSingleBookViewModel } from "./use-single-book-viewmodel";
import type { GoogleBook, BookReviewsPaginatedResponse } from "@/services/web-book.service";

interface SingleBookClientProps {
  initialBook: GoogleBook;
  initialReviewsResponse: BookReviewsPaginatedResponse;
}

export default function SingleBookClient({
  initialBook,
  initialReviewsResponse,
}: SingleBookClientProps) {
  const {
    book,
    reviews,
    totalReviews,
    isLoading,
    hasMoreReviews,
    isFetchingMoreReviews,
    handleLoadMoreReviews,
    handleBack,
    handleReviewClick,
    handleAuthorClick,
  } = useSingleBookViewModel({ initialBook, initialReviewsResponse });

  return (
    <SingleBookScreen
      book={book}
      reviews={reviews}
      totalReviews={totalReviews}
      isLoading={isLoading}
      hasMoreReviews={hasMoreReviews}
      isFetchingMoreReviews={isFetchingMoreReviews}
      onBack={handleBack}
      onLoadMoreReviews={handleLoadMoreReviews}
      onReviewClick={handleReviewClick}
      onAuthorClick={handleAuthorClick}
    />
  );
}
