import type { UserAuthor } from "./user.types";
import type { Review } from "./review.types";
import type { Comment } from "./comment.types";

export type ReportEntityType = "review" | "comment" | "user";

export type ReportReason =
  | "SPAM"
  | "HARASSMENT"
  | "HATE_SPEECH"
  | "SPOILERS"
  | "INAPPROPRIATE"
  | "OTHER";

export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";

export interface Report {
  id: number;
  reporterId: string;
  entityType: ReportEntityType;
  reviewId: number | null;
  commentId: number | null;
  reportedUserId: string | null;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  resolvedById: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  reporter: UserAuthor;
  review?: Review;
  comment?: Comment;
  reportedUser?: UserAuthor;
  resolvedBy?: UserAuthor;
}

export interface CreateReportData {
  entityType: ReportEntityType;
  entityId: number | string;
  reason: ReportReason;
  description?: string;
}

export interface CreateReportResponse {
  status: string;
  message: string;
  data: Report;
}
