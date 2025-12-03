import type { Review, PaginatedResponse } from "@repo/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Convert review value from backend (10) to front (5 stars)
function mapReviewValue<T extends { value: number }>(review: T): T {
  return {
    ...review,
    value: review.value / 2,
  };
}

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
    const response = await callApi<PaginatedResponse<Review>>(`/feed/${page}`, {}, accessToken);
    return {
      ...response,
      data: response.data.map(mapReviewValue),
    };
  }

  static async likeReview(reviewId: number, accessToken: string): Promise<{ message: string; isLiked: boolean }> {
    return callApi<{ message: string; isLiked: boolean }>(`/review/${reviewId}/like`, {}, accessToken);
  }
}
