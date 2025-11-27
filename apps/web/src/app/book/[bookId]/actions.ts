"use server";

import { cookies } from "next/headers";
import { WebBookService } from "@/services/web-book.service";

export async function getBookReviewsAction(googleBookId: string, page: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  return WebBookService.getBookReviews(googleBookId, page, accessToken);
}
