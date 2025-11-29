import { createFileRoute, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { BottomNav, FeedScreen, useTranslation, Home, Search, PenSquare, User } from "@repo/ui";
import { MobileStorage } from "../services/mobile-storage.service";
import { useFeedViewModel } from "../viewmodels/use-feed-viewmodel";
import { useNotificationRegistration } from "../hooks/use-notification-registration";

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

  useNotificationRegistration();

  const {
    reviews,
    isLoading,
    hasMore,
    isFetchingMore,
    isRefreshing,
    handleLoadMore,
    handleLike,
    handleRefresh,
  } = useFeedViewModel();

  const navItems = [
    {
      label: t("navigation.home"),
      icon: <Home className="w-6 h-6" />,
      href: "/",
      isActive: currentPath === "/",
    },
    {
      label: t("navigation.search"),
      icon: <Search className="w-6 h-6" />,
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
          isRefreshing={isRefreshing}
          onLoadMore={handleLoadMore}
          onLike={handleLike}
          onAuthorClick={handleAuthorClick}
          onReviewClick={handleReviewClick}
          onRefresh={handleRefresh}
        />
      </div>

      <BottomNav items={navItems} onNavigate={handleNavigate} />
    </div>
  );
}
