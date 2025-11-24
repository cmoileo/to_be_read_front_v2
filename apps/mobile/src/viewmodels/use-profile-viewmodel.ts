import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { MobileProfileService, type UpdateProfileData } from "../services/mobile-profile.service";
import {
  type ProfileState,
  getInitialProfileState,
  setProfileUser,
  setProfileReviews,
  setProfileLoading,
  setProfilePagination,
} from "../models/profile.model";
import { useAuthModel } from "../models/hooks/use-auth-model";

export const useProfileViewModel = () => {
  const { user: currentUser } = useAuthModel();
  const [profileState, setProfileState] = useState<ProfileState>(getInitialProfileState());

  const loadProfile = async () => {
    if (!currentUser?.id) return;
    
    setProfileState((prev) => setProfileLoading(prev, true));
    
    try {
      const { user } = await MobileProfileService.getMyProfile();
      setProfileState((prev) => setProfileUser(prev, user));
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setProfileState((prev) => setProfileLoading(prev, false));
    }
  };

  const loadReviews = async (page: number = 1) => {
    if (!currentUser?.id) return;
    
    setProfileState((prev) => setProfileLoading(prev, true));
    
    try {
      const response = await MobileProfileService.getMyReviews(page);
      const append = page > 1;
      
      setProfileState((prev) => {
        let newState = setProfileReviews(prev, response.data, append);
        newState = setProfilePagination(
          newState,
          response.meta.currentPage,
          response.meta.currentPage < response.meta.lastPage
        );
        return newState;
      });
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setProfileState((prev) => setProfileLoading(prev, false));
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => MobileProfileService.updateProfile(data),
    onSuccess: ({ user }) => {
      setProfileState((prev) => setProfileUser(prev, user));
    },
  });

  const handleUpdateProfile = (data: UpdateProfileData) => {
    updateMutation.mutate(data);
  };

  const handleLoadMore = () => {
    if (!profileState.isLoading && profileState.hasMore) {
      loadReviews(profileState.currentPage + 1);
    }
  };

  const handleReviewClick = (reviewId: number) => {
    console.log(`Navigate to review ${reviewId}`);
  };

  useEffect(() => {
    loadProfile();
    loadReviews();
  }, [currentUser?.id]);

  return {
    user: profileState.user,
    reviews: profileState.reviews,
    isLoading: profileState.isLoading,
    hasMore: profileState.hasMore,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    handleUpdateProfile,
    handleLoadMore,
    handleReviewClick,
    refetch: () => {
      loadProfile();
      loadReviews();
    },
  };
};
