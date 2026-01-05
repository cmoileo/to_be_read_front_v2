import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { WebUserService } from "@/services/web-user.service";
import FollowingClient from "./following-client";

interface FollowingPageProps {
  params: Promise<{ userId: string }>;
}

export default async function FollowingPage({ params }: FollowingPageProps) {
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
    const [user, followingsResponse] = await Promise.all([
      WebUserService.getUser(userId, accessToken),
      WebUserService.getFollowings(userId, 1, accessToken),
    ]);

    return (
      <FollowingClient
        userId={userId}
        userName={user.userName}
        initialData={followingsResponse}
      />
    );
  } catch (error) {
    console.error("Failed to fetch followings:", error);
    notFound();
  }
}
