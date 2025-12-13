import type { QueryClient } from "@tanstack/react-query";
import type { ToReadListItem } from "@repo/types";
import { queryKeys } from "./keys/query-keys";

export const toReadListKeys = queryKeys.toReadList;

export const getBookIdsInList = (queryClient: QueryClient): Set<string> => {
  return queryClient.getQueryData<Set<string>>(toReadListKeys.bookIds()) ?? new Set();
};

export const setBookIdsInList = (queryClient: QueryClient, bookIds: Set<string>) => {
  queryClient.setQueryData(toReadListKeys.bookIds(), bookIds);
};

export const isBookInListCache = (queryClient: QueryClient, bookId: string): boolean => {
  return getBookIdsInList(queryClient).has(bookId);
};

export const initializeBookIdsFromList = (
  queryClient: QueryClient,
  items: ToReadListItem[]
) => {
  const bookIds = new Set(items.map((item) => item.googleBookId));
  setBookIdsInList(queryClient, bookIds);
};

export const addBookToListCache = (
  queryClient: QueryClient,
  bookId: string
): { previousBookIds: Set<string> } => {
  const previousBookIds = new Set(getBookIdsInList(queryClient));

  queryClient.setQueryData<Set<string>>(toReadListKeys.bookIds(), (old) => {
    const newSet = new Set(old);
    newSet.add(bookId);
    return newSet;
  });

  queryClient.setQueryData(queryKeys.books.isInList(bookId), true);

  return { previousBookIds };
};

export const removeBookFromListCache = (
  queryClient: QueryClient,
  bookId: string
): { previousBookIds: Set<string>; previousListData: any } => {
  const previousBookIds = new Set(getBookIdsInList(queryClient));
  const previousListData = queryClient.getQueryData(toReadListKeys.list());

  queryClient.setQueryData<Set<string>>(toReadListKeys.bookIds(), (old) => {
    const newSet = new Set(old);
    newSet.delete(bookId);
    return newSet;
  });

  queryClient.setQueryData(toReadListKeys.list(), (old: any) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: page.data.filter((item: ToReadListItem) => item.googleBookId !== bookId),
      })),
    };
  });

  queryClient.setQueryData(queryKeys.books.isInList(bookId), false);

  return { previousBookIds, previousListData };
};

export const rollbackAddBook = (
  queryClient: QueryClient,
  bookId: string,
  previousBookIds: Set<string>
) => {
  setBookIdsInList(queryClient, previousBookIds);
  queryClient.setQueryData(queryKeys.books.isInList(bookId), false);
};

export const rollbackRemoveBook = (
  queryClient: QueryClient,
  bookId: string,
  previousBookIds: Set<string>,
  previousListData: any
) => {
  setBookIdsInList(queryClient, previousBookIds);
  if (previousListData) {
    queryClient.setQueryData(toReadListKeys.list(), previousListData);
  }
  queryClient.setQueryData(queryKeys.books.isInList(bookId), true);
};

export const invalidateToReadList = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: toReadListKeys.all });
};
