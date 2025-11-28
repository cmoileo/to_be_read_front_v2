import { createFileRoute, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { MobileStorage } from "../../services/mobile-storage.service";
import {
  BottomNav,
  ProfileScreen,
  useTranslation,
  Home,
  Search,
  PenSquare,
  User,
  ArrowLeft,
} from "@repo/ui";
import { useUserProfileViewModel } from "../../viewmodels/use-user-profile-viewmodel";

export const Route = createFileRoute("/user/$userId")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: UserProfilePage,
});

function UserProfilePage() {
  const { userId } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const userIdNumber = parseInt(userId, 10);

  const {
    user,
    reviews,
    isLoading,
    hasMore,
    isFetchingMore,
    handleFollow,
    handleUnfollow,
    handleLoadMore,
  } = useUserProfileViewModel(userIdNumber);

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

  const handleReviewClick = (reviewId: number) => {
    navigate({ to: `/review/${reviewId}` });
  };

  const handleBack = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 pb-20">
        <div className="p-4 border-b">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t("common.back")}</span>
          </button>
        </div>

        <div className="p-4">
          <ProfileScreen
            user={user}
            reviews={reviews}
            isOwnProfile={user?.isMe ?? false}
            isLoading={isLoading}
            hasMore={hasMore}
            isFetchingMore={isFetchingMore}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
            onLoadMore={handleLoadMore}
            onReviewClick={handleReviewClick}
          />
        </div>
      </div>

      <BottomNav items={navItems} onNavigate={handleNavigate} />
    </div>
  );
}
