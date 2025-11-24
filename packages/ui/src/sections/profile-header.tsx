import { Avatar, AvatarImage, AvatarFallback } from "../components/avatar";
import { Button } from "../components/button";
import { useTranslation } from "react-i18next";

interface User {
  userName: string;
  avatar: string | null;
  biography: string | null;
  reviewsCount: number;
  followersCount: number;
  followingsCount: number;
  isFollowing: boolean;
}

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onEdit?: () => void;
  onFollow?: () => void;
  onUnfollow?: () => void;
}

export const ProfileHeader = ({
  user,
  isOwnProfile,
  onEdit,
  onFollow,
  onUnfollow,
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
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-24 w-24">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.userName} />}
          <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user.userName}</h1>
          {user.biography && (
            <p className="text-sm text-muted-foreground mt-2">{user.biography}</p>
          )}
        </div>

        {isOwnProfile ? (
          <Button variant="outline" onClick={onEdit} size="sm">
            {t("profile.edit")}
          </Button>
        ) : (
          <Button
            variant={user.isFollowing ? "outline" : "default"}
            onClick={handleFollowToggle}
            size="sm"
          >
            {user.isFollowing ? t("profile.unfollow") : t("profile.follow")}
          </Button>
        )}
      </div>

      <div className="flex gap-6 text-sm">
        <div className="text-center">
          <div className="font-bold text-lg">{user.reviewsCount}</div>
          <div className="text-muted-foreground">{t("profile.reviews")}</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg">{user.followersCount}</div>
          <div className="text-muted-foreground">{t("profile.followers")}</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg">{user.followingsCount}</div>
          <div className="text-muted-foreground">{t("profile.following")}</div>
        </div>
      </div>
    </div>
  );
};
