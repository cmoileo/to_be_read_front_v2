import type { User, Review, PaginatedResponse } from "@repo/types";
import { HttpInterceptor } from "./http-interceptor.service";

export interface UpdateProfileData {
  userName?: string;
  biography?: string;
  locale?: "en" | "fr";
  avatar?: File | null;
}

export class MobileProfileService {
  static async getMyProfile(): Promise<{ user: User }> {
    return HttpInterceptor.get<{ user: User }>("/me");
  }

  static async getProfile(userId: number): Promise<{ user: User }> {
    return HttpInterceptor.get<{ user: User }>(`/user/${userId}`);
  }

  static async updateProfile(data: UpdateProfileData): Promise<{ user: User }> {
    const formData = new FormData();
    
    if (data.userName) {
      formData.append("userName", data.userName);
    }
    if (data.biography !== undefined) {
      formData.append("biography", data.biography);
    }
    if (data.locale) {
      formData.append("locale", data.locale);
    }
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    return HttpInterceptor.put<{ user: User }>("/me", formData);
  }

  static async getMyReviews(page: number = 1): Promise<PaginatedResponse<Review>> {
    return HttpInterceptor.get<PaginatedResponse<Review>>(`/my-reviews/${page}`);
  }

  static async getUserReviews(userId: number, page: number = 1): Promise<PaginatedResponse<Review>> {
    return HttpInterceptor.get<PaginatedResponse<Review>>(`/user/${userId}/reviews/${page}`);
  }
}
