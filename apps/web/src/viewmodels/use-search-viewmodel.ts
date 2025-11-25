import { useState } from "react";
import { WebSearchApi } from "../services/web-search.service";
import type {
  SearchResults,
  SearchParams,
  SearchUsersResult,
  SearchBooksResult,
  SearchReviewsResult,
} from "@repo/types";

export function useSearchViewModel() {
  const [globalResults, setGlobalResults] = useState<SearchResults | null>(null);
  const [usersResults, setUsersResults] = useState<SearchUsersResult | null>(null);
  const [booksResults, setBooksResults] = useState<SearchBooksResult | null>(null);
  const [reviewsResults, setReviewsResults] = useState<SearchReviewsResult | null>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const globalSearch = async (query: string) => {
    if (!query.trim()) {
      setGlobalResults(null);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const results = await WebSearchApi.globalSearch(query);
      setGlobalResults(results);
    } catch (err) {
      setError("search.errors.loadFailed");
      console.error("Global search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const searchUsers = async (params: SearchParams, append = false) => {
    setIsLoadingUsers(true);
    setError(null);

    try {
      const results = await WebSearchApi.searchUsers(params);
      if (append && usersResults) {
        setUsersResults({
          ...results,
          data: [...usersResults.data, ...results.data],
        });
      } else {
        setUsersResults(results);
      }
    } catch (err) {
      setError("search.errors.loadFailed");
      console.error("Users search failed:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const searchBooks = async (params: SearchParams, append = false) => {
    setIsLoadingBooks(true);
    setError(null);

    try {
      const results = await WebSearchApi.searchBooks(params);
      if (append && booksResults) {
        setBooksResults({
          ...results,
          items: [...booksResults.items, ...results.items],
        });
      } else {
        setBooksResults(results);
      }
    } catch (err) {
      setError("search.errors.loadFailed");
      console.error("Books search failed:", err);
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const searchReviews = async (params: SearchParams, append = false) => {
    setIsLoadingReviews(true);
    setError(null);

    try {
      const results = await WebSearchApi.searchReviews(params);
      if (append && reviewsResults) {
        setReviewsResults({
          ...results,
          data: [...reviewsResults.data, ...results.data],
        });
      } else {
        setReviewsResults(results);
      }
    } catch (err) {
      setError("search.errors.loadFailed");
      console.error("Reviews search failed:", err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  return {
    globalResults,
    usersResults,
    booksResults,
    reviewsResults,
    isSearching,
    isLoadingUsers,
    isLoadingBooks,
    isLoadingReviews,
    error,
    globalSearch,
    searchUsers,
    searchBooks,
    searchReviews,
  };
}
