import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WebReviewService } from "@/services/web-review.service";
import SingleReviewClient from "./single-review-client";

interface SingleReviewPageProps {
  params: Promise<{ reviewId: string }>;
}

export async function generateMetadata({ params }: SingleReviewPageProps): Promise<Metadata> {
  const { reviewId } = await params;
  const reviewIdNum = parseInt(reviewId, 10);

  if (isNaN(reviewIdNum)) {
    return {};
  }

  try {
    const review = await WebReviewService.getReview(reviewIdNum);
    
    if (!review) {
      return {};
    }

    const bookTitle = review.book?.title || "un livre";
    const username = review.user?.username || "un utilisateur";
    const title = `Critique de ${bookTitle} par @${username}`;
    const description = review.content 
      ? review.content.substring(0, 160) 
      : `Découvrez la critique de ${bookTitle} sur Inkgora`;
    const imageUrl = review.book?.volumeInfo?.imageLinks?.thumbnail;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        ...(imageUrl && { images: [{ url: imageUrl }] }),
        type: "article",
      },
      twitter: {
        card: "summary",
        title,
        description,
        ...(imageUrl && { images: [imageUrl] }),
      },
    };
  } catch {
    return {};
  }
}

export default async function SingleReviewPage({ params }: SingleReviewPageProps) {
  const { reviewId } = await params;
  const reviewIdNum = parseInt(reviewId, 10);

  if (isNaN(reviewIdNum)) {
    notFound();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

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
