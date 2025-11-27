import { Card, CardContent, CardHeader, CardFooter } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Rating } from "./rating";
import { Button } from "./button";

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
    avatar?: string | null;
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

interface FeedReviewCardProps {
  review: FeedReview;
  onLike?: (reviewId: number) => void;
  onAuthorClick?: (authorId: number) => void;
  onReviewClick?: (reviewId: number) => void;
}

export function FeedReviewCard({
  review,
  onLike,
  onAuthorClick,
  onReviewClick,
}: FeedReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onAuthorClick?.(review.author.id)}
            className="flex-shrink-0"
            type="button"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={review.author?.avatar || undefined}
                alt={review.author?.userName}
              />
              <AvatarFallback>
                {review.author?.userName?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => onAuthorClick?.(review.author.id)}
                className="text-sm font-semibold hover:underline truncate"
                type="button"
              >
                @{review.author?.userName}
              </button>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatDate(review.createdAt)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {review.book?.volumeInfo?.title}
              {review.book?.volumeInfo?.authors?.length && (
                <span> • {review.book.volumeInfo.authors[0]}</span>
              )}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className="pb-3 cursor-pointer"
        onClick={() => onReviewClick?.(review.id)}
      >
        <div className="flex gap-4">
          {review.book?.volumeInfo?.imageLinks?.thumbnail && (
            <img
              src={review.book.volumeInfo.imageLinks.thumbnail}
              alt={review.book.volumeInfo.title}
              className="w-16 h-24 object-cover rounded-md flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <Rating value={review.value} readOnly size="sm" />
            </div>
            <p className="text-sm line-clamp-4">{review.content}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t">
        <div className="flex items-center justify-between w-full pt-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike?.(review.id)}
              className={`gap-1.5 px-2 ${review.isLiked ? "text-red-500" : ""}`}
            >
              <span className="text-lg">{review.isLiked ? "❤️" : "🤍"}</span>
              <span className="text-sm">{review.likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReviewClick?.(review.id)}
              className="gap-1.5 px-2"
            >
              <span className="text-lg">💬</span>
              <span className="text-sm">{review.commentsCount}</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
