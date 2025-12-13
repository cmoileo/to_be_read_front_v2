"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WebToReadListService } from "../services/web-to-read-list.service";
import { useMemo, useCallback } from "react";
import type { ToReadListItem } from "@repo/types";
import { queryKeys, addBookToListCache, removeBookFromListCache } from "@repo/stores";

export const useToReadListViewModel = () => {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: queryKeys.toReadList.list(),
      queryFn: ({ pageParam = 1 }) => WebToReadListService.getToReadList(pageParam),
      getNextPageParam: (lastPage) => {
        if (lastPage.meta.currentPage < lastPage.meta.lastPage) {
          return lastPage.meta.currentPage + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  const items = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const bookIdsInList = useMemo(() => {
    return new Set(items.map((item) => item.googleBookId));
  }, [items]);

  const addMutation = useMutation({
    mutationFn: (googleBookId: string) => WebToReadListService.addToReadList(googleBookId),
    onMutate: async (googleBookId: string) => {
      addBookToListCache(queryClient, googleBookId);
    },
    onError: (_err, googleBookId) => {
      removeBookFromListCache(queryClient, googleBookId);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (googleBookId: string) => WebToReadListService.removeFromReadList(googleBookId),
    onMutate: async (googleBookId: string) => {
      removeBookFromListCache(queryClient, googleBookId);
      return { googleBookId };
    },
    onError: (_err, googleBookId) => {
      addBookToListCache(queryClient, googleBookId);
    },
  });

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleAddToList = useCallback(
    (googleBookId: string) => {
      return addMutation.mutateAsync(googleBookId);
    },
    [addMutation]
  );

  const handleRemoveFromList = useCallback(
    (googleBookId: string) => {
      return removeMutation.mutateAsync(googleBookId);
    },
    [removeMutation]
  );

  const isInList = useCallback(
    (googleBookId: string) => {
      return bookIdsInList.has(googleBookId);
    },
    [bookIdsInList]
  );

  return {
    items,
    isLoading,
    hasMore: hasNextPage ?? false,
    isFetchingMore: isFetchingNextPage,
    handleLoadMore,
    handleAddToList,
    handleRemoveFromList,
    isInList,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    refetch,
  };
};
