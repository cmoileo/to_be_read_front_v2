export type FollowRequestStatus = "none" | "pending" | "accepted" | "rejected";

export interface FollowRequest {
  id: number;
  requesterId: string;
  requestedId: string;
  status: FollowRequestStatus;
  createdAt: string;
  updatedAt: string;
  requester: {
    id: string;
    userName: string;
    avatarUrl: string | null;
    biography: string | null;
  };
}

export interface FollowRequestPaginated {
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
  };
  data: FollowRequest[];
}

export interface FollowResponse {
  followed?: boolean;
  requested?: boolean;
}
