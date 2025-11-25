"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, ReviewCard, useTranslation } from "@repo/ui";
import { useSearchViewModel } from "@/viewmodels/use-search-viewmodel";

export default function SearchReviewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const q = searchParams.get("q") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const { reviewsResults, isLoadingReviews, searchReviews } = useSearchViewModel();

  useEffect(() => {
    if (q && currentPage === 1) {
      searchReviews({ q, page: 1, limit: 20 }, false);
    }
  }, [q]);

  useEffect(() => {
    if (q && currentPage > 1) {
      searchReviews({ q, page: currentPage, limit: 20 }, true);
    }
  }, [currentPage]);

  const handleLoadMore = () => {
    if (reviewsResults?.meta?.lastPage && currentPage < reviewsResults.meta.lastPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const hasMore = reviewsResults?.meta?.lastPage && currentPage < reviewsResults.meta.lastPage;

  return (
    <div className="container py-8 max-w-4xl">
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/search")}>
            ← {t("common.back")}
          </Button>
        </div>
        <h1 className="text-3xl font-bold">{t("search.reviews")}</h1>
        <p className="text-muted-foreground mt-2">
          {reviewsResults?.meta?.total || 0} {t("search.results")}
        </p>
      </header>

      {isLoadingReviews && currentPage === 1 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      )}

      {reviewsResults && (
        <div className="space-y-3">
          {reviewsResults.data.map((review) => (
            <ReviewCard key={review.id} review={review} onClick={() => {}} />
          ))}

          {hasMore && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLoadMore}
              disabled={isLoadingReviews}
            >
              {isLoadingReviews ? t("common.loading") : t("common.loadMore")}
            </Button>
          )}

          {!hasMore && reviewsResults.data.length > 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              {t("search.noMoreResults")}
            </p>
          )}
        </div>
      )}

      {!isLoadingReviews && (!reviewsResults || reviewsResults.data.length === 0) && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("search.noResults")}</p>
        </div>
      )}
    </div>
  );
}
