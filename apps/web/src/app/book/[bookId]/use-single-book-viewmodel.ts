"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { GoogleBook, BookReview, BookReviewsPaginatedResponse } from "@/services/web-book.service";
import { getBookReviewsAction } from "./actions";

interface UseSingleBookViewModelProps {
  initialBook: GoogleBook;
  initialReviewsResponse: BookReviewsPaginatedResponse;
}

export const useSingleBookViewModel = ({
  initialBook,
  initialReviewsResponse,
}: UseSingleBookViewModelProps) => {
  const router = useRouter();
  const [reviews, setReviews] = useState<BookReview[]>(initialReviewsResponse.data);
  const [currentPage, setCurrentPage] = useState(initialReviewsResponse.meta.currentPage);
  const [hasMoreReviews, setHasMoreReviews] = useState(
    initialReviewsResponse.meta.currentPage < initialReviewsResponse.meta.lastPage
  );
  const [isFetchingMoreReviews, setIsFetchingMoreReviews] = useState(false);
  const totalReviews = initialReviewsResponse.meta.total;

  const handleLoadMoreReviews = useCallback(async () => {
    if (isFetchingMoreReviews || !hasMoreReviews) return;

    setIsFetchingMoreReviews(true);
    try {
      const nextPage = currentPage + 1;
      const response = await getBookReviewsAction(initialBook.id, nextPage);

      setReviews((prev) => [...prev, ...response.data]);
      setCurrentPage(response.meta.currentPage);
      setHasMoreReviews(response.meta.currentPage < response.meta.lastPage);
    } catch (error) {
      console.error("Failed to load more reviews:", error);
    } finally {
      setIsFetchingMoreReviews(false);
    }
  }, [currentPage, hasMoreReviews, isFetchingMoreReviews, initialBook.id]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleReviewClick = useCallback((reviewId: number) => {
    router.push(`/review/${reviewId}`);
  }, [router]);

  const handleAuthorClick = useCallback((authorId: number) => {
    router.push(`/user/${authorId}`);
  }, [router]);

  return {
    book: initialBook,
    reviews,
    totalReviews,
    isLoading: false,
    hasMoreReviews,
    isFetchingMoreReviews,
    handleLoadMoreReviews,
    handleBack,
    handleReviewClick,
    handleAuthorClick,
  };
};
