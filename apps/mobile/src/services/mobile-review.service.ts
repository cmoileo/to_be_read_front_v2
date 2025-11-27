import { HttpInterceptor } from "./http-interceptor.service";

interface ApiReview {
  id: number;
  content: string;
  value: number;
  googleBookId: string;
  authorId: number;
  createdAt: string;
  likesCount: number;
  hasUserLiked: boolean;
  isFromMe: boolean;
  author: {
    id: number;
    userName: string;
    avatarUrl?: string | null;
    avatar?: string | null;
  };
  book: {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      imageLinks?: {
        thumbnail?: string;
      };
    };
  };
}

interface ApiComment {
  id: number;
  content: string;
  createdAt: string;
  authorId: number;
  author: {
    id: number;
    userName: string;
    avatarUrl?: string | null;
    avatar?: string | null;
  };
  likesCount: number;
  hasUserLiked: boolean;
  isFromCurrentUser: boolean;
}

export interface SingleReview {
  id: number;
  content: string;
  value: number;
  googleBookId: string;
  authorId: number;
  likesCount: number;
  isLiked: boolean;
  isFromMe: boolean;
  createdAt: string;
  author: {
    id: number;
    userName: string;
    avatar: string | null;
  };
  book: {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      imageLinks?: {
        thumbnail?: string;
      };
    };
  };
}

export interface SingleComment {
  id: number;
  authorId: number;
  content: string;
  likesCount: number;
  isLiked: boolean;
  isFromCurrentUser: boolean;
  createdAt: string;
  author: {
    id: number;
    userName: string;
    avatar: string | null;
  };
}

function mapApiReviewToReview(apiReview: ApiReview): SingleReview {
  return {
    id: apiReview.id,
    content: apiReview.content,
    value: apiReview.value,
    googleBookId: apiReview.googleBookId,
    authorId: apiReview.authorId,
    likesCount: apiReview.likesCount,
    isLiked: apiReview.hasUserLiked,
    isFromMe: apiReview.isFromMe,
    createdAt: apiReview.createdAt,
    author: {
      id: apiReview.author.id,
      userName: apiReview.author.userName,
      avatar: apiReview.author.avatar || apiReview.author.avatarUrl || null,
    },
    book: apiReview.book,
  };
}

function mapApiCommentToComment(apiComment: ApiComment): SingleComment {
  return {
    id: apiComment.id,
    authorId: apiComment.authorId,
    content: apiComment.content,
    likesCount: apiComment.likesCount ?? 0,
    isLiked: apiComment.hasUserLiked ?? false,
    isFromCurrentUser: apiComment.isFromCurrentUser ?? true,
    createdAt: apiComment.createdAt,
    author: {
      id: apiComment.author.id,
      userName: apiComment.author.userName,
      avatar: apiComment.author.avatar || apiComment.author.avatarUrl || null,
    },
  };
}

export interface CommentsPaginatedResponse {
  data: SingleComment[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

export class MobileReviewService {
  static async getReview(reviewId: number): Promise<SingleReview> {
    const apiReview = await HttpInterceptor.get<ApiReview>(`/review/${reviewId}`);
    return mapApiReviewToReview(apiReview);
  }

  static async getComments(reviewId: number, page: number = 1): Promise<CommentsPaginatedResponse> {
    const response = await HttpInterceptor.get<{
      data: ApiComment[];
      meta: { total: number; perPage: number; currentPage: number; lastPage: number };
    }>(`/comments/${reviewId}/${page}`);

    return {
      data: response.data.map(mapApiCommentToComment),
      meta: response.meta,
    };
  }

  static async createComment(reviewId: number, content: string): Promise<SingleComment> {
    const apiComment = await HttpInterceptor.post<ApiComment>("/comment", {
      reviewId,
      content,
    });
    return mapApiCommentToComment(apiComment);
  }

  static async deleteComment(commentId: number): Promise<void> {
    await HttpInterceptor.delete(`/comment/${commentId}`);
  }

  static async likeComment(commentId: number): Promise<{ isLiked?: boolean; isUnLiked?: boolean }> {
    return HttpInterceptor.get<{ isLiked?: boolean; isUnLiked?: boolean }>(`/comment/${commentId}/like`);
  }

  static async likeReview(reviewId: number): Promise<{ isLiked?: boolean; isUnliked?: boolean }> {
    return HttpInterceptor.get<{ isLiked?: boolean; isUnliked?: boolean }>(`/review/${reviewId}/like`);
  }
}
