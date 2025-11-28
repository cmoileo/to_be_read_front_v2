import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

interface UserListItemUser {
  id: number;
  userName: string;
  avatar?: string | null;
  biography?: string | null;
  isFollowing?: boolean;
  isMe?: boolean;
}

interface UserListItemProps {
  user: UserListItemUser;
  isFollowLoading?: boolean;
  onUserClick?: (userId: number) => void;
  onFollow?: (userId: number) => void;
  onUnfollow?: (userId: number) => void;
}

export function UserListItem({
  user,
  isFollowLoading = false,
  onUserClick,
  onFollow,
  onUnfollow,
}: UserListItemProps) {
  const { t } = useTranslation();

  const getInitials = () => {
    return user.userName.substring(0, 2).toUpperCase();
  };

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user.isFollowing && onUnfollow) {
      onUnfollow(user.id);
    } else if (!user.isFollowing && onFollow) {
      onFollow(user.id);
    }
  };

  const handleClick = () => {
    if (onUserClick) {
      onUserClick(user.id);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl transition-colors",
        onUserClick && "cursor-pointer hover:bg-muted/50"
      )}
      onClick={handleClick}
    >
      <Avatar className="h-12 w-12 border-2 border-background shadow-soft">
        {user.avatar && <AvatarImage src={user.avatar} alt={user.userName} />}
        <AvatarFallback className="text-sm font-medium">{getInitials()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate">@{user.userName}</p>
        {user.biography && (
          <p className="text-sm text-muted-foreground line-clamp-1">{user.biography}</p>
        )}
      </div>

      {!user.isMe && (onFollow || onUnfollow) && (
        <Button
          variant={user.isFollowing ? "outline" : "default"}
          size="sm"
          onClick={handleFollowToggle}
          disabled={isFollowLoading}
          className={cn(
            "shrink-0 rounded-full min-w-[90px] transition-all duration-200",
            user.isFollowing
              ? "border-2 hover:border-destructive hover:text-destructive hover:bg-destructive/10"
              : "shadow-soft hover:shadow-glow"
          )}
        >
          {isFollowLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : user.isFollowing ? (
            t("profile.unfollow")
          ) : (
            t("profile.follow")
          )}
        </Button>
      )}
    </div>
  );
}
