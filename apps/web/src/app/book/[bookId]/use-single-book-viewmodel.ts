"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  GoogleBook,
  BookReview,
  BookReviewsPaginatedResponse,
} from "@/services/web-book.service";
import { WebToReadListService } from "@/services/web-to-read-list.service";
import { getBookReviewsAction } from "./actions";

const bookKeys = {
  isInList: (bookId: string) => ["books", "isInList", bookId] as const,
};

const toReadListKeys = {
  all: ["toReadList"] as const,
};

interface UseSingleBookViewModelProps {
  initialBook: GoogleBook;
  initialReviewsResponse: BookReviewsPaginatedResponse;
}

export const useSingleBookViewModel = ({
  initialBook,
  initialReviewsResponse,
}: UseSingleBookViewModelProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [reviews, setReviews] = useState<BookReview[]>(initialReviewsResponse.data);
  const [currentPage, setCurrentPage] = useState(initialReviewsResponse.meta.currentPage);
  const [hasMoreReviews, setHasMoreReviews] = useState(
    initialReviewsResponse.meta.currentPage < initialReviewsResponse.meta.lastPage
  );
  const [isFetchingMoreReviews, setIsFetchingMoreReviews] = useState(false);
  const totalReviews = initialReviewsResponse.meta.total;

  const { data: isInReadList = false } = useQuery({
    queryKey: bookKeys.isInList(initialBook.id),
    queryFn: async () => {
      try {
        const result = await WebToReadListService.getToReadList(1);
        return result.data.some((item) => item.googleBookId === initialBook.id);
      } catch {
        return false;
      }
    },
  });

  const addToListMutation = useMutation({
    mutationFn: () => WebToReadListService.addToReadList(initialBook.id),
    onSuccess: () => {
      queryClient.setQueryData(bookKeys.isInList(initialBook.id), true);
      queryClient.invalidateQueries({ queryKey: toReadListKeys.all });
    },
  });

  const removeFromListMutation = useMutation({
    mutationFn: () => WebToReadListService.removeFromReadList(initialBook.id),
    onSuccess: () => {
      queryClient.setQueryData(bookKeys.isInList(initialBook.id), false);
      queryClient.invalidateQueries({ queryKey: toReadListKeys.all });
    },
  });

  const handleToggleReadList = useCallback(() => {
    if (isInReadList) {
      removeFromListMutation.mutate();
    } else {
      addToListMutation.mutate();
    }
  }, [isInReadList, addToListMutation, removeFromListMutation]);

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

  const handleReviewClick = useCallback(
    (reviewId: number) => {
      router.push(`/review/${reviewId}`);
    },
    [router]
  );

  const handleAuthorClick = useCallback(
    (authorId: number) => {
      router.push(`/user/${authorId}`);
    },
    [router]
  );

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
    isInReadList,
    isAddingToList: addToListMutation.isPending || removeFromListMutation.isPending,
    handleToggleReadList,
  };
};
