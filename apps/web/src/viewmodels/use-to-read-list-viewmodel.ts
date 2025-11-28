"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WebToReadListService } from "../services/web-to-read-list.service";
import { useMemo, useCallback } from "react";
import type { ToReadListItem } from "@repo/types";

export const toReadListKeys = {
  all: ["toReadList"] as const,
  list: () => [...toReadListKeys.all, "list"] as const,
  check: (googleBookId: string) => [...toReadListKeys.all, "check", googleBookId] as const,
};

export const useToReadListViewModel = () => {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: toReadListKeys.list(),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toReadListKeys.all });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (googleBookId: string) => WebToReadListService.removeFromReadList(googleBookId),
    onMutate: async (googleBookId: string) => {
      await queryClient.cancelQueries({ queryKey: toReadListKeys.list() });

      const previousData = queryClient.getQueryData(toReadListKeys.list());

      queryClient.setQueryData(toReadListKeys.list(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((item: ToReadListItem) => item.googleBookId !== googleBookId),
          })),
        };
      });

      return { previousData };
    },
    onError: (_err, _googleBookId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(toReadListKeys.list(), context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: toReadListKeys.all });
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
