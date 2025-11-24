import { useState } from "react";
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import type { User, Review } from "@repo/types";
import { getMyReviewsAction, updateProfileAction } from "@/app/_profile/actions";

interface UseProfileViewModelProps {
  initialUser: User | null;
  initialReviewsResponse: any;
}

export function useProfileViewModel({ initialUser, initialReviewsResponse }: UseProfileViewModelProps) {
  const [user, setUser] = useState<User | null>(initialUser);

  const { data: reviewsData, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["my-reviews"],
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

  return {
    user,
    reviews,
    isLoading: false,
    hasMore: hasNextPage || false,
    isFetchingMore: isFetchingNextPage,
    handleUpdateProfile,
    handleLoadMore,
  };
}
