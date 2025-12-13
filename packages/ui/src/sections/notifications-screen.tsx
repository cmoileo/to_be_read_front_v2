import { useTranslation } from "react-i18next";
import { Button } from "../components/button";
import { Avatar, AvatarImage, AvatarFallback } from "../components/avatar";
import {
  Loader2,
  Bell,
  BellOff,
  Heart,
  MessageCircle,
  UserPlus,
  Trash2,
  Check,
  CheckCheck,
  X,
  UserCheck,
} from "lucide-react";
import type { NotificationItem, NotificationType } from "@repo/types";
import { cn } from "../lib/utils";

interface NotificationsScreenProps {
  notifications: NotificationItem[];
  isLoading: boolean;
  hasMore: boolean;
  isFetchingMore: boolean;
  unreadCount: number;
  onLoadMore: () => void;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: number) => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  onAcceptFollowRequest?: (requestId: number) => void;
  onRejectFollowRequest?: (requestId: number) => void;
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "new_follower":
      return <UserPlus className="w-5 h-5 text-blue-500" />;
    case "follow_request":
      return <UserCheck className="w-5 h-5 text-purple-500" />;
    case "review_like":
    case "comment_like":
      return <Heart className="w-5 h-5 text-red-500" />;
    case "new_comment":
    case "comment_reply":
      return <MessageCircle className="w-5 h-5 text-green-500" />;
    default:
      return <Bell className="w-5 h-5 text-primary" />;
  }
}

function formatTimeAgo(
  dateString: string,
  t: (key: string, options?: Record<string, unknown>) => string
): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t("notifications.justNow");
  if (diffMins < 60) return t("notifications.minutesAgo", { count: diffMins });
  if (diffHours < 24) return t("notifications.hoursAgo", { count: diffHours });
  if (diffDays < 7) return t("notifications.daysAgo", { count: diffDays });

  return date.toLocaleDateString();
}

function NotificationItemCard({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
  onAcceptFollowRequest,
  onRejectFollowRequest,
  t,
}: {
  notification: NotificationItem;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  onClick?: (notification: NotificationItem) => void;
  onAcceptFollowRequest?: (requestId: number) => void;
  onRejectFollowRequest?: (requestId: number) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onClick?.(notification);
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.substring(0, 2).toUpperCase();
  };

  const isFollowRequest = notification.type === "follow_request";
  const requestId = notification.data?.requestId ? Number(notification.data.requestId) : undefined;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border transition-colors",
        !isFollowRequest && "cursor-pointer",
        notification.isRead ? "bg-background border-border" : "bg-primary/5 border-primary/20"
      )}
      onClick={!isFollowRequest ? handleClick : undefined}
    >
      <Avatar className="h-10 w-10 flex-shrink-0">
        {notification.actor?.avatarUrl && (
          <AvatarImage src={notification.actor.avatarUrl} alt={notification.actor.userName} />
        )}
        <AvatarFallback className="from-primary/30 to-accent/30">
          {notification.actor?.userName ? getInitials(notification.actor.userName) : getNotificationIcon(notification.type)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm",
            notification.isRead ? "text-muted-foreground" : "text-foreground font-medium"
          )}
        >
          {notification.body}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatTimeAgo(notification.createdAt, t)}
        </p>

        {isFollowRequest && requestId && onAcceptFollowRequest && onRejectFollowRequest && (
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              className="rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onAcceptFollowRequest(requestId);
              }}
            >
              <Check className="w-4 h-4 mr-1" />
              {t("notifications.accept")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onRejectFollowRequest(requestId);
              }}
            >
              <X className="w-4 h-4 mr-1" />
              {t("notifications.reject")}
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
          >
            <Check className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function NotificationsScreen({
  notifications,
  isLoading,
  hasMore,
  isFetchingMore,
  unreadCount,
  onLoadMore,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onNotificationClick,
  onAcceptFollowRequest,
  onRejectFollowRequest,
}: NotificationsScreenProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <BellOff className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{t("notifications.empty")}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {t("notifications.emptyDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("notifications.unreadCount", { count: unreadCount })}
          </p>
          <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="text-primary">
            <CheckCheck className="w-4 h-4 mr-2" />
            {t("notifications.markAllAsRead")}
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {notifications.map((notification) => (
          <NotificationItemCard
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
            onClick={onNotificationClick}
            onAcceptFollowRequest={onAcceptFollowRequest}
            onRejectFollowRequest={onRejectFollowRequest}
            t={t}
          />
        ))}
      </div>

      {hasMore && (
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={onLoadMore}
            disabled={isFetchingMore}
          >
            {isFetchingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("common.loading")}
              </>
            ) : (
              t("common.loadMore")
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
