import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useCallback, useEffect } from "react";
import type { NotificationItem } from "@repo/types";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  unreadCount: () => [...notificationKeys.all, "unreadCount"] as const,
};

async function fetchNotifications(page: number) {
  const response = await fetch(`/api/notifications?page=${page}&limit=20`);
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
}

async function fetchUnreadCount() {
  const response = await fetch(`/api/notifications/unread-count`);
  if (!response.ok) throw new Error("Failed to fetch unread count");
  const data = await response.json();
  return data.count;
}

async function markAsRead(notificationId: number) {
  const response = await fetch(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
  return response.ok;
}

async function markAllAsRead() {
  const response = await fetch(`/api/notifications/mark-all-read`, {
    method: "POST",
  });
  return response.ok;
}

async function deleteNotification(notificationId: number) {
  const response = await fetch(`/api/notifications/${notificationId}`, {
    method: "DELETE",
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
      staleTime: 0,
      refetchOnMount: "always",
    });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: fetchUnreadCount,
    staleTime: 0,
    refetchOnMount: "always",
  });

  useEffect(() => {
    refetch();
  }, []);

  const notifications = useMemo(() => {
    if (!data) return [];
    const allNotifications = data.pages.flatMap((page) => page.data) as NotificationItem[];
    const uniqueMap = new Map<number, NotificationItem>();
    allNotifications.forEach((n) => uniqueMap.set(n.id, n));
    return Array.from(uniqueMap.values());
  }, [data]);

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
      await queryClient.cancelQueries({ queryKey: notificationKeys.unreadCount() });

      const previousList = queryClient.getQueryData(notificationKeys.list());
      const previousCount = queryClient.getQueryData(notificationKeys.unreadCount());

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

      return { previousList, previousCount };
    },
    onError: (_err, _notificationId, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(notificationKeys.list(), context.previousList);
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(notificationKeys.unreadCount(), context.previousCount);
      }
    },
    onSuccess: () => {
      window.dispatchEvent(new CustomEvent("notification-read"));
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
      await queryClient.cancelQueries({ queryKey: notificationKeys.unreadCount() });

      const previousList = queryClient.getQueryData(notificationKeys.list());
      const previousCount = queryClient.getQueryData(notificationKeys.unreadCount());

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

      return { previousList, previousCount };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(notificationKeys.list(), context.previousList);
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(notificationKeys.unreadCount(), context.previousCount);
      }
    },
    onSuccess: () => {
      window.dispatchEvent(new CustomEvent("notifications-all-read"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
      await queryClient.cancelQueries({ queryKey: notificationKeys.unreadCount() });

      const previousList = queryClient.getQueryData(notificationKeys.list());
      const previousCount = queryClient.getQueryData(notificationKeys.unreadCount());
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

      return { previousList, previousCount };
    },
    onError: (_err, _notificationId, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(notificationKeys.list(), context.previousList);
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(notificationKeys.unreadCount(), context.previousCount);
      }
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
    refetchInterval: 30000,
  });

  return count;
};
