import { Button } from "../components/button";
import { Separator } from "../components/separator";
import { ProfileHeader } from "./profile-header";
import { ReviewCard } from "./review-card";
import { ProfileEditDialog } from "./profile-edit-dialog";
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

interface Review {
  id: number;
  content: string;
  value: number;
  likesCount: number;
  commentsCount: number;
  book: {
    volumeInfo: {
      title: string;
      authors?: string[];
      imageLinks?: {
        thumbnail?: string;
      };
    };
  };
}

interface ProfileScreenProps {
  user: User | null;
  reviews: Review[];
  isOwnProfile?: boolean;
  isLoading?: boolean;
  hasMore?: boolean;
  isEditDialogOpen?: boolean;
  isUpdating?: boolean;
  onEdit?: () => void;
  onCloseEditDialog?: () => void;
  onUpdateProfile?: (data: any) => void;
  onLoadMore?: () => void;
  onReviewClick?: (reviewId: number) => void;
  onFollow?: () => void;
  onUnfollow?: () => void;
}

export const ProfileScreen = ({
  user,
  reviews,
  isOwnProfile = true,
  isLoading = false,
  hasMore = false,
  isEditDialogOpen = false,
  isUpdating = false,
  onEdit,
  onCloseEditDialog,
  onUpdateProfile,
  onLoadMore,
  onReviewClick,
  onFollow,
  onUnfollow,
}: ProfileScreenProps) => {
  const { t } = useTranslation();

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{t("profile.notFound")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          onEdit={onEdit}
          onFollow={onFollow}
          onUnfollow={onUnfollow}
        />

        <Separator />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t("profile.myReviews")}</h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("profile.noReviews")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} onClick={onReviewClick} />
              ))}

              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={onLoadMore} disabled={isLoading}>
                    {isLoading ? t("common.loading") : t("common.loadMore")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isOwnProfile && onCloseEditDialog && onUpdateProfile && (
        <ProfileEditDialog
          isOpen={isEditDialogOpen}
          onClose={onCloseEditDialog}
          onSubmit={onUpdateProfile}
          isLoading={isUpdating}
          defaultValues={{
            userName: user.userName,
            biography: user.biography,
            locale: "en",
          }}
        />
      )}
    </>
  );
};
