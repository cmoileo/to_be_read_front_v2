import type { User, Review, PaginatedResponse } from "@repo/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Convert review value from backend (10) to front (5 stars)
function mapReviewValue<T extends { value: number }>(review: T): T {
  return {
    ...review,
    value: review.value / 2,
  };
}

export interface UpdateProfileData {
  userName?: string;
  biography?: string;
  locale?: "en" | "fr";
  theme?: "light" | "dark" | "system";
  avatar?: File;
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

export class WebProfileService {
  static async getMyProfile(accessToken: string): Promise<{ user: User }> {
    return callApi<{ user: User }>("/me", {}, accessToken);
  }

  static async getProfile(userId: number, accessToken: string): Promise<{ user: User }> {
    return callApi<{ user: User }>(`/user/${userId}`, {}, accessToken);
  }

  static async updateProfile(data: UpdateProfileData, accessToken: string): Promise<{ user: User }> {
    const formData = new FormData();
    
    if (data.userName !== undefined) {
      formData.append("userName", data.userName);
    }
    if (data.biography !== undefined) {
      formData.append("biography", data.biography);
    }
    if (data.locale !== undefined) {
      formData.append("locale", data.locale);
    }
    if (data.theme !== undefined) {
      formData.append("theme", data.theme);
    }
    if (data.avatar !== undefined) {
      formData.append("avatar", data.avatar);
    }

    return callApi<{ user: User }>("/me", {
      method: "PUT",
      body: formData,
    }, accessToken);
  }

  static async getMyReviews(page: number, accessToken: string): Promise<PaginatedResponse<Review>> {
    const response = await callApi<PaginatedResponse<Review>>(`/my-reviews/${page}`, {}, accessToken);
    return {
      ...response,
      data: response.data.map(mapReviewValue),
    };
  }

  static async getUserReviews(userId: number, page: number, accessToken: string): Promise<PaginatedResponse<Review>> {
    const response = await callApi<PaginatedResponse<Review>>(`/user/${userId}/reviews/${page}`, {}, accessToken);
    return {
      ...response,
      data: response.data.map(mapReviewValue),
    };
  }

  static async deleteReview(reviewId: number, accessToken: string): Promise<void> {
    await callApi<void>(`/review/${reviewId}`, {
      method: "DELETE",
    }, accessToken);
  }
}
