import { useTranslation } from "react-i18next";
import { FeedReviewCard } from "../components/feed-review-card";
import { cn } from "../lib/utils";
import { BookOpen, RefreshCw, PlusCircle, Loader2 } from "lucide-react";

interface FeedReview {
  id: number;
  content: string;
  value: number;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isFromMe?: boolean;
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
  isRefreshing = false,
  onLoadMore,
  onLike,
  onAuthorClick,
  onReviewClick,
  onRefresh,
}: FeedScreenProps) {
  const { t } = useTranslation();

  if (isLoading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full" />
            <div className="absolute inset-0 animate-pulse flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground font-medium animate-pulse">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!isLoading && reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
          <BookOpen className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">{t("feed.empty.title")}</h2>
        <p className="text-muted-foreground text-center max-w-sm leading-relaxed">
          {t("feed.empty.description")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          {t("feed.title")}
        </h1>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={cn(
              "p-2.5 rounded-full transition-all duration-200",
              "bg-muted/50 hover:bg-muted active:scale-95",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            aria-label={t("common.refresh")}
          >
            <RefreshCw
              className={cn(
                "w-5 h-5 text-muted-foreground transition-transform duration-500",
                isRefreshing && "animate-spin text-primary"
              )}
            />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className="animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
          >
            <FeedReviewCard
              review={review}
              onLike={onLike}
              onAuthorClick={onAuthorClick}
              onReviewClick={onReviewClick}
            />
          </div>
        ))}

        {hasMore && (
          <button
            onClick={onLoadMore}
            disabled={isFetchingMore}
            className={cn(
              "w-full flex justify-center items-center py-4 rounded-xl",
              "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              "transition-all duration-200 disabled:opacity-50",
              "active:scale-[0.98]"
            )}
            aria-label={t("common.loadMore")}
          >
            {isFetchingMore ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <PlusCircle className="w-8 h-8" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
