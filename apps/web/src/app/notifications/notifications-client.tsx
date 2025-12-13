"use client";

import { useRouter } from "next/navigation";
import { NotificationsScreen, useTranslation, ArrowLeft } from "@repo/ui";
import { useNotificationsViewModel } from "@/viewmodels/use-notifications-viewmodel";
import type { NotificationItem } from "@repo/types";

export default function NotificationsClient() {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    isFetchingMore,
    handleLoadMore,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleAcceptFollowRequest,
    handleRejectFollowRequest,
  } = useNotificationsViewModel();

  const handleBack = () => {
    router.back();
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (notification.data?.reviewId) {
      router.push(`/review/${notification.data.reviewId}`);
    } else if (notification.data?.actorId) {
      router.push(`/user/${notification.data.actorId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">{t("notifications.title")}</h1>
      </div>
      <NotificationsScreen
        notifications={notifications}
        isLoading={isLoading}
        hasMore={hasMore}
        isFetchingMore={isFetchingMore}
        unreadCount={unreadCount}
        onLoadMore={handleLoadMore}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDelete}
        onNotificationClick={handleNotificationClick}
        onAcceptFollowRequest={handleAcceptFollowRequest}
        onRejectFollowRequest={handleRejectFollowRequest}
      />
    </div>
  );
}
