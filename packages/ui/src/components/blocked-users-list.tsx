"use client";

import { Loader2, UserCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Button } from "./button";
import { useTranslation } from "react-i18next";
import type { BlockedUser } from "@repo/types";

interface BlockedUsersListProps {
  users: BlockedUser[];
  isLoading?: boolean;
  hasMore?: boolean;
  isFetchingMore?: boolean;
  unblockingUserId?: number | null;
  onUnblock: (userId: number) => void;
  onLoadMore?: () => void;
  onUserClick?: (userId: number) => void;
}

export const BlockedUsersList = ({
  users,
  isLoading = false,
  hasMore = false,
  isFetchingMore = false,
  unblockingUserId = null,
  onUnblock,
  onLoadMore,
  onUserClick,
}: BlockedUsersListProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("block.noBlockedUsers")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <button
            onClick={() => onUserClick?.(user.id)}
            className="flex items-center gap-3 flex-1 min-w-0 text-left"
          >
            <Avatar className="h-10 w-10">
              {user.avatar && <AvatarImage src={user.avatar} alt={user.userName} />}
              <AvatarFallback>
                {user.userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">@{user.userName}</p>
              {user.biography && (
                <p className="text-sm text-muted-foreground truncate">
                  {user.biography}
                </p>
              )}
            </div>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onUnblock(user.id)}
            disabled={unblockingUserId === user.id}
            className="shrink-0 gap-2"
          >
            {unblockingUserId === user.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserCheck className="h-4 w-4" />
            )}
            {t("block.unblock")}
          </Button>
        </div>
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isFetchingMore}
          >
            {isFetchingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t("common.loading")}
              </>
            ) : (
              t("common.loadMore")
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
