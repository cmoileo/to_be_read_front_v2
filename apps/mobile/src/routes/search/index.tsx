import { useState, useEffect } from "react";
import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouterState,
  useSearch,
} from "@tanstack/react-router";
import { MobileStorage } from "../../services/mobile-storage.service";
import {
  BottomNav,
  Input,
  UserCard,
  BookCard,
  ReviewCard,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Skeleton,
  useTranslation,
  useToast,
  Home,
  Search as SearchIcon,
  PenSquare,
  User,
  Button,
  Users,
  BookOpen,
  MessageCircle,
} from "@repo/ui";
import { useSearchViewModel } from "../../viewmodels/use-search-viewmodel";

type SearchTab = "users" | "books" | "reviews";

export const Route = createFileRoute("/search/")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: (search.q as string) || "",
      tab: (search.tab as SearchTab) || "users",
    };
  },
});

function SearchPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { q: initialQuery, tab: initialTab } = useSearch({ from: "/search/" });

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
    if (initialQuery) {
      executeSearch(initialQuery, activeTab);
    }
  }, [initialQuery, activeTab]);

  useEffect(() => {
    if (error) {
      toast({
        title: t("common.error"),
        description: t(error),
        variant: "destructive",
      });
    }
  }, [error, t, toast]);

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

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setCurrentQuery(searchQuery);
    navigate({ to: "/search", search: { q: searchQuery, tab: activeTab }, replace: true });
    await executeSearch(searchQuery, activeTab);
  };

  const handleTabChange = async (tab: string) => {
    const newTab = tab as SearchTab;
    setActiveTab(newTab);
    if (currentQuery) {
      navigate({ to: "/search", search: { q: currentQuery, tab: newTab }, replace: true });
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

  const navItems = [
    {
      label: t("navigation.home"),
      icon: <Home className="w-6 h-6" />,
      href: "/",
      isActive: currentPath === "/",
    },
    {
      label: t("navigation.search"),
      icon: <SearchIcon className="w-6 h-6" />,
      href: "/search",
      isActive: currentPath === "/search" || currentPath.startsWith("/search/"),
    },
    {
      label: t("navigation.createReview"),
      icon: <PenSquare className="w-6 h-6" />,
      href: "/create-review",
      isActive: currentPath === "/create-review",
    },
    {
      label: t("navigation.profile"),
      icon: <User className="w-6 h-6" />,
      href: "/profile",
      isActive: currentPath === "/profile",
    },
  ];

  const handleNavigate = (href: string) => {
    navigate({ to: href });
  };

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
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 p-4 pb-20">
        <header className="mb-4">
          <h1 className="text-2xl font-bold mb-4">{t("search.title")}</h1>
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
              className="flex-1"
            />
            <Button
              type="button"
              size="icon"
              onClick={() => handleSearch(query)}
              disabled={isLoadingUsers || isLoadingBooks || isLoadingReviews || !query.trim()}
              aria-label={t("search.title")}
            >
              <SearchIcon className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="users" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              <span>{t("search.users")}</span>
            </TabsTrigger>
            <TabsTrigger value="books" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <BookOpen className="w-4 h-4" />
              <span>{t("search.books")}</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <MessageCircle className="w-4 h-4" />
              <span>{t("search.reviews")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            {isLoadingUsers && renderSkeleton()}
            {!isLoadingUsers && usersResults && (
              <div className="space-y-3">
                {usersResults.data.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t("search.noResults")}</p>
                ) : (
                  <>
                    {usersResults.data.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        onClick={() => navigate({ to: `/user/${user.id}` })}
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
              <div className="space-y-3">
                {booksResults.data.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t("search.noResults")}</p>
                ) : (
                  <>
                    {booksResults.data.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onClick={() => navigate({ to: "/book/$bookId", params: { bookId: book.id } })}
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
              <div className="space-y-3">
                {reviewsResults.data.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t("search.noResults")}</p>
                ) : (
                  <>
                    {reviewsResults.data.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onClick={() => navigate({ to: `/review/${review.id}` })}
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

      <BottomNav items={navItems} onNavigate={handleNavigate} />
    </div>
  );
}
