"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SingleBookScreen, AuthPromptDialog, type AuthPromptType } from "@repo/ui";
import { useAuthContext } from "@/models/hooks/use-auth-context";
import { useSingleBookViewModel } from "./use-single-book-viewmodel";
import type { GoogleBook, BookReviewsPaginatedResponse } from "@/services/web-book.service";

interface SingleBookClientProps {
  initialBook: GoogleBook;
  initialReviewsResponse: BookReviewsPaginatedResponse;
}

export default function SingleBookClient({
  initialBook,
  initialReviewsResponse,
}: SingleBookClientProps) {
  const router = useRouter();
  const { user } = useAuthContext();
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authPromptType, setAuthPromptType] = useState<AuthPromptType>("toReadList");

  const {
    book,
    reviews,
    totalReviews,
    isLoading,
    hasMoreReviews,
    isFetchingMoreReviews,
    handleLoadMoreReviews,
    handleBack,
    handleReviewClick,
    handleAuthorClick,
    isInReadList,
    isAddingToList,
    handleToggleReadList,
  } = useSingleBookViewModel({ initialBook, initialReviewsResponse });

  const showAuthPrompt = (type: AuthPromptType) => {
    setAuthPromptType(type);
    setAuthPromptOpen(true);
  };

  const handleToggleReadListWithAuth = () => {
    if (!user) {
      showAuthPrompt("toReadList");
      return;
    }
    handleToggleReadList();
  };

  return (
    <>
      <SingleBookScreen
        book={book}
        reviews={reviews}
        totalReviews={totalReviews}
        isLoading={isLoading}
        hasMoreReviews={hasMoreReviews}
        isFetchingMoreReviews={isFetchingMoreReviews}
        isInReadList={isInReadList}
        isAddingToList={isAddingToList}
        onBack={handleBack}
        onLoadMoreReviews={handleLoadMoreReviews}
        onReviewClick={handleReviewClick}
        onAuthorClick={handleAuthorClick}
        onToggleReadList={handleToggleReadListWithAuth}
      />
      <AuthPromptDialog
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
        promptType={authPromptType}
        onLogin={() => router.push("/login")}
        onRegister={() => router.push("/register")}
      />
    </>
  );
}
