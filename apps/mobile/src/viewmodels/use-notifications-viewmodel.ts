import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";
import type { NotificationItem } from "@repo/types";
import { MobileStorage } from "../services/mobile-storage.service";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const accessToken = await MobileStorage.getAccessToken();
  if (!accessToken) return { "Content-Type": "application/json" };
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
};

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  unreadCount: () => [...notificationKeys.all, "unreadCount"] as const,
};

async function fetchNotifications(page: number) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/notifications?page=${page}&limit=20`, { headers });
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
}

async function fetchUnreadCount() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/notifications/unread-count`, { headers });
  if (!response.ok) throw new Error("Failed to fetch unread count");
  const data = await response.json();
  return data.count;
}

async function markAsRead(notificationId: number) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers,
  });
  return response.ok;
}

async function markAllAsRead() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
    method: "POST",
    headers,
  });
  return response.ok;
}

async function deleteNotification(notificationId: number) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
    method: "DELETE",
    headers,
  });
  return response.ok;
}

export const useNotificationsViewModel = () => {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: notificationKeys.list(),
      queryFn: ({ pageParam = 1 }) => fetchNotifications(pageParam),
      getNextPageParam: (lastPage) => {
        if (lastPage.meta.currentPage < lastPage.meta.lastPage) {
          return lastPage.meta.currentPage + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: fetchUnreadCount,
  });

  const notifications = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.data) as NotificationItem[];
  }, [data]);

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });

      queryClient.setQueryData(notificationKeys.list(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((n: NotificationItem) =>
              n.id === notificationId ? { ...n, isRead: true } : n
            ),
          })),
        };
      });

      queryClient.setQueryData(notificationKeys.unreadCount(), (old: number) =>
        Math.max(0, (old || 0) - 1)
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });

      queryClient.setQueryData(notificationKeys.list(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((n: NotificationItem) => ({ ...n, isRead: true })),
          })),
        };
      });

      queryClient.setQueryData(notificationKeys.unreadCount(), 0);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });

      const notification = notifications.find((n) => n.id === notificationId);

      queryClient.setQueryData(notificationKeys.list(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((n: NotificationItem) => n.id !== notificationId),
          })),
        };
      });

      if (notification && !notification.isRead) {
        queryClient.setQueryData(notificationKeys.unreadCount(), (old: number) =>
          Math.max(0, (old || 0) - 1)
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleMarkAsRead = useCallback(
    (notificationId: number) => {
      markAsReadMutation.mutate(notificationId);
    },
    [markAsReadMutation]
  );

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  const handleDelete = useCallback(
    (notificationId: number) => {
      deleteMutation.mutate(notificationId);
    },
    [deleteMutation]
  );

  return {
    notifications,
    unreadCount,
    isLoading,
    hasMore: hasNextPage ?? false,
    isFetchingMore: isFetchingNextPage,
    handleLoadMore,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    refetch,
  };
};

export const useUnreadNotificationCount = () => {
  const { data: count = 0 } = useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: fetchUnreadCount,
    staleTime: Infinity,
  });

  return count;
};
