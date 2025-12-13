import { Avatar, AvatarImage, AvatarFallback } from "../components/avatar";
import { Button } from "../components/button";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { Pencil, Loader2, FileText, Users, UserPlus, BookMarked, Settings, Lock, UserX, Clock } from "lucide-react";

interface User {
  id: number;
  userName: string;
  avatar: string | null;
  biography: string | null;
  reviewsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isPrivate?: boolean;
  followRequestStatus?: "none" | "pending" | "accepted" | "rejected";
}

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  isFollowLoading?: boolean;
  onEdit?: () => void;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onCancelRequest?: () => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  onReadingListClick?: () => void;
  onSettingsClick?: () => void;
}

export const ProfileHeader = ({
  user,
  isOwnProfile,
  isFollowLoading = false,
  onEdit,
  onFollow,
  onUnfollow,
  onCancelRequest,
  onFollowersClick,
  onFollowingClick,
  onReadingListClick,
  onSettingsClick,
}: ProfileHeaderProps) => {
  const { t } = useTranslation();

  const getInitials = () => {
    return user?.userName?.substring(0, 2).toUpperCase() || "??";
  };

  const handleFollowToggle = () => {
    if (user.isFollowing && onUnfollow) {
      onUnfollow();
    } else if (!user.isFollowing && onFollow) {
      onFollow();
    }
  };

  const handleCancelRequest = () => {
    if (onCancelRequest) {
      onCancelRequest();
    }
  };

  const getFollowButtonContent = () => {
    if (isFollowLoading) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }

    if (user.followRequestStatus === "pending") {
      return (
        <>
          <Clock className="w-4 h-4" />
          {t("profile.requestPending")}
        </>
      );
    }

    if (user.isFollowing) {
      return t("profile.unfollow");
    }

    if (user.isPrivate) {
      return (
        <>
          <Lock className="w-4 h-4" />
          {t("profile.followRequest")}
        </>
      );
    }

    return t("profile.follow");
  };

  const getFollowButtonVariant = () => {
    if (user.followRequestStatus === "pending") {
      return "secondary";
    }
    return user.isFollowing ? "outline" : "default";
  };

  const isFollowButtonDisabled = () => {
    return isFollowLoading || user.followRequestStatus === "pending";
  };

  return (
    <div className="relative p-4 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-3xl">
      <div className="absolute inset-0 -top-6 h-32 from-primary/10 via-accent/5 to-transparent -z-10" />

      <div className="space-y-5 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex items-start gap-4 sm:gap-5">
            <button
              type="button"
              className="relative shrink-0"
              onClick={isOwnProfile ? onEdit : undefined}
              disabled={!isOwnProfile}
            >
              <Avatar className={cn(
                "h-20 w-20 sm:h-24 sm:w-24 border-4 border-background shadow-soft-lg",
                isOwnProfile && "cursor-pointer hover:opacity-90 transition-opacity"
              )}>
                {user.avatar && <AvatarImage src={user.avatar} alt={user.userName} />}
                <AvatarFallback className="text-xl sm:text-2xl from-primary/30 to-accent/30 font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded-full flex items-center justify-center shadow-soft">
                  <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-foreground" />
                </div>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">@{user.userName}</h1>
              {user.biography && (
                <p className="text-sm text-muted-foreground mt-1 sm:mt-2 line-clamp-2 leading-relaxed">
                  {user.biography}
                </p>
              )}
            </div>
          </div>

          <div className="flex sm:shrink-0 sm:ml-auto">
            {isOwnProfile ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={onEdit}
                  size="sm"
                  className="flex-1 sm:flex-none rounded-full border-2 hover:bg-muted/50"
                >
                  {t("profile.edit")}
                </Button>
                {onSettingsClick && (
                  <Button
                    variant="ghost"
                    onClick={onSettingsClick}
                    size="icon"
                    className="rounded-full h-9 w-9 hover:bg-muted/50"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant={getFollowButtonVariant()}
                  onClick={handleFollowToggle}
                  size="sm"
                  disabled={isFollowButtonDisabled()}
                  className={cn(
                    "flex-1 sm:flex-none rounded-full min-w-[120px] transition-all duration-200 gap-2",
                    user.isFollowing
                      ? "border-2 hover:border-destructive hover:text-destructive hover:bg-destructive/10"
                      : "shadow-soft hover:shadow-glow",
                    user.followRequestStatus === "pending" && "border-2"
                  )}
                >
                  {getFollowButtonContent()}
                </Button>
                {user.followRequestStatus === "pending" && onCancelRequest && (
                  <Button
                    variant="ghost"
                    onClick={handleCancelRequest}
                    size="icon"
                    disabled={isFollowLoading}
                    className="rounded-full h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <UserX className="h-5 w-5" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-muted/30 rounded-2xl p-3 sm:p-4">
          {[
            {
              value: user.reviewsCount,
              label: t("profile.reviews"),
              icon: <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
              onClick: undefined,
            },
            {
              value: user.followersCount,
              label: t("profile.followers"),
              icon: <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
              onClick: onFollowersClick,
            },
            {
              value: user.followingCount,
              label: t("profile.following"),
              icon: <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
              onClick: onFollowingClick,
            },
          ].map((stat, index) => (
            <button
              key={index}
              className={cn(
                "text-center rounded-xl py-2 transition-colors",
                stat.onClick && "hover:bg-muted/50 cursor-pointer"
              )}
              onClick={stat.onClick}
              disabled={!stat.onClick}
            >
              <div className="text-lg sm:text-xl font-bold text-foreground">{Number(stat.value) || 0}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-0.5 sm:gap-1">
                {stat.icon}
                <span className="truncate">{stat.label}</span>
              </div>
            </button>
          ))}
        </div>

        {isOwnProfile && onReadingListClick && (
          <Button
            variant="outline"
            onClick={onReadingListClick}
            className="w-full rounded-xl border-2 hover:bg-muted/50 gap-2"
          >
            <BookMarked className="w-4 h-4" />
            {t("toReadList.title")}
          </Button>
        )}
      </div>
    </div>
  );
};
