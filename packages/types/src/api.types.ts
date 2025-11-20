export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    rule: string;
    message: string;
  }>;
}

export interface ApiSuccessResponse<T = unknown> {
  message?: string;
  data?: T;
}
