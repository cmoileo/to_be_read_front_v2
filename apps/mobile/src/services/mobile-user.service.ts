import type { User, Review, PaginatedResponse } from "@repo/types";
import { HttpInterceptor } from "./http-interceptor.service";

interface ApiUser {
  id: number;
  userName: string;
  avatarUrl: string | null;
  biography: string | null;
  followersCount: number;
  followingCount: number;
  reviewsCount: number;
  isFollowing: boolean;
  isMe: boolean;
  createdAt: string;
}

function mapApiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    userName: apiUser.userName,
    avatar: apiUser.avatarUrl,
    biography: apiUser.biography,
    followersCount: apiUser.followersCount,
    followingCount: apiUser.followingCount,
    reviewsCount: apiUser.reviewsCount,
    isFollowing: apiUser.isFollowing,
    isMe: apiUser.isMe,
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.createdAt,
  };
}

export class MobileUserService {
  static async getUser(userId: number): Promise<User> {
    const apiUser = await HttpInterceptor.get<ApiUser>(`/user/${userId}`);
    return mapApiUserToUser(apiUser);
  }

  static async getUserReviews(userId: number, page: number = 1): Promise<PaginatedResponse<Review>> {
    return HttpInterceptor.get<PaginatedResponse<Review>>(`/user/${userId}/reviews/${page}`);
  }

  static async followUser(userId: number): Promise<{ message: string }> {
    return HttpInterceptor.get<{ message: string }>(`/user/${userId}/follow`);
  }

  static async unfollowUser(userId: number): Promise<{ message: string }> {
    return HttpInterceptor.get<{ message: string }>(`/user/${userId}/unfollow`);
  }
}
