import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { WebUserService } from "@/services/web-user.service";
import UserProfileClient from "./user-profile-client";

interface UserProfilePageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: UserProfilePageProps): Promise<Metadata> {
  const { userId } = await params;

  if (!userId) {
    return {};
  }

  try {
    const user = await WebUserService.getUser(userId);
    
    if (!user) {
      return {};
    }

    const title = `@${user.userName}`;
    const description = user.biography 
      ? user.biography.substring(0, 160) 
      : `Découvrez le profil de @${user.userName} sur Inkgora`;

    return {
      title,
      description,
      openGraph: {
        title: `${title} sur Inkgora`,
        description,
        ...(user.avatar && { images: [{ url: user.avatar }] }),
        type: "profile",
      },
      twitter: {
        card: "summary",
        title: `${title} sur Inkgora`,
        description,
        ...(user.avatar && { images: [user.avatar] }),
      },
    };
  } catch {
    return {};
  }
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = await params;

  if (!userId) {
    notFound();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  let user;
  let initialReviewsResponse;

  try {
    [user, initialReviewsResponse] = await Promise.all([
      WebUserService.getUser(userId, accessToken),
      WebUserService.getUserReviews(userId, 1, accessToken),
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
