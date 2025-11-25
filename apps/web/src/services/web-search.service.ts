import { SearchApi as BaseSearchApi } from "@repo/api-client";
import { authFetch } from "../lib/auth-fetch";
import type {
  SearchResults,
  SearchParams,
  SearchUsersResult,
  SearchBooksResult,
  SearchReviewsResult,
} from "@repo/types";

export class WebSearchApi {
  static async globalSearch(query: string): Promise<SearchResults> {
    const response = await authFetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error("Failed to search");
    }
    return response.json();
  }

  static async searchUsers(params: SearchParams): Promise<SearchUsersResult> {
    const searchParams = new URLSearchParams({
      q: params.q,
      ...(params.page && { page: params.page.toString() }),
      ...(params.limit && { limit: params.limit.toString() }),
    });

    const response = await authFetch(`/api/search/users?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to search users");
    }
    return response.json();
  }

  static async searchBooks(params: SearchParams): Promise<SearchBooksResult> {
    const searchParams = new URLSearchParams({
      q: params.q,
      ...(params.page && { page: params.page.toString() }),
      ...(params.limit && { limit: params.limit.toString() }),
    });

    const response = await authFetch(`/api/search/books?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to search books");
    }
    return response.json();
  }

  static async searchReviews(params: SearchParams): Promise<SearchReviewsResult> {
    const searchParams = new URLSearchParams({
      q: params.q,
      ...(params.page && { page: params.page.toString() }),
      ...(params.limit && { limit: params.limit.toString() }),
    });

    const response = await authFetch(`/api/search/reviews?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to search reviews");
    }
    return response.json();
  }
}
