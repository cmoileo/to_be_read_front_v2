import { cookies } from "next/headers";
import { OnboardingScreen } from "@repo/ui";
import { WebFeedService } from "@/services/web-feed.service";
import FeedClient from "./(feed)/feed-client";
import Link from "next/link";

export default async function HomePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    return <OnboardingClientWrapper />;
  }

  let initialFeedResponse = null;

  try {
    initialFeedResponse = await WebFeedService.getFeed(1, accessToken);
  } catch (error) {
    console.error("Failed to fetch feed:", error);
  }

  return <FeedClient initialFeedResponse={initialFeedResponse} />;
}

function OnboardingClientWrapper() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">To Be Read</h1>
          <p className="text-muted-foreground text-lg">
            Partagez vos critiques littéraires
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <p className="text-muted-foreground">✨ Découvrez de nouveaux livres</p>
          <p className="text-muted-foreground">📚 Partagez vos avis et critiques</p>
          <p className="text-muted-foreground">👥 Suivez d&apos;autres lecteurs</p>
        </div>

        <div className="flex flex-col gap-3 pt-8">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Créer un compte
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
