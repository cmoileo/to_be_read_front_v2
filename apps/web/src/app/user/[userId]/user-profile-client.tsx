"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileScreen, AuthPromptDialog, ReportDialog, type AuthPromptType } from "@repo/ui";
import { useConnectedUser } from "@repo/stores";
import { useUserProfileViewModel } from "@/viewmodels/use-user-profile-viewmodel";
import { useReportViewModel } from "@/viewmodels/use-report-viewmodel";
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
  const { user: currentUser } = useConnectedUser();
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authPromptType, setAuthPromptType] = useState<AuthPromptType>("follow");

  const {
    user,
    reviews,
    isLoading,
    hasMore,
    isFetchingMore,
    isFollowLoading,
    isBlockLoading,
    handleFollow,
    handleUnfollow,
    handleCancelRequest,
    handleLoadMore,
    handleBlock,
    handleUnblock,
  } = useUserProfileViewModel({ initialUser, initialReviewsResponse });

  const reportViewModel = useReportViewModel();

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

  const handleCancelRequestWithAuth = () => {
    if (!currentUser) {
      showAuthPrompt("follow");
      return;
    }
    handleCancelRequest();
  };

  const handleReportUser = (userId: number) => {
    if (!currentUser) {
      showAuthPrompt("follow");
      return;
    }
    reportViewModel.openReportDialog("user", userId);
  };

  const handleBlockWithAuth = (userId: number) => {
    if (!currentUser) {
      showAuthPrompt("follow");
      return;
    }
    handleBlock();
  };

  const handleUnblockWithAuth = (userId: number) => {
    if (!currentUser) {
      showAuthPrompt("follow");
      return;
    }
    handleUnblock();
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
        isBlockLoading={isBlockLoading}
        onBack={handleBack}
        onFollow={handleFollowWithAuth}
        onUnfollow={handleUnfollowWithAuth}
        onCancelRequest={handleCancelRequestWithAuth}
        onLoadMore={handleLoadMore}
        onReviewClick={handleReviewClick}
        onFollowersClick={handleFollowersClick}
        onFollowingClick={handleFollowingClick}
        onReportUser={handleReportUser}
        onBlockUser={handleBlockWithAuth}
        onUnblockUser={handleUnblockWithAuth}
      />
      <AuthPromptDialog
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
        promptType={authPromptType}
        onLogin={() => router.push("/login")}
        onRegister={() => router.push("/register")}
      />
      <ReportDialog
        open={reportViewModel.isOpen}
        onOpenChange={reportViewModel.closeReportDialog}
        entityType={reportViewModel.entityType}
        entityId={reportViewModel.entityId}
        onSubmit={reportViewModel.submitReport}
        isLoading={reportViewModel.isLoading}
      />
    </>
  );
}
