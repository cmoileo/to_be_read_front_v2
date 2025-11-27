import { Separator } from "../components/separator";
import { ProfileHeader } from "./profile-header";
import { ProfileReviewCard } from "./profile-review-card";
import { ProfileEditDialog } from "./profile-edit-dialog";
import { useTranslation } from "react-i18next";

interface User {
  userName: string;
  avatar: string | null;
  biography: string | null;
  reviewsCount: number;
  followersCount: number;
  followingCount: number;
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
  isFetchingMore?: boolean;
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
  isFetchingMore = false,
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
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          onEdit={onEdit}
          onFollow={onFollow}
          onUnfollow={onUnfollow}
        />

        <Separator />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {isOwnProfile ? t("profile.myReviews") : t("profile.userReviews")}
          </h2>

          {reviews.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("profile.noReviews")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <ProfileReviewCard key={review.id} review={review} onClick={onReviewClick} />
              ))}

              {hasMore && (
                <button
                  onClick={onLoadMore}
                  disabled={isFetchingMore}
                  className="w-full flex justify-center items-center py-4 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  aria-label={t("common.loadMore")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isFetchingMore ? "animate-spin" : ""}
                  >
                    {isFetchingMore ? (
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    ) : (
                      <>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v8" />
                        <path d="M8 12h8" />
                      </>
                    )}
                  </svg>
                </button>
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
