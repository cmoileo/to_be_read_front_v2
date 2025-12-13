import { useEffect } from "react";
import { useMutation, useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { MobileProfileService, type UpdateProfileData } from "../services/mobile-profile.service";
import { useNavigate } from "@tanstack/react-router";
import {
  queryKeys,
  getConnectedUser,
  setConnectedUser,
  updateReviewsCount,
} from "@repo/stores";

export const useProfileViewModel = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = getConnectedUser(queryClient);

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: queryKeys.connectedUser.profile(),
    queryFn: () => MobileProfileService.getMyProfile(),
    enabled: true,
  });

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingReviews,
  } = useInfiniteQuery({
    queryKey: queryKeys.myReviews(user?.id),
    queryFn: ({ pageParam = 1 }) => MobileProfileService.getMyReviews(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage < lastPage.meta.lastPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!user?.id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => MobileProfileService.updateProfile(data),
    onSuccess: ({ user: updatedUser }) => {
      setConnectedUser(queryClient, updatedUser);
    },
  });

  useEffect(() => {
    if (profileData?.user) {
      setConnectedUser(queryClient, profileData.user);
    }
  }, [profileData, queryClient]);

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
      await queryClient.cancelQueries({ queryKey: queryKeys.myReviews(user?.id) });

      const previousData = queryClient.getQueryData(queryKeys.myReviews(user?.id));
      const previousUser = user;

      queryClient.setQueryData(queryKeys.myReviews(user?.id), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((review: any) => review.id !== reviewId),
          })),
        };
      });

      updateReviewsCount(queryClient, -1);

      return { previousData, previousUser };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.myReviews(user?.id), context.previousData);
      }
      if (context?.previousUser) {
        setConnectedUser(queryClient, context.previousUser);
      }
    },
  });

  const handleDeleteReview = (reviewId: number) => {
    deleteMutation.mutate(reviewId);
  };

  const allReviews = reviewsData?.pages.flatMap((page) => page.data) ?? [];

  return {
    user,
    userId: user?.id ?? null,
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
