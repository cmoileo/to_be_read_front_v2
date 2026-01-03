import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BlocksApi, blockKeys } from "@repo/api-client";
import { HapticsService } from "../services/native";

export const useBlockedUsersViewModel = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: blockKeys.list(),
    queryFn: ({ pageParam = 1 }) => BlocksApi.getBlockedUsers(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.lastPage
        ? lastPage.meta.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });

  const unblockMutation = useMutation({
    mutationFn: (userId: number) => BlocksApi.unblockUser(userId),
    onMutate: () => {
      HapticsService.mediumImpact();
    },
    onSuccess: () => {
      HapticsService.success();
      queryClient.invalidateQueries({ queryKey: blockKeys.list() });
    },
    onError: () => {
      HapticsService.error();
    },
  });

  const blockedUsers = data?.pages.flatMap((page) => page.data) ?? [];

  const handleUnblock = (userId: number) => {
    unblockMutation.mutate(userId);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    blockedUsers,
    isLoading,
    hasMore: !!hasNextPage,
    isFetchingMore: isFetchingNextPage,
    unblockingUserId: unblockMutation.isPending ? unblockMutation.variables : null,
    handleUnblock,
    handleLoadMore,
  };
};
