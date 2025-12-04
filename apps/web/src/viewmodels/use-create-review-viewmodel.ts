"use client";

import { useState } from "react";
import { WebBooksApi, WebReviewsApi } from "@/services/web-api.service";
import type { GoogleBook } from "@repo/types";
import { useRouter } from "next/navigation";
import { useConnectedUser } from "@repo/stores";

export function useCreateReviewViewModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { updateReviewsCount } = useConnectedUser();

  const searchBooks = async (query: string): Promise<GoogleBook[]> => {
    try {
      const results = await WebBooksApi.searchBooks({ q: query, limit: 10 });
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
      await WebReviewsApi.createReview(data);
      updateReviewsCount(1);
      router.push("/");
      router.refresh();
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
