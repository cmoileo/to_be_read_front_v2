import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WebBookService } from "@/services/web-book.service";
import SingleBookClient from "./single-book-client";

interface PageProps {
  params: Promise<{ bookId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { bookId } = await params;
  
  try {
    const book = await WebBookService.getBook(bookId);
    
    if (!book) {
      return {};
    }

    const title = book.title;
    const description = book.description 
      ? book.description.substring(0, 160) 
      : `Découvrez les critiques de ${book.title} sur Inkgora`;
    const authors = book.authors?.join(", ") || "Auteur inconnu";

    return {
      title: `${title} - ${authors}`,
      description,
      openGraph: {
        title: `${title} - ${authors}`,
        description,
        images: book.thumbnail ? [{ url: book.thumbnail }] : [],
        type: "book",
      },
      twitter: {
        card: "summary",
        title: `${title} - ${authors}`,
        description,
        images: book.thumbnail ? [book.thumbnail] : [],
      },
    };
  } catch {
    return {};
  }
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
