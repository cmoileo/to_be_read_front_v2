"use client";

import { useState, useCallback, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User, Review, PaginatedResponse } from "@repo/types";
import {
  followUserAction,
  unfollowUserAction,
  getUserReviewsAction,
} from "@/app/user/[userId]/actions";
import { removeUserReviewsFromFeed, invalidateFeed, updateFollowingCount, blockUserInCache, unblockUserInCache, rollbackBlockState, invalidateBlockRelatedCaches } from "@repo/stores";
import { BlocksApi } from "@repo/api-client";

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
  const [isBlockLoading, setIsBlockLoading] = useState(false);

  const handleBlock = useCallback(async () => {
    if (isBlockLoading) return;
    
    setIsBlockLoading(true);
    const previousUserState = { isBlocked: user.isBlocked, isFollowing: user.isFollowing };
    
    try {
      // Optimistic update
      setUser((prev) => ({
        ...prev,
        isBlocked: true,
        isFollowing: false,
      }));
      const { previousState } = blockUserInCache(queryClient, user.id);
      
      await BlocksApi.blockUser(user.id);
      invalidateBlockRelatedCaches(queryClient, user.id);
    } catch (error) {
      // Rollback on error
      setUser((prev) => ({
        ...prev,
        isBlocked: previousUserState.isBlocked,
        isFollowing: previousUserState.isFollowing,
      }));
      rollbackBlockState(queryClient, user.id, { isBlocked: previousUserState.isBlocked ?? false, hasBlockedMe: user.hasBlockedMe ?? false });
      console.error("Failed to block user:", error);
    } finally {
      setIsBlockLoading(false);
    }
  }, [user.id, user.isBlocked, user.isFollowing, user.hasBlockedMe, isBlockLoading, queryClient]);

  const handleUnblock = useCallback(async () => {
    if (isBlockLoading) return;
    
    setIsBlockLoading(true);
    const previousUserState = { isBlocked: user.isBlocked };
    
    try {
      // Optimistic update
      setUser((prev) => ({
        ...prev,
        isBlocked: false,
      }));
      unblockUserInCache(queryClient, user.id);
      
      await BlocksApi.unblockUser(user.id);
      invalidateBlockRelatedCaches(queryClient, user.id);
    } catch (error) {
      // Rollback on error
      setUser((prev) => ({
        ...prev,
        isBlocked: previousUserState.isBlocked,
      }));
      rollbackBlockState(queryClient, user.id, { isBlocked: previousUserState.isBlocked ?? false, hasBlockedMe: user.hasBlockedMe ?? false });
      console.error("Failed to unblock user:", error);
    } finally {
      setIsBlockLoading(false);
    }
  }, [user.id, user.isBlocked, user.hasBlockedMe, isBlockLoading, queryClient]);

  const handleFollow = useCallback(() => {
    startFollowTransition(async () => {
      try {
        const isPrivateAccount = user.isPrivate;
        setUser((prev) => ({
          ...prev,
          isFollowing: !isPrivateAccount,
          followersCount: !isPrivateAccount ? (Number(prev.followersCount) || 0) + 1 : Number(prev.followersCount) || 0,
          followRequestStatus: isPrivateAccount ? "pending" : prev.followRequestStatus,
        }));
        
        if (!isPrivateAccount) {
          updateFollowingCount(queryClient, 1);
        }

        const result = await followUserAction(user.id);
        
        if (result.followed) {
          invalidateFeed(queryClient);
        }
      } catch (error) {
        setUser((prev) => ({
          ...prev,
          isFollowing: false,
          followersCount: Math.max(0, (Number(prev.followersCount) || 0) - (user.isPrivate ? 0 : 1)),
          followRequestStatus: "none",
        }));
        if (!user.isPrivate) {
          updateFollowingCount(queryClient, -1);
        }
        console.error("Failed to follow user:", error);
      }
    });
  }, [user.id, user.isPrivate, queryClient]);

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

  const handleCancelRequest = useCallback(() => {
    startFollowTransition(async () => {
      try {
        setUser((prev) => ({
          ...prev,
          followRequestStatus: "none",
        }));

        const { cancelFollowRequestAction } = await import("@/app/user/[userId]/actions");
        await cancelFollowRequestAction(user.id);
      } catch (error) {
        setUser((prev) => ({
          ...prev,
          followRequestStatus: "pending",
        }));
        console.error("Failed to cancel follow request:", error);
      }
    });
  }, [user.id]);

  return {
    user,
    reviews,
    isLoading: false,
    hasMore,
    isFetchingMore,
    isFollowLoading,
    isBlockLoading,
    handleFollow,
    handleUnfollow,
    handleCancelRequest,
    handleLoadMore,
    handleBlock,
    handleUnblock,
  };
};
