import type { UserAuthor } from "./user.types";

export interface Comment {
  id: number;
  reviewId: number;
  authorId: string;
  content: string;
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  author: UserAuthor;
}

export interface CreateCommentData {
  reviewId: number;
  content: string;
}
