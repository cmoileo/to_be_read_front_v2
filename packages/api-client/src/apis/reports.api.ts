import type { CreateReportData, CreateReportResponse } from "@repo/types";
import { HttpClient } from "../http-client";

export class ReportsApi {
  static async createReport(data: CreateReportData): Promise<CreateReportResponse> {
    return HttpClient.post<CreateReportResponse>("/reports", data);
  }
}
