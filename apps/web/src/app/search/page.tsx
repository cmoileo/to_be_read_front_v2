"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/models/hooks/use-auth-context";
import {
  Input,
  UserCard,
  BookCard,
  ReviewCard,
  SearchSection,
  useTranslation,
  useToast,
} from "@repo/ui";
import { useSearchViewModel } from "../../viewmodels/use-search-viewmodel";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthContext();
  const { t } = useTranslation();
  const { toast } = useToast();

  const initialQuery = searchParams.get("q") || "";
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [currentQuery, setCurrentQuery] = useState(initialQuery);

  const {
    globalResults,
    usersResults,
    booksResults,
    reviewsResults,
    isSearching,
    error,
    globalSearch,
    searchUsers,
    searchBooks,
    searchReviews,
  } = useSearchViewModel();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
    }
  }, [mounted, user, router]);

  useEffect(() => {
    if (mounted && initialQuery && !globalResults) {
      globalSearch(initialQuery);
    }
  }, [mounted, initialQuery]);

  useEffect(() => {
    if (error) {
      toast({
        title: t("common.error"),
        description: t(error),
        variant: "destructive",
      });
    }
  }, [error, t, toast]);

  if (!mounted || !user) {
    return null;
  }

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setCurrentQuery(searchQuery);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`, { scroll: false });
    await globalSearch(searchQuery);
  };

  const handleShowMoreUsers = () => {
    if (currentQuery) {
      router.push(`/search/users?q=${encodeURIComponent(currentQuery)}`);
    }
  };

  const handleShowMoreBooks = () => {
    if (currentQuery) {
      router.push(`/search/books?q=${encodeURIComponent(currentQuery)}`);
    }
  };

  const handleShowMoreReviews = () => {
    if (currentQuery) {
      router.push(`/search/reviews?q=${encodeURIComponent(currentQuery)}`);
    }
  };

  const displayResults =
    usersResults || booksResults || reviewsResults
      ? {
          users: usersResults?.data || [],
          books: booksResults?.data || [],
          reviews: reviewsResults?.data || [],
        }
      : globalResults;

  return (
    <div className="container py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{t("search.title")}</h1>
        <div className="flex gap-2">
          <Input
            type="search"
            placeholder={t("search.placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(query);
              }
            }}
            className="flex-1 max-w-2xl"
          />
        </div>
      </header>

      {isSearching && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">{t("search.searching")}</p>
        </div>
      )}

      {!isSearching && displayResults && (
        <div className="space-y-8">
          <SearchSection
            title={t("search.users")}
            items={displayResults.users}
            renderItem={(user) => (
              <UserCard user={user} onClick={() => router.push(`/user/${user.id}`)} />
            )}
            onShowMore={handleShowMoreUsers}
            showMoreButton={globalResults !== null && displayResults.users.length > 0}
            emptyMessage={currentQuery ? t("search.noResults") : undefined}
          />

          <SearchSection
            title={t("search.books")}
            items={displayResults.books}
            renderItem={(book) => (
              <BookCard book={book} onClick={() => router.push(`/book/${book.id}`)} />
            )}
            onShowMore={handleShowMoreBooks}
            showMoreButton={globalResults !== null && displayResults.books.length > 0}
            emptyMessage={currentQuery ? t("search.noResults") : undefined}
          />

          <SearchSection
            title={t("search.reviews")}
            items={displayResults.reviews}
            renderItem={(review) => <ReviewCard review={review} onClick={() => {}} />}
            onShowMore={handleShowMoreReviews}
            showMoreButton={globalResults !== null && displayResults.reviews.length > 0}
            emptyMessage={currentQuery ? t("search.noResults") : undefined}
          />
        </div>
      )}

      {!isSearching && !displayResults && currentQuery && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">{t("search.noResults")}</p>
        </div>
      )}
    </div>
  );
}
