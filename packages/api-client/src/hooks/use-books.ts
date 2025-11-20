import { useQuery } from "@tanstack/react-query";
import type { BooksSearchParams } from "@repo/types";
import { BooksApi } from "../apis/books.api";

export const bookKeys = {
  all: ["books"] as const,
  search: (params: BooksSearchParams) => [...bookKeys.all, "search", params] as const,
  detail: (id: string) => [...bookKeys.all, "detail", id] as const,
};

export const useSearchBooks = (params: BooksSearchParams) => {
  return useQuery({
    queryKey: bookKeys.search(params),
    queryFn: () => BooksApi.searchBooks(params),
    enabled: params.q.length >= 2,
  });
};

export const useBook = (id: string) => {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => BooksApi.getBook(id),
  });
};
