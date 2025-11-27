import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { WebBookService } from "@/services/web-book.service";
import SingleBookClient from "./single-book-client";

interface PageProps {
  params: Promise<{ bookId: string }>;
}

export default async function SingleBookPage({ params }: PageProps) {
  const { bookId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  let book = null;
  let initialReviewsResponse = null;

  try {
    book = await WebBookService.getBook(bookId);
    
    if (!book || !book.id) {
      notFound();
    }

    initialReviewsResponse = await WebBookService.getBookReviews(bookId, 1, accessToken);
  } catch (error) {
    console.error("Failed to fetch book:", error);
    notFound();
  }

  return (
    <SingleBookClient 
      initialBook={book} 
      initialReviewsResponse={initialReviewsResponse} 
    />
  );
}
