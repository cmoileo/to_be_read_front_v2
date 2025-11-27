import { useState, useEffect } from "react";
import { useMutation, useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { MobileProfileService, type UpdateProfileData } from "../services/mobile-profile.service";
import { useAuthModel } from "../models/hooks/use-auth-model";
import { useNavigate } from "@tanstack/react-router";

export const useProfileViewModel = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    navigate({ to: "/review/$reviewId", params: { reviewId: String(reviewId) } });
  };

  const deleteMutation = useMutation({
    mutationFn: (reviewId: number) => MobileProfileService.deleteReview(reviewId),
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({ queryKey: ["myReviews", currentUser?.id] });
      
      const previousData = queryClient.getQueryData(["myReviews", currentUser?.id]);
      
      queryClient.setQueryData(["myReviews", currentUser?.id], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((review: any) => review.id !== reviewId),
          })),
        };
      });

      // Also update reviewsCount in user state
      setUser((prevUser: any) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          reviewsCount: Math.max(0, (prevUser.reviewsCount || 0) - 1),
        };
      });

      return { previousData, previousUser: user };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["myReviews", currentUser?.id], context.previousData);
      }
      if (context?.previousUser) {
        setUser(context.previousUser);
      }
    },
  });

  const handleDeleteReview = (reviewId: number) => {
    deleteMutation.mutate(reviewId);
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
    handleDeleteReview,
  };
};
