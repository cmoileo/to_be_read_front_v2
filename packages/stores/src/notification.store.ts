import type { QueryClient } from "@tanstack/react-query";
import type { NotificationItem } from "@repo/types";
import { queryKeys } from "./keys/query-keys";

export const notificationKeys = queryKeys.notifications;

export const getUnreadCount = (queryClient: QueryClient): number => {
  return queryClient.getQueryData<number>(notificationKeys.unreadCount()) ?? 0;
};

export const setUnreadCount = (queryClient: QueryClient, count: number) => {
  queryClient.setQueryData(notificationKeys.unreadCount(), count);
};

export const incrementUnreadCount = (queryClient: QueryClient, delta: number = 1) => {
  queryClient.setQueryData(notificationKeys.unreadCount(), (old: number | undefined) =>
    (old ?? 0) + delta
  );
};

export const decrementUnreadCount = (queryClient: QueryClient, delta: number = 1) => {
  queryClient.setQueryData(notificationKeys.unreadCount(), (old: number | undefined) =>
    Math.max(0, (old ?? 0) - delta)
  );
};

export const removeNotificationFromCache = (
  queryClient: QueryClient,
  notificationId: number,
  wasUnread: boolean = false
) => {
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

  if (wasUnread) {
    decrementUnreadCount(queryClient);
  }
};

export const markNotificationAsReadInCache = (queryClient: QueryClient, notificationId: number) => {
  let wasUnread = false;

  queryClient.setQueryData(notificationKeys.list(), (old: any) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: page.data.map((n: NotificationItem) => {
          if (n.id === notificationId && !n.isRead) {
            wasUnread = true;
            return { ...n, isRead: true };
          }
          return n;
        }),
      })),
    };
  });

  if (wasUnread) {
    decrementUnreadCount(queryClient);
  }
};

export const markAllNotificationsAsReadInCache = (queryClient: QueryClient) => {
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

  setUnreadCount(queryClient, 0);
};

export const prependNotificationToCache = (
  queryClient: QueryClient,
  notification: NotificationItem
) => {
  queryClient.setQueryData(notificationKeys.list(), (old: any) => {
    if (!old || !old.pages || old.pages.length === 0) {
      return {
        pages: [{ data: [notification], meta: { currentPage: 1, lastPage: 1, total: 1 } }],
        pageParams: [1],
      };
    }

    const firstPage = old.pages[0];
    return {
      ...old,
      pages: [
        {
          ...firstPage,
          data: [notification, ...firstPage.data],
          meta: { ...firstPage.meta, total: firstPage.meta.total + 1 },
        },
        ...old.pages.slice(1),
      ],
    };
  });

  if (!notification.isRead) {
    incrementUnreadCount(queryClient);
  }
};

export const invalidateNotifications = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: notificationKeys.all });
};
