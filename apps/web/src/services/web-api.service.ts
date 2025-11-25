import { authFetch } from "../lib/auth-fetch";
import type { GoogleBook, BooksSearchParams, CreateReviewData, Review } from "@repo/types";

async function callApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await authFetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Erreur" }));
    throw new Error(data.message || "Erreur");
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

export class WebBooksApi {
  static async searchBooks(params: BooksSearchParams): Promise<{ data: GoogleBook[] }> {
    const searchParams = new URLSearchParams({
      q: params.q,
      ...(params.page && { page: params.page.toString() }),
      ...(params.limit && { limit: params.limit.toString() }),
    });

    return callApi<{ data: GoogleBook[] }>(`/api/books?${searchParams.toString()}`);
  }

  static async getBook(id: string): Promise<GoogleBook> {
    return callApi<GoogleBook>(`/api/books/${id}`);
  }
}

export class WebReviewsApi {
  static async createReview(data: CreateReviewData): Promise<{ review: Review }> {
    return callApi<{ review: Review }>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
