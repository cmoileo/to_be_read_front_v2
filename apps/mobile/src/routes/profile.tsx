import { useState } from "react";
import { createFileRoute, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { MobileStorage } from "../services/mobile-storage.service";
import { BottomNav, useTranslation, ProfileScreen } from "@repo/ui";
import { useProfileViewModel } from "../viewmodels/use-profile-viewmodel";

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

  const {
    user,
    reviews,
    isLoading,
    hasMore,
    isUpdating,
    handleUpdateProfile,
    handleLoadMore,
    handleReviewClick,
  } = useProfileViewModel();

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
      href: "/review",
      isActive: currentPath === "/review",
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

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 p-6 pb-20">
        <ProfileScreen
          user={user}
          reviews={reviews}
          isOwnProfile={true}
          isLoading={isLoading}
          hasMore={hasMore}
          isEditDialogOpen={isEditDialogOpen}
          isUpdating={isUpdating}
          onEdit={() => setIsEditDialogOpen(true)}
          onCloseEditDialog={() => setIsEditDialogOpen(false)}
          onUpdateProfile={handleUpdateProfile}
          onLoadMore={handleLoadMore}
          onReviewClick={handleReviewClick}
        />
      </div>

      <BottomNav items={navItems} onNavigate={handleNavigate} />
    </div>
  );
}
