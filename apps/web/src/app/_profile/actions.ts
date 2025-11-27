"use server";

import { cookies } from "next/headers";
import { WebProfileService, type UpdateProfileData } from "@/services/web-profile.service";

export async function getProfileAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  return WebProfileService.getMyProfile(accessToken);
}

export async function updateProfileAction(formData: FormData) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  const data: UpdateProfileData = {};

  const userName = formData.get("userName");
  const biography = formData.get("biography");
  const locale = formData.get("locale");
  const avatar = formData.get("avatar");

  if (userName) data.userName = userName.toString();
  if (biography) data.biography = biography.toString();
  if (locale) data.locale = locale.toString() as "en" | "fr";
  if (avatar instanceof File && avatar.size > 0) data.avatar = avatar;

  return WebProfileService.updateProfile(data, accessToken);
}

export async function getMyReviewsAction(page: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  return WebProfileService.getMyReviews(page, accessToken);
}

export async function deleteReviewAction(reviewId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    throw new Error("Non authentifié");
  }

  return WebProfileService.deleteReview(reviewId, accessToken);
}
