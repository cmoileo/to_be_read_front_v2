import { useState } from "react";
import { SearchApi } from "@repo/api-client";
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
      const results = await SearchApi.globalSearch(query);
      setGlobalResults(results);
    } catch (err) {
      setError("search.errors.loadFailed");
      console.error("Global search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const searchUsers = async (params: SearchParams) => {
    setIsLoadingUsers(true);
    setError(null);

    try {
      const results = await SearchApi.searchUsers(params);
      setUsersResults(results);
    } catch (err) {
      setError("search.errors.loadFailed");
      console.error("Users search failed:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const searchBooks = async (params: SearchParams) => {
    setIsLoadingBooks(true);
    setError(null);

    try {
      const results = await SearchApi.searchBooks(params);
      setBooksResults(results);
    } catch (err) {
      setError("search.errors.loadFailed");
      console.error("Books search failed:", err);
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const searchReviews = async (params: SearchParams) => {
    setIsLoadingReviews(true);
    setError(null);

    try {
      const results = await SearchApi.searchReviews(params);
      setReviewsResults(results);
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
