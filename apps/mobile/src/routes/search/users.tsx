import { useState, useEffect } from "react";
import { createFileRoute, redirect, useNavigate, useSearch } from "@tanstack/react-router";
import { MobileStorage } from "../../services/mobile-storage.service";
import { Button, UserCard, useTranslation } from "@repo/ui";
import { useSearchViewModel } from "../../viewmodels/use-search-viewmodel";

export const Route = createFileRoute("/search/users")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: SearchUsersPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: (search.q as string) || "",
    };
  },
});

function SearchUsersPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { q } = useSearch({ from: "/search/users" });

  const [currentPage, setCurrentPage] = useState(1);
  const { usersResults, isLoadingUsers, searchUsers } = useSearchViewModel();

  useEffect(() => {
    if (q && currentPage === 1) {
      searchUsers({ q, page: 1, limit: 20 }, false);
    }
  }, [q]);

  useEffect(() => {
    if (q && currentPage > 1) {
      searchUsers({ q, page: currentPage, limit: 20 }, true);
    }
  }, [currentPage]);

  const handleLoadMore = () => {
    if (usersResults?.meta?.lastPage && currentPage < usersResults.meta.lastPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const hasMore = usersResults?.meta?.lastPage && currentPage < usersResults.meta.lastPage;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 p-6">
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              ← {t("common.back")}
            </Button>
          </div>
          <h1 className="text-2xl font-bold">{t("search.users")}</h1>
          <p className="text-muted-foreground mt-1">
            {usersResults?.meta?.total || 0} {t("search.results")}
          </p>
        </header>

        {isLoadingUsers && currentPage === 1 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t("common.loading")}</p>
          </div>
        )}

        {usersResults && (
          <div className="space-y-3">
            {usersResults.data.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onClick={() => navigate({ to: `/profile/${user.id}` })}
              />
            ))}

            {hasMore && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLoadMore}
                disabled={isLoadingUsers}
              >
                {isLoadingUsers ? t("common.loading") : t("common.loadMore")}
              </Button>
            )}

            {!hasMore && usersResults.data.length > 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">
                {t("search.noMoreResults")}
              </p>
            )}
          </div>
        )}

        {!isLoadingUsers && (!usersResults || usersResults.data.length === 0) && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t("search.noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
