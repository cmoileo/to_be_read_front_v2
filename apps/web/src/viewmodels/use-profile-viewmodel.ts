import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { User, Review } from "@repo/types";
import { getMyReviewsAction, updateProfileAction, deleteReviewAction } from "@/app/_profile/actions";
import { useConnectedUser, queryKeys } from "@repo/stores";

interface UseProfileViewModelProps {
  initialUser: User | null;
  initialReviewsResponse: any;
}

export function useProfileViewModel({ initialUser, initialReviewsResponse }: UseProfileViewModelProps) {
  const { user, setUser, updateUser } = useConnectedUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: reviewsData, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: queryKeys.myReviews(user?.id),
    queryFn: async ({ pageParam = 1 }) => {
      return getMyReviewsAction(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage < lastPage.meta.lastPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    initialData: initialReviewsResponse ? {
      pages: [initialReviewsResponse],
      pageParams: [1],
    } : undefined,
  });

  const reviews = reviewsData?.pages.flatMap((page) => page.data) || [];

  const updateProfileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return updateProfileAction(formData);
    },
    onSuccess: (response) => {
      setUser(response.user);
    },
  });

  const handleUpdateProfile = async (data: any) => {
    try {
      const formData = new FormData();
      
      if (data.userName) formData.append("userName", data.userName);
      if (data.biography) formData.append("biography", data.biography);
      if (data.locale) formData.append("locale", data.locale);
      if (data.avatar) formData.append("avatar", data.avatar);
      
      await updateProfileMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleReviewClick = (reviewId: number) => {
    router.push(`/review/${reviewId}`);
  };

  const deleteMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      return deleteReviewAction(reviewId);
    },
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

      updateUser({
        reviewsCount: Math.max(0, (Number(user?.reviewsCount) || 0) - 1),
      });

      return { previousData, previousUser };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.myReviews(user?.id), context.previousData);
      }
      if (context?.previousUser) {
        setUser(context.previousUser);
      }
    },
  });

  const handleDeleteReview = (reviewId: number) => {
    deleteMutation.mutate(reviewId);
  };

  return {
    user,
    reviews,
    isLoading: false,
    hasMore: hasNextPage || false,
    isFetchingMore: isFetchingNextPage,
    handleUpdateProfile,
    handleLoadMore,
    handleReviewClick,
    handleDeleteReview,
  };
}
