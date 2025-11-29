import { cookies } from "next/headers";
import { WebFeedService } from "@/services/web-feed.service";
import FeedClient from "./(feed)/feed-client";
import { VisitorHomeClient } from "./visitor-home-client";

export default async function HomePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    return <VisitorHomeClient />;
  }

  let initialFeedResponse = null;

  try {
    initialFeedResponse = await WebFeedService.getFeed(1, accessToken);
  } catch (error) {
    console.error("Failed to fetch feed:", error);
  }

  return <FeedClient initialFeedResponse={initialFeedResponse} />;
}
