"use server";

import { cookies } from "next/headers";
import { WebReviewService } from "@/services/web-review.service";

export async function likeReviewAction(reviewId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  return WebReviewService.likeReview(reviewId, accessToken);
}

export async function getCommentsAction(reviewId: number, page: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  return WebReviewService.getComments(reviewId, page, accessToken);
}

export async function createCommentAction(reviewId: number, content: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  return WebReviewService.createComment(reviewId, content, accessToken);
}

export async function deleteCommentAction(commentId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  return WebReviewService.deleteComment(commentId, accessToken);
}

export async function likeCommentAction(commentId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  return WebReviewService.likeComment(commentId, accessToken);
}
