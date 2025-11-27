import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { WebReviewService } from "@/services/web-review.service";
import SingleReviewClient from "./single-review-client";

interface SingleReviewPageProps {
  params: Promise<{ reviewId: string }>;
}

export default async function SingleReviewPage({ params }: SingleReviewPageProps) {
  const { reviewId } = await params;
  const reviewIdNum = parseInt(reviewId, 10);

  if (isNaN(reviewIdNum)) {
    notFound();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  try {
    const [review, initialCommentsResponse] = await Promise.all([
      WebReviewService.getReview(reviewIdNum, accessToken),
      WebReviewService.getComments(reviewIdNum, 1, accessToken),
    ]);

    return (
      <SingleReviewClient
        initialReview={review}
        initialCommentsResponse={initialCommentsResponse}
      />
    );
  } catch (error) {
    console.error("Failed to fetch review:", error);
    notFound();
  }
}
