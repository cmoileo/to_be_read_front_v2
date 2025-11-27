import { useTranslation } from "react-i18next";
import { FeedReviewCard } from "../components/feed-review-card";

interface FeedReview {
  id: number;
  content: string;
  value: number;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isFromMe: boolean;
  createdAt: string;
  author: {
    id: number;
    userName: string;
    avatarUrl?: string | null;
  };
  book: {
    id?: string;
    volumeInfo?: {
      title?: string;
      authors?: string[];
      imageLinks?: {
        thumbnail?: string;
      };
    };
  };
}

interface FeedScreenProps {
  reviews: FeedReview[];
  isLoading?: boolean;
  hasMore?: boolean;
  isFetchingMore?: boolean;
  isRefreshing?: boolean;
  onLoadMore?: () => void;
  onLike?: (reviewId: number) => void;
  onAuthorClick?: (authorId: number) => void;
  onReviewClick?: (reviewId: number) => void;
  onRefresh?: () => void;
}

export function FeedScreen({
  reviews,
  isLoading = false,
  hasMore = false,
  isFetchingMore = false,
  onLoadMore,
  onLike,
  onAuthorClick,
  onReviewClick,
}: FeedScreenProps) {
  const { t } = useTranslation();

  if (isLoading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!isLoading && reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-xl font-semibold mb-2">{t("feed.empty.title")}</h2>
        <p className="text-muted-foreground text-center max-w-sm">
          {t("feed.empty.description")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("feed.title")}</h1>

      <div className="space-y-4">
        {reviews.map((review) => (
          <FeedReviewCard
            key={review.id}
            review={review}
            onLike={onLike}
            onAuthorClick={onAuthorClick}
            onReviewClick={onReviewClick}
          />
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
    </div>
  );
}
