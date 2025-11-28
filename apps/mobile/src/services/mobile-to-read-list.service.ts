import type {
  PaginatedResponse,
  ToReadListItem,
  AddToReadListResponse,
  RemoveFromReadListResponse,
} from "@repo/types";
import { HttpInterceptor } from "./http-interceptor.service";

export class MobileToReadListService {
  static async getToReadList(page: number = 1): Promise<PaginatedResponse<ToReadListItem>> {
    return HttpInterceptor.get<PaginatedResponse<ToReadListItem>>(`/to-read-list/${page}`);
  }

  static async addToReadList(googleBookId: string): Promise<AddToReadListResponse> {
    return HttpInterceptor.post<AddToReadListResponse>("/to-read-list", { googleBookId });
  }

  static async removeFromReadList(googleBookId: string): Promise<RemoveFromReadListResponse> {
    return HttpInterceptor.delete<RemoveFromReadListResponse>("/to-read-list", { googleBookId });
  }
}
