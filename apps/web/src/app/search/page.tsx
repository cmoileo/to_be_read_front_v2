"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Input,
  UserCard,
  BookCard,
  ReviewCard,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  useTranslation,
  useToast,
  Skeleton,
  Users,
  BookOpen,
  MessageCircle,
} from "@repo/ui";
import { useSearchViewModel } from "../../viewmodels/use-search-viewmodel";

type SearchTab = "users" | "books" | "reviews";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { toast } = useToast();

  const initialQuery = searchParams.get("q") || "";
  const initialTab = (searchParams.get("tab") as SearchTab) || "books";
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [currentQuery, setCurrentQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>(initialTab);

  const {
    usersResults,
    booksResults,
    reviewsResults,
    isLoadingUsers,
    isLoadingBooks,
    isLoadingReviews,
    error,
    searchUsers,
    searchBooks,
    searchReviews,
  } = useSearchViewModel();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() && query !== currentQuery) {
        setCurrentQuery(query);
        router.push(`/search?q=${encodeURIComponent(query)}&tab=${activeTab}`, { scroll: false });
        executeSearch(query, activeTab);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, mounted, activeTab]);

  useEffect(() => {
    if (mounted && initialQuery && !currentQuery) {
      setCurrentQuery(initialQuery);
      executeSearch(initialQuery, activeTab);
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

  if (!mounted) {
    return null;
  }

  const executeSearch = async (searchQuery: string, tab: SearchTab) => {
    if (!searchQuery.trim()) return;
    
    switch (tab) {
      case "users":
        await searchUsers({ q: searchQuery, page: 1 });
        break;
      case "books":
        await searchBooks({ q: searchQuery, page: 1 });
        break;
      case "reviews":
        await searchReviews({ q: searchQuery, page: 1 });
        break;
    }
  };

  const handleTabChange = async (tab: string) => {
    const newTab = tab as SearchTab;
    setActiveTab(newTab);
    if (currentQuery) {
      router.push(`/search?q=${encodeURIComponent(currentQuery)}&tab=${newTab}`, { scroll: false });
      await executeSearch(currentQuery, newTab);
    }
  };

  const handleLoadMore = async (tab: SearchTab, currentPage: number) => {
    if (!currentQuery) return;
    switch (tab) {
      case "users":
        await searchUsers({ q: currentQuery, page: currentPage + 1 }, true);
        break;
      case "books":
        await searchBooks({ q: currentQuery, page: currentPage + 1 }, true);
        break;
      case "reviews":
        await searchReviews({ q: currentQuery, page: currentPage + 1 }, true);
        break;
    }
  };

  const isLoading = isLoadingUsers || isLoadingBooks || isLoadingReviews;

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 items-start p-4 rounded-lg border">
          <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{t("search.title")}</h1>
        <Input
          type="search"
          placeholder={t("search.placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
      </header>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="books" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">{t("search.books")}</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">{t("search.users")}</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{t("search.reviews")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          {isLoadingUsers && renderSkeleton()}
          {!isLoadingUsers && usersResults && (
            <div className="space-y-4">
              {usersResults.data.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t("search.noResults")}</p>
              ) : (
                <>
                  {usersResults.data.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onClick={() => router.push(`/user/${user.id}`)}
                    />
                  ))}
                  {usersResults.meta.currentPage < usersResults.meta.lastPage && (
                    <button
                      onClick={() => handleLoadMore("users", usersResults.meta.currentPage)}
                      className="w-full py-3 text-primary hover:text-primary/80 font-medium"
                    >
                      {t("search.showMore")}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          {!isLoadingUsers && !usersResults && currentQuery && (
            <p className="text-center text-muted-foreground py-8">{t("search.noResults")}</p>
          )}
        </TabsContent>

        <TabsContent value="books">
          {isLoadingBooks && renderSkeleton()}
          {!isLoadingBooks && booksResults && (
            <div className="space-y-4">
              {booksResults.data.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t("search.noResults")}</p>
              ) : (
                <>
                  {booksResults.data.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onClick={() => router.push(`/book/${book.id}`)}
                    />
                  ))}
                  {booksResults.meta.currentPage < booksResults.meta.lastPage && (
                    <button
                      onClick={() => handleLoadMore("books", booksResults.meta.currentPage)}
                      className="w-full py-3 text-primary hover:text-primary/80 font-medium"
                    >
                      {t("search.showMore")}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          {!isLoadingBooks && !booksResults && currentQuery && (
            <p className="text-center text-muted-foreground py-8">{t("search.noResults")}</p>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          {isLoadingReviews && renderSkeleton()}
          {!isLoadingReviews && reviewsResults && (
            <div className="space-y-4">
              {reviewsResults.data.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t("search.noResults")}</p>
              ) : (
                <>
                  {reviewsResults.data.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onClick={() => router.push(`/review/${review.id}`)}
                    />
                  ))}
                  {reviewsResults.meta.currentPage < reviewsResults.meta.lastPage && (
                    <button
                      onClick={() => handleLoadMore("reviews", reviewsResults.meta.currentPage)}
                      className="w-full py-3 text-primary hover:text-primary/80 font-medium"
                    >
                      {t("search.showMore")}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          {!isLoadingReviews && !reviewsResults && currentQuery && (
            <p className="text-center text-muted-foreground py-8">{t("search.noResults")}</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
