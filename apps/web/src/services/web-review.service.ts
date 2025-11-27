const API_URL = process.env.NEXT_PUBLIC_API_URL!;

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

export interface CommentsPaginatedResponse {
  data: SingleComment[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
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

async function callApi<T>(path: string, init?: RequestInit, accessToken?: string): Promise<T> {
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> || {}),
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

export class WebReviewService {
  static async getReview(reviewId: number, accessToken: string): Promise<SingleReview> {
    const apiReview = await callApi<ApiReview>(`/review/${reviewId}`, {}, accessToken);
    return mapApiReviewToReview(apiReview);
  }

  static async getComments(reviewId: number, page: number, accessToken: string): Promise<CommentsPaginatedResponse> {
    const response = await callApi<{
      data: ApiComment[];
      meta: { total: number; perPage: number; currentPage: number; lastPage: number };
    }>(`/comments/${reviewId}/${page}`, {}, accessToken);

    return {
      data: response.data.map(mapApiCommentToComment),
      meta: response.meta,
    };
  }

  static async createComment(reviewId: number, content: string, accessToken: string): Promise<SingleComment> {
    const apiComment = await callApi<ApiComment>("/comment", {
      method: "POST",
      body: JSON.stringify({ reviewId, content }),
    }, accessToken);
    return mapApiCommentToComment(apiComment);
  }

  static async deleteComment(commentId: number, accessToken: string): Promise<void> {
    await callApi(`/comment/${commentId}`, { method: "DELETE" }, accessToken);
  }

  static async likeComment(commentId: number, accessToken: string): Promise<{ isLiked?: boolean; isUnLiked?: boolean }> {
    return callApi<{ isLiked?: boolean; isUnLiked?: boolean }>(`/comment/${commentId}/like`, {}, accessToken);
  }

  static async likeReview(reviewId: number, accessToken: string): Promise<{ isLiked?: boolean; isUnliked?: boolean }> {
    return callApi<{ isLiked?: boolean; isUnliked?: boolean }>(`/review/${reviewId}/like`, {}, accessToken);
  }
}
