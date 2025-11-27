"use server";

import { cookies } from "next/headers";
import { WebFeedService } from "@/services/web-feed.service";

export async function getFeedAction(page: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  return WebFeedService.getFeed(page, accessToken);
}

export async function likeReviewAction(reviewId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  return WebFeedService.likeReview(reviewId, accessToken);
}
