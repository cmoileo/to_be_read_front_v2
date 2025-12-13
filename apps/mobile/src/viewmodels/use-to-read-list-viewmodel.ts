import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileToReadListService } from "../services/mobile-to-read-list.service";
import { useMemo, useCallback, useEffect } from "react";
import {
  queryKeys,
  addBookToListCache,
  removeBookFromListCache,
  rollbackAddBook,
  rollbackRemoveBook,
  initializeBookIdsFromList,
  isBookInListCache,
} from "@repo/stores";

export const useToReadListViewModel = () => {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: queryKeys.toReadList.list(),
      queryFn: ({ pageParam = 1 }) => MobileToReadListService.getToReadList(pageParam),
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

  useEffect(() => {
    if (items.length > 0) {
      initializeBookIdsFromList(queryClient, items);
    }
  }, [items, queryClient]);

  const addMutation = useMutation({
    mutationFn: (googleBookId: string) => MobileToReadListService.addToReadList(googleBookId),
    onMutate: async (googleBookId: string) => {
      const { previousBookIds } = addBookToListCache(queryClient, googleBookId);
      return { previousBookIds, googleBookId };
    },
    onError: (_err, googleBookId, context) => {
      if (context?.previousBookIds) {
        rollbackAddBook(queryClient, googleBookId, context.previousBookIds);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.toReadList.all });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (googleBookId: string) => MobileToReadListService.removeFromReadList(googleBookId),
    onMutate: async (googleBookId: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.toReadList.list() });
      const { previousBookIds, previousListData } = removeBookFromListCache(queryClient, googleBookId);
      return { previousBookIds, previousListData, googleBookId };
    },
    onError: (_err, googleBookId, context) => {
      if (context?.previousBookIds && context?.previousListData) {
        rollbackRemoveBook(queryClient, googleBookId, context.previousBookIds, context.previousListData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.toReadList.all });
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
      return isBookInListCache(queryClient, googleBookId);
    },
    [queryClient]
  );

  return {
    items,
    isLoading,
    hasMore: hasNextPage ?? false,
    isFetchingMore: isFetchingNextPage,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    handleLoadMore,
    handleAddToList,
    handleRemoveFromList,
    isInList,
    refetch,
  };
};
