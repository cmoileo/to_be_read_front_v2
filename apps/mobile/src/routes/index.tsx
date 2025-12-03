import { createFileRoute, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { BottomNav, FeedScreen, useTranslation, Home, Search, PenSquare, User } from "@repo/ui";
import { Bell } from "lucide-react";
import { MobileStorage } from "../services/mobile-storage.service";
import { useFeedViewModel } from "../viewmodels/use-feed-viewmodel";
import { useNotificationRegistration } from "../hooks/use-notification-registration";
import { useUnreadNotificationCount } from "../viewmodels/use-notifications-viewmodel";
import { useSSENotifications } from "../hooks/use-sse-notifications";
import { useAuthModel } from "../models/hooks/use-auth-model";

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
  const { user } = useAuthModel();
  const unreadCount = useUnreadNotificationCount();

  useSSENotifications(user?.id);

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

  const handleCreateReview = () => {
    navigate({ to: "/create-review" });
  };

  const handleSearch = () => {
    navigate({ to: "/search" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Inkgora</h1>
        <button
          onClick={() => navigate({ to: "/notifications" })}
          className="relative p-2 hover:bg-accent rounded-full transition-colors"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </header>
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
          onCreateReview={handleCreateReview}
          onSearch={handleSearch}
        />
      </div>

      <BottomNav items={navItems} onNavigate={handleNavigate} />
    </div>
  );
}
