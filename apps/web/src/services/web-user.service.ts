import type { User, Review, PaginatedResponse } from "@repo/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface ApiUser {
  id: number;
  userName: string;
  avatar: string | null;
  avatarUrl: string | null;
  biography: string | null;
  followersCount: number;
  followingCount: number;
  reviewsCount: number;
  isFollowing: boolean;
  isMe: boolean;
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
  // Use the computed 'avatar' field from backend which contains the full URL
  return {
    id: apiUser.id,
    userName: apiUser.userName,
    avatar: apiUser.avatar,
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

async function callApi<T>(path: string, init?: RequestInit, accessToken?: string): Promise<T> {
  const headers: Record<string, string> = {
    ...((init?.headers as Record<string, string>) || {}),
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

export class WebUserService {
  static async getUser(userId: number, accessToken: string): Promise<User> {
    const apiUser = await callApi<ApiUser>(`/user/${userId}`, {}, accessToken);
    return mapApiUserToUser(apiUser);
  }

  static async getUserReviews(
    userId: number,
    page: number,
    accessToken: string
  ): Promise<PaginatedResponse<Review>> {
    return callApi<PaginatedResponse<Review>>(`/user/${userId}/reviews/${page}`, {}, accessToken);
  }

  static async followUser(userId: number, accessToken: string): Promise<{ message: string }> {
    return callApi<{ message: string }>(`/user/${userId}/follow`, {}, accessToken);
  }

  static async unfollowUser(userId: number, accessToken: string): Promise<{ message: string }> {
    return callApi<{ message: string }>(`/user/${userId}/unfollow`, {}, accessToken);
  }

  static async getFollowers(
    userId: number,
    page: number,
    accessToken: string
  ): Promise<PaginatedResponse<FollowUser>> {
    const response = await callApi<PaginatedResponse<ApiFollowUser>>(
      `/followers/${userId}/${page}`,
      {},
      accessToken
    );
    return {
      ...response,
      data: response.data.map(mapApiFollowUserToFollowUser),
    };
  }

  static async getFollowings(
    userId: number,
    page: number,
    accessToken: string
  ): Promise<PaginatedResponse<FollowUser>> {
    const response = await callApi<PaginatedResponse<ApiFollowUser>>(
      `/followings/${userId}/${page}`,
      {},
      accessToken
    );
    return {
      ...response,
      data: response.data.map(mapApiFollowUserToFollowUser),
    };
  }
}
