"use client";

import { useState } from "react";
import { ProfileScreen } from "@repo/ui";
import { useProfileViewModel } from "@/viewmodels/use-profile-viewmodel";
import type { User, Review } from "@repo/types";

interface ProfileClientProps {
  initialUser: User | null;
  initialReviewsResponse: any;
}

export default function ProfileClient({ initialUser, initialReviewsResponse }: ProfileClientProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    user,
    reviews,
    isLoading,
    hasMore,
    isFetchingMore,
    handleUpdateProfile,
    handleLoadMore,
  } = useProfileViewModel({ initialUser, initialReviewsResponse });

  if (!user) {
    return null;
  }

  return (
    <ProfileScreen
      user={user}
      reviews={reviews}
      isLoading={isLoading}
      isEditDialogOpen={isEditOpen}
      hasMore={hasMore}
      isFetchingMore={isFetchingMore}
      onEdit={() => setIsEditOpen(true)}
      onCloseEditDialog={() => setIsEditOpen(false)}
      onUpdateProfile={handleUpdateProfile}
      onLoadMore={handleLoadMore}
      onReviewClick={(reviewId) => {
        console.log("Review pressed:", reviewId);
      }}
      isOwnProfile={true}
    />
  );
}
