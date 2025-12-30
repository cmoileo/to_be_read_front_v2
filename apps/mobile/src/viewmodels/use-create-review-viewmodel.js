import { useState } from "react";
import { BooksApi, ReviewsApi } from "@repo/api-client";
import { useConnectedUser } from "@repo/stores";
export function useCreateReviewViewModel() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { updateReviewsCount } = useConnectedUser();
    const searchBooks = async (query) => {
        try {
            const results = await BooksApi.searchBooks({ q: query, limit: 10 });
            return results.data;
        }
        catch (err) {
            console.error("Failed to search books:", err);
            return [];
        }
    };
    const createReview = async (data) => {
        setError("");
        setIsLoading(true);
        try {
            await ReviewsApi.createReview(data);
            updateReviewsCount(1);
            return true;
        }
        catch (err) {
            setError(err.message || "Failed to create review");
            return false;
        }
        finally {
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
