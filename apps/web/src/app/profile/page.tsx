import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WebProfileService } from "@/services/web-profile.service";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  let user = null;
  let initialReviewsResponse = null;

  try {
    const profileData = await WebProfileService.getMyProfile(accessToken);
    user = profileData.user;

    initialReviewsResponse = await WebProfileService.getMyReviews(1, accessToken);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    redirect("/login");
  }

  return <ProfileClient initialUser={user} initialReviewsResponse={initialReviewsResponse} />;
}
