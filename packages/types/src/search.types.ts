import type { GoogleBook } from "./book.types";
import type { Review } from "./review.types";
import type { UserAuthor } from "./user.types";

export interface SearchResults {
  users: UserAuthor[];
  books: GoogleBook[];
  reviews: Review[];
}

export interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface SearchUsersResult {
  data: UserAuthor[];
  meta: {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
  };
}

export interface SearchBooksResult {
  data: GoogleBook[];
  meta: {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
  };
}

export interface SearchReviewsResult {
  data: Review[];
  meta: {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
  };
}
