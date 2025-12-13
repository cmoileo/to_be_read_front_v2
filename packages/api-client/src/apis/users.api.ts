import type { User, PaginatedResponse, FollowRequestPaginated, FollowRequest, FollowResponse } from "@repo/types";
import { HttpClient } from "../http-client";

export class UsersApi {
  static async getUser(id: number): Promise<{ user: User }> {
    return HttpClient.get<{ user: User }>(`/user/${id}`);
  }

  static async searchUsers(query: string, page: number): Promise<PaginatedResponse<User>> {
    return HttpClient.get<PaginatedResponse<User>>(`/search/users/${query}/${page}`);
  }

  static async followUser(id: number): Promise<FollowResponse> {
    return HttpClient.get<FollowResponse>(`/follow/${id}`);
  }

  static async unfollowUser(id: number): Promise<{ message: string }> {
    return HttpClient.get<{ message: string }>(`/unfollow/${id}`);
  }

  static async getFollowers(userId: number, page: number): Promise<PaginatedResponse<User>> {
    return HttpClient.get<PaginatedResponse<User>>(`/followers/${userId}/${page}`);
  }

  static async getFollowings(userId: number, page: number): Promise<PaginatedResponse<User>> {
    return HttpClient.get<PaginatedResponse<User>>(`/followings/${userId}/${page}`);
  }

  static async getPendingFollowRequests(page: number): Promise<FollowRequestPaginated> {
    return HttpClient.get<FollowRequestPaginated>(`/follow-requests/${page}`);
  }

  static async acceptFollowRequest(requestId: number): Promise<{ request: FollowRequest }> {
    return HttpClient.post<{ request: FollowRequest }>(`/follow-request/${requestId}/accept`, {});
  }

  static async rejectFollowRequest(requestId: number): Promise<{ request: FollowRequest }> {
    return HttpClient.post<{ request: FollowRequest }>(`/follow-request/${requestId}/reject`, {});
  }

  static async cancelFollowRequest(userId: number): Promise<{ message: string }> {
    return HttpClient.delete<{ message: string }>(`/user/${userId}/cancel-follow-request`);
  }
}
