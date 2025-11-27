import type { Review, PaginatedResponse } from "@repo/types";
import { HttpInterceptor } from "./http-interceptor.service";

export class MobileFeedService {
  static async getFeed(page: number = 1): Promise<PaginatedResponse<Review>> {
    return HttpInterceptor.get<PaginatedResponse<Review>>(`/feed/${page}`);
  }

  static async likeReview(reviewId: number): Promise<{ message: string; isLiked: boolean }> {
    return HttpInterceptor.get<{ message: string; isLiked: boolean }>(`/review/${reviewId}/like`);
  }
}
