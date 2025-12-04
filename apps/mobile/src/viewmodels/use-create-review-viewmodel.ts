import { useState } from "react";
import { BooksApi, ReviewsApi } from "@repo/api-client";
import type { GoogleBook } from "@repo/types";
import { useConnectedUser } from "@repo/stores";

export function useCreateReviewViewModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { updateReviewsCount } = useConnectedUser();

  const searchBooks = async (query: string): Promise<GoogleBook[]> => {
    try {
      const results = await BooksApi.searchBooks({ q: query, limit: 10 });
      return results.data;
    } catch (err: any) {
      console.error("Failed to search books:", err);
      return [];
    }
  };

  const createReview = async (data: { content: string; value: number; googleBookId: string }) => {
    setError("");
    setIsLoading(true);

    try {
      await ReviewsApi.createReview(data);
      updateReviewsCount(1);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to create review");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchBooks,
    createReview,
    isLoading,
    error,
  };
}
