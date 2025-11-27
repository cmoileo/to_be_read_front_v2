import { createFileRoute, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { BottomNav, FeedScreen, useTranslation } from "@repo/ui";
import { MobileStorage } from "../services/mobile-storage.service";
import { useFeedViewModel } from "../viewmodels/use-feed-viewmodel";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const {
    reviews,
    isLoading,
    hasMore,
    isFetchingMore,
    handleLoadMore,
    handleLike,
  } = useFeedViewModel();

  const navItems = [
    {
      label: t("navigation.home"),
      icon: "🏠",
      href: "/",
      isActive: currentPath === "/",
    },
    {
      label: t("navigation.search"),
      icon: "🔍",
      href: "/search",
      isActive: currentPath === "/search",
    },
    {
      label: t("navigation.createReview"),
      icon: "✍️",
      href: "/create-review",
      isActive: currentPath === "/create-review",
    },
    {
      label: t("navigation.profile"),
      icon: "👤",
      href: "/profile",
      isActive: currentPath === "/profile",
    },
  ];

  const handleNavigate = (href: string) => {
    navigate({ to: href });
  };

  const handleAuthorClick = (authorId: number) => {
    navigate({ to: `/user/${authorId}` });
  };

  const handleReviewClick = (reviewId: number) => {
    navigate({ to: `/review/${reviewId}` });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 p-4 pb-20">
        <FeedScreen
          reviews={reviews}
          isLoading={isLoading}
          hasMore={hasMore}
          isFetchingMore={isFetchingMore}
          onLoadMore={handleLoadMore}
          onLike={handleLike}
          onAuthorClick={handleAuthorClick}
          onReviewClick={handleReviewClick}
        />
      </div>

      <BottomNav items={navItems} onNavigate={handleNavigate} />
    </div>
  );
}
