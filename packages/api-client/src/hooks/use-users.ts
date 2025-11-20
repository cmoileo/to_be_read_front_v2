import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { UsersApi } from "../apis/users.api";

export const userKeys = {
  all: ["users"] as const,
  detail: (id: number) => [...userKeys.all, "detail", id] as const,
  search: (query: string) => [...userKeys.all, "search", query] as const,
  followers: (userId: number) => [...userKeys.all, "followers", userId] as const,
  followings: (userId: number) => [...userKeys.all, "followings", userId] as const,
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await UsersApi.getUser(id);
      return response.user;
    },
  });
};

export const useSearchUsers = (query: string) => {
  return useInfiniteQuery({
    queryKey: userKeys.search(query),
    queryFn: ({ pageParam = 1 }) => UsersApi.searchUsers(query, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.lastPage
        ? lastPage.meta.currentPage + 1
        : undefined,
    initialPageParam: 1,
    enabled: query.length >= 2,
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => UsersApi.followUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => UsersApi.unfollowUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};

export const useFollowers = (userId: number) => {
  return useInfiniteQuery({
    queryKey: userKeys.followers(userId),
    queryFn: ({ pageParam = 1 }) => UsersApi.getFollowers(userId, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.lastPage
        ? lastPage.meta.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });
};

export const useFollowings = (userId: number) => {
  return useInfiniteQuery({
    queryKey: userKeys.followings(userId),
    queryFn: ({ pageParam = 1 }) => UsersApi.getFollowings(userId, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.lastPage
        ? lastPage.meta.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });
};
