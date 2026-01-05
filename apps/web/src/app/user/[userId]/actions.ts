"use server";

import { cookies } from "next/headers";
import { WebUserService } from "@/services/web-user.service";

export async function followUserAction(userId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  return WebUserService.followUser(userId, accessToken);
}

export async function unfollowUserAction(userId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  return WebUserService.unfollowUser(userId, accessToken);
}

export async function getUserReviewsAction(userId: string, page: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  return WebUserService.getUserReviews(userId, page, accessToken);
}

export async function cancelFollowRequestAction(userId: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  return WebUserService.cancelFollowRequest(userId, accessToken);
}
