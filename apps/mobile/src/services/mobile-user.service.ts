import type { User, Review, PaginatedResponse, FollowResponse } from "@repo/types";
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
  isPrivate?: boolean;
  followRequestStatus?: "none" | "pending" | "accepted" | "rejected";
  isBlocked?: boolean;
  hasBlockedMe?: boolean;
  createdAt: string;
}

interface ApiFollowUser {
  id: number;
  userName: string;
  avatar?: string | null;
  avatarUrl?: string | null;
  biography: string | null;
  isFollowing: boolean;
  isMe: boolean;
}

export interface FollowUser {
  id: number;
  userName: string;
  avatar: string | null;
  biography: string | null;
  isFollowing: boolean;
  isMe: boolean;
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
    isPrivate: apiUser.isPrivate,
    followRequestStatus: apiUser.followRequestStatus,
    isBlocked: apiUser.isBlocked,
    hasBlockedMe: apiUser.hasBlockedMe,
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.createdAt,
  };
}

function mapApiFollowUserToFollowUser(apiUser: ApiFollowUser): FollowUser {
  return {
    id: apiUser.id,
    userName: apiUser.userName,
    avatar: apiUser.avatar || apiUser.avatarUrl || null,
    biography: apiUser.biography,
    isFollowing: apiUser.isFollowing,
    isMe: apiUser.isMe,
  };
}

export class MobileUserService {
  static async getUser(userId: number): Promise<User> {
    const apiUser = await HttpInterceptor.get<ApiUser>(`/user/${userId}`);
    return mapApiUserToUser(apiUser);
  }

  static async getUserReviews(
    userId: number,
    page: number = 1
  ): Promise<PaginatedResponse<Review>> {
    return HttpInterceptor.get<PaginatedResponse<Review>>(`/user/${userId}/reviews/${page}`);
  }

  static async followUser(userId: number): Promise<FollowResponse> {
    return HttpInterceptor.get<FollowResponse>(`/user/${userId}/follow`);
  }

  static async unfollowUser(userId: number): Promise<{ message: string }> {
    return HttpInterceptor.get<{ message: string }>(`/user/${userId}/unfollow`);
  }

  static async cancelFollowRequest(userId: number): Promise<{ message: string }> {
    return HttpInterceptor.delete<{ message: string }>(`/user/${userId}/cancel-follow-request`);
  }

  static async getFollowers(
    userId: number,
    page: number = 1
  ): Promise<PaginatedResponse<FollowUser>> {
    const response = await HttpInterceptor.get<PaginatedResponse<ApiFollowUser>>(
      `/followers/${userId}/${page}`
    );
    return {
      ...response,
      data: response.data.map(mapApiFollowUserToFollowUser),
    };
  }

  static async getFollowings(
    userId: number,
    page: number = 1
  ): Promise<PaginatedResponse<FollowUser>> {
    const response = await HttpInterceptor.get<PaginatedResponse<ApiFollowUser>>(
      `/followings/${userId}/${page}`
    );
    return {
      ...response,
      data: response.data.map(mapApiFollowUserToFollowUser),
    };
  }
}
