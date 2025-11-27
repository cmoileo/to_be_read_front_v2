"use client";

import { useState, useCallback, useTransition } from "react";
import type { User, Review, PaginatedResponse } from "@repo/types";
import { followUserAction, unfollowUserAction, getUserReviewsAction } from "@/app/user/[userId]/actions";

interface UseUserProfileViewModelProps {
  initialUser: User;
  initialReviewsResponse: PaginatedResponse<Review>;
}

export const useUserProfileViewModel = ({
  initialUser,
  initialReviewsResponse,
}: UseUserProfileViewModelProps) => {
  const [user, setUser] = useState<User>(initialUser);
  const [reviews, setReviews] = useState<Review[]>(initialReviewsResponse.data);
  const [currentPage, setCurrentPage] = useState(initialReviewsResponse.meta.currentPage);
  const [hasMore, setHasMore] = useState(
    initialReviewsResponse.meta.currentPage < initialReviewsResponse.meta.lastPage
  );
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isFollowLoading, startFollowTransition] = useTransition();

  const handleFollow = useCallback(() => {
    startFollowTransition(async () => {
      try {
        // Optimistic update
        setUser((prev) => ({
          ...prev,
          isFollowing: true,
          followersCount: prev.followersCount + 1,
        }));

        await followUserAction(user.id);
      } catch (error) {
        // Rollback on error
        setUser((prev) => ({
          ...prev,
          isFollowing: false,
          followersCount: prev.followersCount - 1,
        }));
        console.error("Failed to follow user:", error);
      }
    });
  }, [user.id]);

  const handleUnfollow = useCallback(() => {
    startFollowTransition(async () => {
      try {
        // Optimistic update
        setUser((prev) => ({
          ...prev,
          isFollowing: false,
          followersCount: prev.followersCount - 1,
        }));

        await unfollowUserAction(user.id);
      } catch (error) {
        // Rollback on error
        setUser((prev) => ({
          ...prev,
          isFollowing: true,
          followersCount: prev.followersCount + 1,
        }));
        console.error("Failed to unfollow user:", error);
      }
    });
  }, [user.id]);

  const handleLoadMore = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await getUserReviewsAction(user.id, nextPage);

      setReviews((prev) => [...prev, ...response.data]);
      setCurrentPage(response.meta.currentPage);
      setHasMore(response.meta.currentPage < response.meta.lastPage);
    } catch (error) {
      console.error("Failed to load more reviews:", error);
    } finally {
      setIsFetchingMore(false);
    }
  }, [currentPage, hasMore, isFetchingMore, user.id]);

  return {
    user,
    reviews,
    isLoading: false,
    hasMore,
    isFetchingMore,
    isFollowLoading,
    handleFollow,
    handleUnfollow,
    handleLoadMore,
  };
};
