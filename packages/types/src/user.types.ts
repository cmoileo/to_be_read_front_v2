export interface User {
  id: number;
  userName: string;
  avatar: string | null;
  biography: string | null;
  followersCount: number;
  followingsCount: number;
  reviewsCount: number;
  isFollowing: boolean;
  isMe: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetailed extends User {
  email: string;
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
