import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { WebUserService } from "@/services/web-user.service";
import FollowersClient from "./followers-client";

interface FollowersPageProps {
  params: Promise<{ userId: string }>;
}

export default async function FollowersPage({ params }: FollowersPageProps) {
  const { userId } = await params;

  if (!userId) {
    notFound();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  try {
    const [user, followersResponse] = await Promise.all([
      WebUserService.getUser(userId, accessToken),
      WebUserService.getFollowers(userId, 1, accessToken),
    ]);

    return (
      <FollowersClient
        userId={userId}
        userName={user.userName}
        initialData={followersResponse}
      />
    );
  } catch (error) {
    console.error("Failed to fetch followers:", error);
    notFound();
  }
}
