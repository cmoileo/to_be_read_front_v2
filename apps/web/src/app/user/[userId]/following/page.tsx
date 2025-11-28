import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { WebUserService } from "@/services/web-user.service";
import FollowingClient from "./following-client";

interface FollowingPageProps {
  params: Promise<{ userId: string }>;
}

export default async function FollowingPage({ params }: FollowingPageProps) {
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
    const [user, followingsResponse] = await Promise.all([
      WebUserService.getUser(userIdNum, accessToken),
      WebUserService.getFollowings(userIdNum, 1, accessToken),
    ]);

    return (
      <FollowingClient
        userId={userIdNum}
        userName={user.userName}
        initialData={followingsResponse}
      />
    );
  } catch (error) {
    console.error("Failed to fetch followings:", error);
    notFound();
  }
}
