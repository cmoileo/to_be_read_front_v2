import type { GoogleBook, BooksSearchParams } from "@repo/types";
import { HttpClient } from "../http-client";

export class BooksApi {
  static async searchBooks(params: BooksSearchParams): Promise<{ data: GoogleBook[] }> {
    const searchParams = new URLSearchParams({
      q: params.q,
      ...(params.page && { page: params.page.toString() }),
      ...(params.limit && { limit: params.limit.toString() }),
    });

    return HttpClient.get<{ data: GoogleBook[] }>(`/books?${searchParams.toString()}`);
  }

  static async getBook(id: string): Promise<GoogleBook> {
    return HttpClient.get<GoogleBook>(`/book/${id}`);
  }
}
