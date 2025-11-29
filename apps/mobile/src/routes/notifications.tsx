import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { MobileStorage } from "../services/mobile-storage.service";
import { NotificationsScreen, useTranslation, ArrowLeft } from "@repo/ui";
import { useNotificationsViewModel } from "../viewmodels/use-notifications-viewmodel";
import type { NotificationItem } from "@repo/types";

export const Route = createFileRoute("/notifications")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: NotificationsPage,
});

function NotificationsPage() {
  const navigate = useNavigate();
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
  } = useNotificationsViewModel();

  const handleBack = () => {
    router.history.back();
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (notification.data?.reviewId) {
      navigate({ to: `/review/${notification.data.reviewId}` });
    } else if (notification.data?.actorId) {
      navigate({ to: `/user/${notification.data.actorId}` });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="p-4 border-b flex items-center gap-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">{t("notifications.title")}</h1>
      </div>
      <div className="flex-1 p-4">
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
        />
      </div>
    </div>
  );
}
