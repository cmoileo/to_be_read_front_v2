import type { BlockedUser, BlockResponse, BlockStatusResponse, PaginatedResponse } from "@repo/types";
import { HttpClient } from "../http-client";

export class BlocksApi {
  /**
   * Get list of blocked users
   */
  static async getBlockedUsers(page: number = 1): Promise<PaginatedResponse<BlockedUser>> {
    return HttpClient.get<PaginatedResponse<BlockedUser>>(`/blocks/${page}`);
  }

  /**
   * Block a user
   */
  static async blockUser(userId: number): Promise<BlockResponse> {
    return HttpClient.post<BlockResponse>(`/block/${userId}`, {});
  }

  /**
   * Unblock a user
   */
  static async unblockUser(userId: number): Promise<BlockResponse> {
    return HttpClient.delete<BlockResponse>(`/block/${userId}`);
  }

  /**
   * Get block status between current user and target user
   */
  static async getBlockStatus(userId: number): Promise<BlockStatusResponse> {
    return HttpClient.get<BlockStatusResponse>(`/block/${userId}/status`);
  }
}
