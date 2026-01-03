import type { UserAuthor } from "./user.types";

export interface BlockedUser extends UserAuthor {
  blockedAt: string;
  biography?: string | null;
}

export interface BlockResponse {
  status: string;
  code: string;
  message: string;
}

export interface BlockStatusResponse {
  isBlocked: boolean;
  hasBlockedMe: boolean;
}
