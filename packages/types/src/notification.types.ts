export type NotificationType =
  | "new_follower"
  | "review_like"
  | "comment_like"
  | "new_comment"
  | "review_mention"
  | "comment_reply";

export interface NotificationActor {
  id: number;
  userName: string;
  avatarUrl?: string;
}

export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
  actor: NotificationActor | null;
}

export interface NotificationsResponse {
  data: NotificationItem[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

export interface UnreadCountResponse {
  count: number;
}
