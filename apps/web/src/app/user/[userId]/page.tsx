import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { WebUserService } from "@/services/web-user.service";
import UserProfileClient from "./user-profile-client";

interface UserProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = await params;
  const userIdNum = parseInt(userId, 10);

  if (isNaN(userIdNum)) {
    notFound();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  let user;
  let initialReviewsResponse;

  try {
    [user, initialReviewsResponse] = await Promise.all([
      WebUserService.getUser(userIdNum, accessToken),
      WebUserService.getUserReviews(userIdNum, 1, accessToken),
    ]);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    notFound();
  }

  if (user.isMe) {
    redirect("/profile");
  }

  return <UserProfileClient initialUser={user} initialReviewsResponse={initialReviewsResponse} />;
}
