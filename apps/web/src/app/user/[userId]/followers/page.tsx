import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { WebUserService } from "@/services/web-user.service";
import FollowersClient from "./followers-client";

interface FollowersPageProps {
  params: Promise<{ userId: string }>;
}

export default async function FollowersPage({ params }: FollowersPageProps) {
  const { userId } = await params;
  const userIdNum = parseInt(userId, 10);

  if (isNaN(userIdNum)) {
    notFound();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  try {
    const [user, followersResponse] = await Promise.all([
      WebUserService.getUser(userIdNum, accessToken),
      WebUserService.getFollowers(userIdNum, 1, accessToken),
    ]);

    return (
      <FollowersClient
        userId={userIdNum}
        userName={user.userName}
        initialData={followersResponse}
      />
    );
  } catch (error) {
    console.error("Failed to fetch followers:", error);
    notFound();
  }
}
