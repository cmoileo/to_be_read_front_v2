"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@repo/api-client";
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
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [query, setQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");

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
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setCurrentQuery(searchQuery);
    await globalSearch(searchQuery);
  };

  const handleShowMoreUsers = async () => {
    if (currentQuery) {
      await searchUsers({ q: currentQuery, page: 1, limit: 20 });
    }
  };

  const handleShowMoreBooks = async () => {
    if (currentQuery) {
      await searchBooks({ q: currentQuery, page: 1, limit: 20 });
    }
  };

  const handleShowMoreReviews = async () => {
    if (currentQuery) {
      await searchReviews({ q: currentQuery, page: 1, limit: 20 });
    }
  };

  if (error) {
    toast({
      title: t("common.error"),
      description: t(error),
      variant: "destructive",
    });
  }

  const displayResults =
    usersResults || booksResults || reviewsResults
      ? {
          users: usersResults?.data || [],
          books: booksResults?.items || [],
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
        <div className="space-y-8 max-w-4xl">
          <SearchSection
            title={t("search.users")}
            items={displayResults.users}
            renderItem={(user) => (
              <UserCard user={user} onClick={() => router.push(`/profile/${user.id}`)} />
            )}
            onShowMore={handleShowMoreUsers}
            showMoreButton={!usersResults && displayResults.users.length > 0}
            emptyMessage={currentQuery ? t("search.noResults") : undefined}
          />

          <SearchSection
            title={t("search.books")}
            items={displayResults.books}
            renderItem={(book) => <BookCard book={book} onClick={() => {}} />}
            onShowMore={handleShowMoreBooks}
            showMoreButton={!booksResults && displayResults.books.length > 0}
            emptyMessage={currentQuery ? t("search.noResults") : undefined}
          />

          <SearchSection
            title={t("search.reviews")}
            items={displayResults.reviews}
            renderItem={(review) => <ReviewCard review={review} onClick={() => {}} />}
            onShowMore={handleShowMoreReviews}
            showMoreButton={!reviewsResults && displayResults.reviews.length > 0}
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
