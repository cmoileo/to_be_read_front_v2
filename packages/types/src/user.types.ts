export interface User {
  id: number;
  userName: string;
  avatar: string | null;
  biography: string | null;
  followersCount: number;
  followingCount: number;
  reviewsCount: number;
  isFollowing: boolean;
  isMe: boolean;
  isPrivate?: boolean;
  followRequestStatus?: "none" | "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
  email?: string;
  locale?: "fr" | "en";
  theme?: "light" | "dark" | "system";
  pushNotificationsEnabled?: boolean;
}

export interface UserDetailed extends User {
  email: string;
  locale: "fr" | "en";
  theme: "light" | "dark" | "system";
  pushNotificationsEnabled: boolean;
  isPrivate: boolean;
}

export interface UserAuthor {
  id: number;
  userName: string;
  avatar: string | null;
  isMe: boolean;
}

export interface UserBasic {
  id: number;
  userName: string;
}
