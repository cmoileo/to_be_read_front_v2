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
  reporterId: number;
  entityType: ReportEntityType;
  reviewId: number | null;
  commentId: number | null;
  reportedUserId: number | null;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  resolvedById: number | null;
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
  entityId: number;
  reason: ReportReason;
  description?: string;
}

export interface CreateReportResponse {
  status: string;
  message: string;
  data: Report;
}
