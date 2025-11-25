import type {
  SearchResults,
  SearchParams,
  SearchUsersResult,
  SearchBooksResult,
  SearchReviewsResult,
} from "@repo/types";
import { HttpClient } from "../http-client";

export class SearchApi {
  static async globalSearch(query: string): Promise<SearchResults> {
    return HttpClient.get<SearchResults>(`/search?q=${encodeURIComponent(query)}`);
  }

  static async searchUsers(params: SearchParams): Promise<SearchUsersResult> {
    const searchParams = new URLSearchParams({
      q: params.q,
      ...(params.page && { page: params.page.toString() }),
      ...(params.limit && { limit: params.limit.toString() }),
    });

    return HttpClient.get<SearchUsersResult>(`/search/users?${searchParams.toString()}`);
  }

  static async searchBooks(params: SearchParams): Promise<SearchBooksResult> {
    const searchParams = new URLSearchParams({
      q: params.q,
      ...(params.page && { page: params.page.toString() }),
      ...(params.limit && { limit: params.limit.toString() }),
    });

    return HttpClient.get<SearchBooksResult>(`/search/books?${searchParams.toString()}`);
  }

  static async searchReviews(params: SearchParams): Promise<SearchReviewsResult> {
    const searchParams = new URLSearchParams({
      q: params.q,
      ...(params.page && { page: params.page.toString() }),
      ...(params.limit && { limit: params.limit.toString() }),
    });

    return HttpClient.get<SearchReviewsResult>(`/search/reviews?${searchParams.toString()}`);
  }
}
