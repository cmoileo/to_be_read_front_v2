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
  SearchSection,
  useTranslation,
  useToast,
  Home,
  Search as SearchIcon,
  PenSquare,
  User,
} from "@repo/ui";
import { useSearchViewModel } from "../../viewmodels/use-search-viewmodel";

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
    };
  },
});

function SearchPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { q: initialQuery } = useSearch({ from: "/search/" });

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
  } = useSearchViewModel();

  useEffect(() => {
    if (initialQuery && !globalResults) {
      globalSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setCurrentQuery(searchQuery);
    navigate({ to: "/search", search: { q: searchQuery }, replace: true });
    await globalSearch(searchQuery);
  };

  const handleShowMoreUsers = () => {
    if (currentQuery) {
      navigate({ to: "/search/users", search: { q: currentQuery } });
    }
  };

  const handleShowMoreBooks = () => {
    if (currentQuery) {
      navigate({ to: "/search/books", search: { q: currentQuery } });
    }
  };

  const handleShowMoreReviews = () => {
    if (currentQuery) {
      navigate({ to: "/search/reviews", search: { q: currentQuery } });
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
      isActive: currentPath === "/search",
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
          books: booksResults?.data || [],
          reviews: reviewsResults?.data || [],
        }
      : globalResults;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 p-6 pb-20">
        <header className="mb-6">
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
          </div>
        </header>

        {isSearching && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t("search.searching")}</p>
          </div>
        )}

        {!isSearching && displayResults && (
          <div className="space-y-8">
            <SearchSection
              title={t("search.users")}
              items={displayResults.users}
              renderItem={(user) => (
                <UserCard user={user} onClick={() => navigate({ to: `/user/${user.id}` })} />
              )}
              onShowMore={handleShowMoreUsers}
              showMoreButton={globalResults !== null && displayResults.users.length > 0}
              emptyMessage={currentQuery ? t("search.noResults") : undefined}
            />

            <SearchSection
              title={t("search.books")}
              items={displayResults.books}
              renderItem={(book) => (
                <BookCard
                  book={book}
                  onClick={() => navigate({ to: "/book/$bookId", params: { bookId: book.id } })}
                />
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
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t("search.noResults")}</p>
          </div>
        )}
      </div>

      <BottomNav items={navItems} onNavigate={handleNavigate} />
    </div>
  );
}
