import { authFetch } from "@/lib/auth-fetch";
import type {
  ToReadListItem,
  AddToReadListResponse,
  RemoveFromReadListResponse,
} from "@repo/types";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
  };
}

export class WebToReadListService {
  static async getToReadList(page: number = 1): Promise<PaginatedResponse<ToReadListItem>> {
    const response = await authFetch(`/api/to-read-list?page=${page}`);
    if (!response.ok) {
      throw new Error("Failed to fetch to-read list");
    }
    return response.json();
  }

  static async addToReadList(googleBookId: string): Promise<AddToReadListResponse> {
    const response = await authFetch(`/api/to-read-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ googleBookId }),
    });
    if (!response.ok) {
      throw new Error("Failed to add book to list");
    }
    return response.json();
  }

  static async removeFromReadList(googleBookId: string): Promise<RemoveFromReadListResponse> {
    const response = await authFetch(`/api/to-read-list`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ googleBookId }),
    });
    if (!response.ok) {
      throw new Error("Failed to remove book from list");
    }
    return response.json();
  }
}
