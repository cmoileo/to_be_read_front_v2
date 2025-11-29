"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileScreen, AuthPromptDialog, type AuthPromptType } from "@repo/ui";
import { useAuthContext } from "@/models/hooks/use-auth-context";
import { useUserProfileViewModel } from "@/viewmodels/use-user-profile-viewmodel";
import type { User, Review, PaginatedResponse } from "@repo/types";

interface UserProfileClientProps {
  initialUser: User;
  initialReviewsResponse: PaginatedResponse<Review>;
}

export default function UserProfileClient({
  initialUser,
  initialReviewsResponse,
}: UserProfileClientProps) {
  const router = useRouter();
  const { user: currentUser } = useAuthContext();
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authPromptType, setAuthPromptType] = useState<AuthPromptType>("follow");

  const {
    user,
    reviews,
    isLoading,
    hasMore,
    isFetchingMore,
    isFollowLoading,
    handleFollow,
    handleUnfollow,
    handleLoadMore,
  } = useUserProfileViewModel({ initialUser, initialReviewsResponse });

  const showAuthPrompt = (type: AuthPromptType) => {
    setAuthPromptType(type);
    setAuthPromptOpen(true);
  };

  const handleBack = () => {
    router.back();
  };

  const handleReviewClick = (reviewId: number) => {
    router.push(`/review/${reviewId}`);
  };

  const handleFollowersClick = () => {
    router.push(`/user/${user.id}/followers`);
  };

  const handleFollowingClick = () => {
    router.push(`/user/${user.id}/following`);
  };

  const handleFollowWithAuth = () => {
    if (!currentUser) {
      showAuthPrompt("follow");
      return;
    }
    handleFollow();
  };

  const handleUnfollowWithAuth = () => {
    if (!currentUser) {
      showAuthPrompt("follow");
      return;
    }
    handleUnfollow();
  };

  return (
    <>
      <ProfileScreen
        user={user}
        reviews={reviews}
        isLoading={isLoading}
        hasMore={hasMore}
        isFetchingMore={isFetchingMore}
        isOwnProfile={user.isMe ?? false}
        showBackButton={true}
        isFollowLoading={isFollowLoading}
        onBack={handleBack}
        onFollow={handleFollowWithAuth}
        onUnfollow={handleUnfollowWithAuth}
        onLoadMore={handleLoadMore}
        onReviewClick={handleReviewClick}
        onFollowersClick={handleFollowersClick}
        onFollowingClick={handleFollowingClick}
      />
      <AuthPromptDialog
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
        promptType={authPromptType}
        onLogin={() => router.push("/login")}
        onRegister={() => router.push("/register")}
      />
    </>
  );
}
