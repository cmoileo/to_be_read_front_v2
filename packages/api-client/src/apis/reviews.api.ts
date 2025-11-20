import type { Review, CreateReviewData, PaginatedResponse } from "@repo/types";
import { HttpClient } from "../http-client";

export class ReviewsApi {
  static async createReview(data: CreateReviewData): Promise<{ review: Review }> {
    return HttpClient.post<{ review: Review }>("/reviews", data);
  }

  static async getReview(id: number): Promise<{ review: Review }> {
    return HttpClient.get<{ review: Review }>(`/review/${id}`);
  }

  static async deleteReview(id: number): Promise<{ message: string }> {
    return HttpClient.delete<{ message: string }>(`/review/${id}`);
  }

  static async getUserReviews(userId: number, page: number): Promise<PaginatedResponse<Review>> {
    return HttpClient.get<PaginatedResponse<Review>>(`/user/${userId}/reviews/${page}`);
  }

  static async getFeed(page: number): Promise<PaginatedResponse<Review>> {
    return HttpClient.get<PaginatedResponse<Review>>(`/feed/${page}`);
  }

  static async likeReview(id: number): Promise<{ message: string }> {
    return HttpClient.get<{ message: string }>(`/review/${id}/like`);
  }
}
