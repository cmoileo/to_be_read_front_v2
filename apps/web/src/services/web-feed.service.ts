import type { Review, PaginatedResponse } from "@repo/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function callApi<T>(path: string, init?: RequestInit, accessToken?: string): Promise<T> {
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> || {}),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (!(init?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Erreur" }));
    throw new Error(data.message || "Erreur");
  }

  return res.json();
}

export class WebFeedService {
  static async getFeed(page: number, accessToken: string): Promise<PaginatedResponse<Review>> {
    return callApi<PaginatedResponse<Review>>(`/feed/${page}`, {}, accessToken);
  }

  static async likeReview(reviewId: number, accessToken: string): Promise<{ message: string; isLiked: boolean }> {
    return callApi<{ message: string; isLiked: boolean }>(`/review/${reviewId}/like`, {}, accessToken);
  }
}
