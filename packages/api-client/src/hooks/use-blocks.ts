import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { BlocksApi } from "../apis/blocks.api";

export const blockKeys = {
  all: ["blocks"] as const,
  list: () => [...blockKeys.all, "list"] as const,
  status: (userId: number) => [...blockKeys.all, "status", userId] as const,
};

export const useBlockedUsers = () => {
  return useInfiniteQuery({
    queryKey: blockKeys.list(),
    queryFn: ({ pageParam = 1 }) => BlocksApi.getBlockedUsers(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.lastPage
        ? lastPage.meta.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });
};

export const useBlockStatus = (userId: number) => {
  return useQuery({
    queryKey: blockKeys.status(userId),
    queryFn: () => BlocksApi.getBlockStatus(userId),
    enabled: !!userId,
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => BlocksApi.blockUser(userId),
    onMutate: async (userId) => {
      // Cancel any outgoing queries
      await queryClient.cancelQueries({ queryKey: ["users", "detail", userId] });
      await queryClient.cancelQueries({ queryKey: blockKeys.status(userId) });

      // Snapshot current state
      const previousUserData = queryClient.getQueryData(["users", "detail", userId]);
      const previousBlockStatus = queryClient.getQueryData(blockKeys.status(userId));

      // Optimistically update block status
      queryClient.setQueryData(blockKeys.status(userId), {
        isBlocked: true,
        hasBlockedMe: false,
      });

      // Optimistically update user profile if cached
      queryClient.setQueryData(["users", "detail", userId], (old: unknown) => {
        if (old && typeof old === "object") {
          return {
            ...old,
            isBlocked: true,
            isFollowing: false,
          };
        }
        return old;
      });

      return { previousUserData, previousBlockStatus };
    },
    onError: (_err, userId, context) => {
      // Rollback on error
      if (context?.previousUserData) {
        queryClient.setQueryData(["users", "detail", userId], context.previousUserData);
      }
      if (context?.previousBlockStatus) {
        queryClient.setQueryData(blockKeys.status(userId), context.previousBlockStatus);
      }
    },
    onSuccess: (_data, userId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["users", "detail", userId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["followList", "followers"] });
      queryClient.invalidateQueries({ queryKey: ["followList", "followings"] });
      queryClient.invalidateQueries({ queryKey: blockKeys.list() });
    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => BlocksApi.unblockUser(userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: blockKeys.status(userId) });
      
      const previousBlockStatus = queryClient.getQueryData(blockKeys.status(userId));

      // Optimistically update
      queryClient.setQueryData(blockKeys.status(userId), {
        isBlocked: false,
        hasBlockedMe: false,
      });

      return { previousBlockStatus };
    },
    onError: (_err, userId, context) => {
      if (context?.previousBlockStatus) {
        queryClient.setQueryData(blockKeys.status(userId), context.previousBlockStatus);
      }
    },
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: ["users", "detail", userId] });
      queryClient.invalidateQueries({ queryKey: blockKeys.list() });
    },
  });
};
