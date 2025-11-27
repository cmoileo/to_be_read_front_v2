import { useState, useEffect } from "react";
import { createFileRoute, redirect, useSearch, useNavigate } from "@tanstack/react-router";
import { MobileStorage } from "../../services/mobile-storage.service";
import { Button, BookCard, useTranslation } from "@repo/ui";
import { useSearchViewModel } from "../../viewmodels/use-search-viewmodel";

export const Route = createFileRoute("/search/books")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: SearchBooksPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: (search.q as string) || "",
    };
  },
});

function SearchBooksPage() {
  const { t } = useTranslation();
  const { q } = useSearch({ from: "/search/books" });
  const navigate = useNavigate();

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

  const handleBookClick = (bookId: string) => {
    navigate({ to: "/book/$bookId", params: { bookId } });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 p-6">
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              ← {t("common.back")}
            </Button>
          </div>
          <h1 className="text-2xl font-bold">{t("search.books")}</h1>
          <p className="text-muted-foreground mt-1">
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
              <BookCard key={book.id} book={book} onClick={() => handleBookClick(book.id)} />
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
    </div>
  );
}
