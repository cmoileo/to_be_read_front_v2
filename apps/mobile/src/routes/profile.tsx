import { useState } from "react";
import { createFileRoute, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { MobileStorage } from "../services/mobile-storage.service";
import { BottomNav, useTranslation, ProfileScreen, Home, Search, PenSquare, User } from "@repo/ui";
import { useProfileViewModel } from "../viewmodels/use-profile-viewmodel";
import { usePlatform } from "../hooks/use-platform";
import { PageTransition } from "../components/page-transition";
import { ProfileHeaderSkeleton } from "../components/skeletons";

export const Route = createFileRoute("/profile")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { isMobile } = usePlatform();

  const {
    user,
    userId,
    reviews,
    isLoading,
    hasMore,
    isUpdating,
    handleUpdateProfile,
    handleLoadMore,
    handleReviewClick,
    handleDeleteReview,
  } = useProfileViewModel();

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

  const handleFollowersClick = () => {
    if (userId) {
      navigate({
        to: `/user/${userId}/followers`,
        search: { userName: user?.userName },
      });
    }
  };

  const handleFollowingClick = () => {
    if (userId) {
      navigate({
        to: `/user/${userId}/following`,
        search: { userName: user?.userName },
      });
    }
  };

  const handleReadingListClick = () => {
    navigate({ to: "/to-read-list" });
  };

  const handleSettingsClick = () => {
    navigate({ to: "/settings" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className={isMobile ? "pt-[env(safe-area-inset-top)]" : ""} />
      {isLoading && !user ? (
        <ProfileHeaderSkeleton />
      ) : (
        <PageTransition className="flex-1 pb-20">
          <ProfileScreen
            user={user}
            reviews={reviews}
            isOwnProfile={true}
            isLoading={false}
            hasMore={hasMore}
            isEditDialogOpen={isEditDialogOpen}
            isUpdating={isUpdating}
            onEdit={() => setIsEditDialogOpen(true)}
            onCloseEditDialog={() => setIsEditDialogOpen(false)}
            onUpdateProfile={handleUpdateProfile}
            onLoadMore={handleLoadMore}
            onReviewClick={handleReviewClick}
            onDeleteReview={handleDeleteReview}
            onFollowersClick={handleFollowersClick}
            onFollowingClick={handleFollowingClick}
            onReadingListClick={handleReadingListClick}
            onSettingsClick={handleSettingsClick}
          />
        </PageTransition>
      )}

      <BottomNav items={navItems} onNavigate={handleNavigate} />
    </div>
  );
}
