import type { Comment, CreateCommentData, PaginatedResponse } from "@repo/types";
import { HttpClient } from "../http-client";

export class CommentsApi {
  static async createComment(data: CreateCommentData): Promise<{ comment: Comment }> {
    return HttpClient.post<{ comment: Comment }>("/comment", data);
  }

  static async getComments(reviewId: number, page: number): Promise<PaginatedResponse<Comment>> {
    return HttpClient.get<PaginatedResponse<Comment>>(`/comments/${reviewId}/${page}`);
  }

  static async deleteComment(id: number): Promise<{ message: string }> {
    return HttpClient.delete<{ message: string }>(`/comment/${id}`);
  }

  static async likeComment(id: number): Promise<{ message: string }> {
    return HttpClient.get<{ message: string }>(`/comment/${id}/like`);
  }
}
