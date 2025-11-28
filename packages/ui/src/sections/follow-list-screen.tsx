import { useTranslation } from "react-i18next";
import { UserListItem } from "../components/user-list-item";
import { Button } from "../components/button";
import { Loader2, UserX } from "lucide-react";

interface FollowUser {
  id: number;
  userName: string;
  avatar?: string | null;
  biography?: string | null;
  isFollowing?: boolean;
  isMe?: boolean;
}

interface FollowListScreenProps {
  type: "followers" | "following";
  users: FollowUser[];
  isLoading: boolean;
  hasMore: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
  onUserClick: (userId: number) => void;
  onFollow: (userId: number) => void;
  onUnfollow: (userId: number) => void;
}

export function FollowListScreen({
  type,
  users,
  isLoading,
  hasMore,
  isFetchingMore,
  onLoadMore,
  onUserClick,
  onFollow,
  onUnfollow,
}: FollowListScreenProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <UserX className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {type === "followers" ? t("followList.noFollowers") : t("followList.noFollowing")}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {type === "followers"
            ? t("followList.noFollowersDescription")
            : t("followList.noFollowingDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="divide-y divide-border/50">
        {users.map((user) => (
          <UserListItem
            key={user.id}
            user={user}
            onUserClick={onUserClick}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
          />
        ))}
      </div>

      {hasMore && (
        <div className="pt-4 px-4">
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={onLoadMore}
            disabled={isFetchingMore}
          >
            {isFetchingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
}
