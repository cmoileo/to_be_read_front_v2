const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface ApiReviewAuthor {
  id: number;
  userName: string;
  avatarUrl?: string | null;
  avatar?: string | null;
}

interface ApiBookReview {
  id: number;
  content: string;
  value: number;
  googleBookId: string;
  authorId: number;
  createdAt: string;
  author: ApiReviewAuthor;
  likesCount: number;
  commentsCount: number;
  hasUserLiked: boolean;
  isFromMe: boolean;
}

export interface BookReview {
  id: number;
  content: string;
  value: number;
  googleBookId: string;
  authorId: number;
  createdAt: string;
  author: {
    id: number;
    userName: string;
    avatar: string | null;
  };
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isFromMe: boolean;
}

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    language?: string;
    imageLinks?: {
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

export interface BookReviewsPaginatedResponse {
  data: BookReview[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

function mapApiReviewToBookReview(apiReview: ApiBookReview): BookReview {
  return {
    id: apiReview.id,
    content: apiReview.content,
    value: apiReview.value,
    googleBookId: apiReview.googleBookId,
    authorId: apiReview.authorId,
    createdAt: apiReview.createdAt,
    author: {
      id: apiReview.author.id,
      userName: apiReview.author.userName,
      avatar: apiReview.author.avatar || apiReview.author.avatarUrl || null,
    },
    likesCount: Number(apiReview.likesCount) || 0,
    commentsCount: Number(apiReview.commentsCount) || 0,
    isLiked: apiReview.hasUserLiked ?? false,
    isFromMe: apiReview.isFromMe ?? false,
  };
}

async function callApi<T>(path: string, accessToken?: string): Promise<T> {
  const headers: Record<string, string> = {};

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Error" }));
    throw new Error(data.message || "Error");
  }

  return res.json();
}

export class WebBookService {
  static async getBook(googleBookId: string): Promise<GoogleBook> {
    return callApi<GoogleBook>(`/book/${googleBookId}`);
  }

  static async getBookReviews(
    googleBookId: string,
    page: number = 1,
    accessToken?: string
  ): Promise<BookReviewsPaginatedResponse> {
    const response = await callApi<{
      data: ApiBookReview[];
      meta: { total: number; perPage: number; currentPage: number; lastPage: number };
    }>(`/book/${googleBookId}/reviews/${page}`, accessToken);

    return {
      data: response.data.map(mapApiReviewToBookReview),
      meta: response.meta,
    };
  }
}
