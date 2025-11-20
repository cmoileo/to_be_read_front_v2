import type { UserAuthor } from "./user.types";
import type { GoogleBook } from "./book.types";

export interface Review {
  id: number;
  content: string;
  value: number;
  googleBookId: string;
  authorId: number;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  author: UserAuthor;
  book: GoogleBook;
}

export interface CreateReviewData {
  content: string;
  value: number;
  googleBookId: string;
}
