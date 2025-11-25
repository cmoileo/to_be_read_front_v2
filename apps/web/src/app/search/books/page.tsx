"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, BookCard, useTranslation } from "@repo/ui";
import { useSearchViewModel } from "@/viewmodels/use-search-viewmodel";

export default function SearchBooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const q = searchParams.get("q") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const { booksResults, isLoadingBooks, searchBooks } = useSearchViewModel();

  useEffect(() => {
    if (q && currentPage === 1) {
      searchBooks({ q, page: 1, limit: 20 }, false);
    }
  }, [q]);

  useEffect(() => {
    if (q && currentPage > 1) {
      searchBooks({ q, page: currentPage, limit: 20 }, true);
    }
  }, [currentPage]);

  const handleLoadMore = () => {
    if (booksResults?.meta?.lastPage && currentPage < booksResults.meta.lastPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const hasMore = booksResults?.meta?.lastPage && currentPage < booksResults.meta.lastPage;

  return (
    <div className="container py-8 max-w-4xl">
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            ← {t("common.back")}
          </Button>
        </div>
        <h1 className="text-3xl font-bold">{t("search.books")}</h1>
        <p className="text-muted-foreground mt-2">
          {booksResults?.meta?.total || 0} {t("search.results")}
        </p>
      </header>

      {isLoadingBooks && currentPage === 1 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      )}

      {booksResults && (
        <div className="space-y-3">
          {booksResults.data.map((book) => (
            <BookCard key={book.id} book={book} onClick={() => {}} />
          ))}

          {hasMore && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLoadMore}
              disabled={isLoadingBooks}
            >
              {isLoadingBooks ? t("common.loading") : t("common.loadMore")}
            </Button>
          )}

          {!hasMore && booksResults.data.length > 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              {t("search.noMoreResults")}
            </p>
          )}
        </div>
      )}

      {!isLoadingBooks && (!booksResults || booksResults.data.length === 0) && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("search.noResults")}</p>
        </div>
      )}
    </div>
  );
}
