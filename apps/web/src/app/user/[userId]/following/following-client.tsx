"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FollowListScreen, ArrowLeft, useTranslation } from "@repo/ui";
import { FollowUser } from "@/services/web-user.service";
import { PaginatedResponse } from "@repo/types";
import { getFollowingsAction, followUserAction, unfollowUserAction } from "./actions";

interface FollowingClientProps {
  userId: number;
  userName: string;
  initialData: PaginatedResponse<FollowUser>;
}

export default function FollowingClient({ userId, userName, initialData }: FollowingClientProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const [users, setUsers] = useState<FollowUser[]>(initialData.data);
  const [currentPage, setCurrentPage] = useState(initialData.meta.currentPage);
  const [hasMore, setHasMore] = useState(initialData.meta.currentPage < initialData.meta.lastPage);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const handleLoadMore = async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await getFollowingsAction(userId, nextPage);
      setUsers((prev) => [...prev, ...response.data]);
      setCurrentPage(response.meta.currentPage);
      setHasMore(response.meta.currentPage < response.meta.lastPage);
    } catch (error) {
      console.error("Failed to load more followings:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleUserClick = (clickedUserId: number) => {
    router.push(`/user/${clickedUserId}`);
  };

  const updateUserFollowState = useCallback((targetUserId: number, isFollowing: boolean) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === targetUserId ? { ...user, isFollowing } : user))
    );
  }, []);

  const handleFollow = (targetUserId: number) => {
    updateUserFollowState(targetUserId, true);
    startTransition(async () => {
      try {
        await followUserAction(targetUserId);
      } catch (error) {
        updateUserFollowState(targetUserId, false);
      }
    });
  };

  const handleUnfollow = (targetUserId: number) => {
    updateUserFollowState(targetUserId, false);
    startTransition(async () => {
      try {
        await unfollowUserAction(targetUserId);
      } catch (error) {
        updateUserFollowState(targetUserId, true);
      }
    });
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="p-4 border-b flex items-center gap-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">
              {t("followList.followingTitle", { userName })}
            </h1>
          </div>

          <div className="px-4">
            <FollowListScreen
              type="following"
              users={users}
              isLoading={false}
              hasMore={hasMore}
              isFetchingMore={isFetchingMore}
              onLoadMore={handleLoadMore}
              onUserClick={handleUserClick}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
