import type { GoogleBook } from "./book.types";

export interface ToReadListItem {
  id: number;
  googleBookId: string;
  createdAt: string;
  book: GoogleBook;
}

export interface AddToReadListRequest {
  googleBookId: string;
}

export interface AddToReadListResponse {
  status: string;
  code: string;
  message: string;
  item: {
    id: number;
    userId: number;
    googleBookId: string;
    createdAt: string;
  };
}

export interface RemoveFromReadListResponse {
  status: string;
  code: string;
  message: string;
}
