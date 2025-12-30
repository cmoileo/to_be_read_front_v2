import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";
import { MobileStorage } from "../services/mobile-storage.service";
import { queryKeys, markNotificationAsReadInCache, markAllNotificationsAsReadInCache, removeNotificationFromCache, updateFollowersCount, } from "@repo/stores";
export const notificationKeys = queryKeys.notifications;
const API_URL = import.meta.env.VITE_API_URL;
const getAuthHeaders = async () => {
    const accessToken = await MobileStorage.getAccessToken();
    if (!accessToken)
        return { "Content-Type": "application/json" };
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    };
};
async function fetchNotifications(page) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/notifications?page=${page}&limit=20`, { headers });
    if (!response.ok)
        throw new Error("Failed to fetch notifications");
    return response.json();
}
async function fetchUnreadCount() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/notifications/unread-count`, { headers });
    if (!response.ok)
        throw new Error("Failed to fetch unread count");
    const data = await response.json();
    return data.count;
}
async function markAsReadApi(notificationId) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers,
    });
    return response.ok;
}
async function markAllAsReadApi() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: "POST",
        headers,
    });
    return response.ok;
}
async function deleteNotificationApi(notificationId) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: "DELETE",
        headers,
    });
    return response.ok;
}
async function acceptFollowRequestApi(requestId) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/follow-request/${requestId}/accept`, {
        method: "POST",
        headers,
    });
    if (!response.ok)
        throw new Error("Failed to accept follow request");
    return response.json();
}
async function rejectFollowRequestApi(requestId) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/follow-request/${requestId}/reject`, {
        method: "POST",
        headers,
    });
    if (!response.ok)
        throw new Error("Failed to reject follow request");
    return response.json();
}
export const useNotificationsViewModel = () => {
    const queryClient = useQueryClient();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useInfiniteQuery({
        queryKey: queryKeys.notifications.list(),
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
        queryKey: queryKeys.notifications.unreadCount(),
        queryFn: fetchUnreadCount,
    });
    const notifications = useMemo(() => {
        if (!data)
            return [];
        return data.pages.flatMap((page) => page.data);
    }, [data]);
    const markAsReadMutation = useMutation({
        mutationFn: markAsReadApi,
        onMutate: async (notificationId) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.notifications.list() });
            markNotificationAsReadInCache(queryClient, notificationId);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        },
    });
    const markAllAsReadMutation = useMutation({
        mutationFn: markAllAsReadApi,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: queryKeys.notifications.list() });
            markAllNotificationsAsReadInCache(queryClient);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        },
    });
    const deleteMutation = useMutation({
        mutationFn: deleteNotificationApi,
        onMutate: async (notificationId) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.notifications.list() });
            const notification = notifications.find((n) => n.id === notificationId);
            const wasUnread = notification ? !notification.isRead : false;
            removeNotificationFromCache(queryClient, notificationId, wasUnread);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        },
    });
    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
    const handleMarkAsRead = useCallback((notificationId) => {
        markAsReadMutation.mutate(notificationId);
    }, [markAsReadMutation]);
    const handleMarkAllAsRead = useCallback(() => {
        markAllAsReadMutation.mutate();
    }, [markAllAsReadMutation]);
    const handleDelete = useCallback((notificationId) => {
        deleteMutation.mutate(notificationId);
    }, [deleteMutation]);
    const acceptFollowRequestMutation = useMutation({
        mutationFn: acceptFollowRequestApi,
        onMutate: async (requestId) => {
            const notification = notifications.find((n) => n.type === "follow_request" && n.data?.requestId === String(requestId));
            if (notification) {
                removeNotificationFromCache(queryClient, notification.id, !notification.isRead);
            }
            updateFollowersCount(queryClient, 1);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        },
    });
    const rejectFollowRequestMutation = useMutation({
        mutationFn: rejectFollowRequestApi,
        onMutate: async (requestId) => {
            const notification = notifications.find((n) => n.type === "follow_request" && n.data?.requestId === String(requestId));
            if (notification) {
                removeNotificationFromCache(queryClient, notification.id, !notification.isRead);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        },
    });
    const handleAcceptFollowRequest = useCallback((requestId) => {
        acceptFollowRequestMutation.mutate(requestId);
    }, [acceptFollowRequestMutation]);
    const handleRejectFollowRequest = useCallback((requestId) => {
        rejectFollowRequestMutation.mutate(requestId);
    }, [rejectFollowRequestMutation]);
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
        staleTime: Infinity,
    });
    return count;
};
