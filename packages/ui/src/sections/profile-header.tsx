import { Avatar, AvatarImage, AvatarFallback } from "../components/avatar";
import { Button } from "../components/button";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { Pencil, Loader2, FileText, Users, UserPlus, BookMarked } from "lucide-react";

interface User {
  id: number;
  userName: string;
  avatar: string | null;
  biography: string | null;
  reviewsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  isFollowLoading?: boolean;
  onEdit?: () => void;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  onReadingListClick?: () => void;
}

export const ProfileHeader = ({
  user,
  isOwnProfile,
  isFollowLoading = false,
  onEdit,
  onFollow,
  onUnfollow,
  onFollowersClick,
  onFollowingClick,
  onReadingListClick,
}: ProfileHeaderProps) => {
  const { t } = useTranslation();

  const getInitials = () => {
    return user.userName.substring(0, 2).toUpperCase();
  };

  const handleFollowToggle = () => {
    if (user.isFollowing && onUnfollow) {
      onUnfollow();
    } else if (!user.isFollowing && onFollow) {
      onFollow();
    }
  };

  return (
    <div className="relative p-4 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-3xl">
      {/* Background gradient */}
      <div className="absolute inset-0 -top-6 h-32 from-primary/10 via-accent/5 to-transparent -z-10" />

      <div className="space-y-5 pt-4">
        <div className="flex items-start gap-5">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background shadow-soft-lg">
              {user.avatar && <AvatarImage src={user.avatar} alt={user.userName} />}
              <AvatarFallback className="text-2xl from-primary/30 to-accent/30 font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-soft">
                <Pencil className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground truncate">@{user.userName}</h1>
            {user.biography && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                {user.biography}
              </p>
            )}
          </div>

          {isOwnProfile ? (
            <Button
              variant="outline"
              onClick={onEdit}
              size="sm"
              className="shrink-0 rounded-full border-2 hover:bg-muted/50"
            >
              {t("profile.edit")}
            </Button>
          ) : (
            <Button
              variant={user.isFollowing ? "outline" : "default"}
              onClick={handleFollowToggle}
              size="sm"
              disabled={isFollowLoading}
              className={cn(
                "shrink-0 rounded-full min-w-[100px] transition-all duration-200",
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

        <div className="flex gap-2 justify-around bg-muted/30 rounded-2xl p-4">
          {[
            {
              value: user.reviewsCount,
              label: t("profile.reviews"),
              icon: <FileText className="w-4 h-4" />,
              onClick: undefined,
              show: true,
            },
            {
              value: user.followersCount,
              label: t("profile.followers"),
              icon: <Users className="w-4 h-4" />,
              onClick: onFollowersClick,
              show: true,
            },
            {
              value: user.followingCount,
              label: t("profile.following"),
              icon: <UserPlus className="w-4 h-4" />,
              onClick: onFollowingClick,
              show: true,
            },
            {
              value: null,
              label: t("toReadList.title"),
              icon: <BookMarked className="w-4 h-4" />,
              onClick: onReadingListClick,
              show: isOwnProfile && onReadingListClick,
            },
          ]
            .filter((stat) => stat.show)
            .map((stat, index) => (
              <button
                key={index}
                className={cn(
                  "text-center flex-1 rounded-xl py-2 transition-colors",
                  stat.onClick && "hover:bg-muted/50 cursor-pointer"
                )}
                onClick={stat.onClick}
                disabled={!stat.onClick}
              >
                {stat.value !== null && (
                  <div className="text-xl font-bold text-foreground">{Number(stat.value)}</div>
                )}
                <div className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
                  {stat.icon}
                  {stat.label}
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
