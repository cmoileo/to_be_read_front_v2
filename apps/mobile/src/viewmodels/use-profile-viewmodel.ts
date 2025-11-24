import { useState, useEffect } from "react";
import { useMutation, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { MobileProfileService, type UpdateProfileData } from "../services/mobile-profile.service";
import { useAuthModel } from "../models/hooks/use-auth-model";

export const useProfileViewModel = () => {
  const { user: currentUser } = useAuthModel();
  const [user, setUser] = useState<any>(null);

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", currentUser?.id],
    queryFn: () => MobileProfileService.getMyProfile(),
    enabled: !!currentUser?.id,
  });

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingReviews,
  } = useInfiniteQuery({
    queryKey: ["myReviews", currentUser?.id],
    queryFn: ({ pageParam = 1 }) => MobileProfileService.getMyReviews(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage < lastPage.meta.lastPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!currentUser?.id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => MobileProfileService.updateProfile(data),
    onSuccess: ({ user: updatedUser }) => {
      setUser(updatedUser);
    },
  });

  useEffect(() => {
    if (profileData?.user) {
      setUser(profileData.user);
    }
  }, [profileData]);

  const handleUpdateProfile = (data: UpdateProfileData) => {
    updateMutation.mutate(data);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleReviewClick = (reviewId: number) => {
    console.log(`Navigate to review ${reviewId}`);
  };

  const allReviews = reviewsData?.pages.flatMap((page) => page.data) ?? [];

  return {
    user,
    reviews: allReviews,
    isLoading: isLoadingProfile || isLoadingReviews,
    hasMore: hasNextPage,
    isFetchingMore: isFetchingNextPage,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    handleUpdateProfile,
    handleLoadMore,
    handleReviewClick,
  };
};
