"use client";

import { useRouter } from "next/navigation";
import { ProfileScreen } from "@repo/ui";
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

  const handleBack = () => {
    router.back();
  };

  const handleReviewClick = (reviewId: number) => {
    router.push(`/review/${reviewId}`);
  };

  return (
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
      onFollow={handleFollow}
      onUnfollow={handleUnfollow}
      onLoadMore={handleLoadMore}
      onReviewClick={handleReviewClick}
    />
  );
}
