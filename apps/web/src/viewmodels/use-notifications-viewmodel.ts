import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";
import type { NotificationItem } from "@repo/types";
import {
  queryKeys,
  markNotificationAsReadInCache,
  markAllNotificationsAsReadInCache,
  removeNotificationFromCache,
  updateFollowersCount,
} from "@repo/stores";

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

async function acceptFollowRequest(requestId: number) {
  const response = await fetch(`/api/follow-request/${requestId}/accept`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to accept follow request");
  return response.json();
}

async function rejectFollowRequest(requestId: number) {
  const response = await fetch(`/api/follow-request/${requestId}/reject`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to reject follow request");
  return response.json();
}

export const useNotificationsViewModel = () => {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: queryKeys.notifications.list(),
      queryFn: ({ pageParam = 1 }) => fetchNotifications(pageParam),
      getNextPageParam: (lastPage) => {
        if (lastPage.meta.currentPage < lastPage.meta.lastPage) {
          return lastPage.meta.currentPage + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
      staleTime: 30000,
    });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: fetchUnreadCount,
    staleTime: 30000,
  });

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
      markNotificationAsReadInCache(queryClient, notificationId);
    },
    onSuccess: () => {
      window.dispatchEvent(new CustomEvent("notification-read"));
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onMutate: async () => {
      markAllNotificationsAsReadInCache(queryClient);
    },
    onSuccess: () => {
      window.dispatchEvent(new CustomEvent("notifications-all-read"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onMutate: async (notificationId: number) => {
      const notification = notifications.find((n) => n.id === notificationId);
      removeNotificationFromCache(queryClient, notificationId, notification?.isRead === false);
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

  const acceptFollowRequestMutation = useMutation({
    mutationFn: acceptFollowRequest,
    onMutate: async () => {
      updateFollowersCount(queryClient, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
    onError: () => {
      updateFollowersCount(queryClient, -1);
    },
  });

  const rejectFollowRequestMutation = useMutation({
    mutationFn: rejectFollowRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  const handleAcceptFollowRequest = useCallback(
    (requestId: number) => {
      acceptFollowRequestMutation.mutate(requestId);
    },
    [acceptFollowRequestMutation]
  );

  const handleRejectFollowRequest = useCallback(
    (requestId: number) => {
      rejectFollowRequestMutation.mutate(requestId);
    },
    [rejectFollowRequestMutation]
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
    handleAcceptFollowRequest,
    handleRejectFollowRequest,
    refetch,
  };
};

export const useUnreadNotificationCount = () => {
  const { data: count = 0 } = useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: fetchUnreadCount,
    refetchInterval: 30000,
  });

  return count;
};
