"use client";

import { useState, useCallback, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User, Review, PaginatedResponse } from "@repo/types";
import {
  followUserAction,
  unfollowUserAction,
  getUserReviewsAction,
} from "@/app/user/[userId]/actions";
import { removeUserReviewsFromFeed, invalidateFeed, updateFollowingCount } from "@repo/stores";

interface UseUserProfileViewModelProps {
  initialUser: User;
  initialReviewsResponse: PaginatedResponse<Review>;
}

export const useUserProfileViewModel = ({
  initialUser,
  initialReviewsResponse,
}: UseUserProfileViewModelProps) => {
  const queryClient = useQueryClient();
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
        setUser((prev) => ({
          ...prev,
          isFollowing: true,
          followersCount: (Number(prev.followersCount) || 0) + 1,
        }));
        updateFollowingCount(queryClient, 1);

        await followUserAction(user.id);
        // Invalidate feed to include the new user's reviews
        invalidateFeed(queryClient);
      } catch (error) {
        setUser((prev) => ({
          ...prev,
          isFollowing: false,
          followersCount: Math.max(0, (Number(prev.followersCount) || 0) - 1),
        }));
        updateFollowingCount(queryClient, -1);
        console.error("Failed to follow user:", error);
      }
    });
  }, [user.id, queryClient]);

  const handleUnfollow = useCallback(() => {
    startFollowTransition(async () => {
      try {
        setUser((prev) => ({
          ...prev,
          isFollowing: false,
          followersCount: Math.max(0, (Number(prev.followersCount) || 0) - 1),
        }));
        updateFollowingCount(queryClient, -1);
        // Optimistically remove user's reviews from feed
        removeUserReviewsFromFeed(queryClient, user.id);

        await unfollowUserAction(user.id);
      } catch (error) {
        setUser((prev) => ({
          ...prev,
          isFollowing: true,
          followersCount: (Number(prev.followersCount) || 0) + 1,
        }));
        updateFollowingCount(queryClient, 1);
        // Refetch feed to restore removed reviews
        invalidateFeed(queryClient);
        console.error("Failed to unfollow user:", error);
      }
    });
  }, [user.id, queryClient]);

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
