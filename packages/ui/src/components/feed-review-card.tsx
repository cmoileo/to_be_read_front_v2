import { Card, CardContent, CardHeader, CardFooter } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Rating } from "./rating";
import { Button } from "./button";
import { cn } from "../lib/utils";
import { Heart, MessageCircle, MoreHorizontal, Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useTranslation } from "react-i18next";

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
  onReport?: (reviewId: number) => void;
}

export function FeedReviewCard({
  review,
  onLike,
  onAuthorClick,
  onReviewClick,
  onReport,
}: FeedReviewCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="w-full group hover:border-primary/30 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onAuthorClick?.(review.author.id)}
            className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
            type="button"
          >
            <Avatar className="h-11 w-11">
              <AvatarImage src={review.author?.avatar || undefined} alt={review.author?.userName} />
              <AvatarFallback>
                {review.author?.userName?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => onAuthorClick?.(review.author.id)}
                className="text-sm font-semibold hover:text-primary transition-colors truncate"
                type="button"
              >
                @{review.author?.userName}
              </button>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground flex-shrink-0 bg-muted/50 px-2 py-0.5 rounded-full">
                  {formatDate(review.createdAt)}
                </span>
                {!review.isFromMe && onReport && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onReport(review.id)}>
                        <Flag className="h-4 w-4 mr-2" />
                        {t("report.title")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {review.book?.volumeInfo?.title}
              {review.book?.volumeInfo?.authors?.length && (
                <span className="text-primary/70"> • {review.book.volumeInfo.authors[0]}</span>
              )}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className="pb-3 cursor-pointer group/content"
        onClick={() => onReviewClick?.(review.id)}
      >
        <div className="flex gap-4">
          {review.book?.volumeInfo?.imageLinks?.thumbnail && (
            <div className="relative flex-shrink-0">
              <img
                src={review.book.volumeInfo.imageLinks.thumbnail}
                alt={review.book.volumeInfo.title}
                className="w-16 h-24 object-cover rounded-lg shadow-soft transition-transform duration-300 group-hover/content:scale-105"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/content:opacity-100 transition-opacity duration-300" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <Rating value={review.value} readOnly size="sm" />
            </div>
            <p className="text-sm leading-relaxed line-clamp-4 text-foreground/90">
              {review.content}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t border-border/50">
        <div className="flex items-center justify-between w-full pt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike?.(review.id)}
              className={cn(
                "gap-1.5 px-3 rounded-full transition-all duration-200",
                "hover:bg-red-500/10",
                review.isLiked ? "text-red-500" : "text-muted-foreground"
              )}
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  review.isLiked && "scale-110 fill-current"
                )}
              />
              <span className="text-sm font-medium">{review.likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReviewClick?.(review.id)}
              className="gap-1.5 px-3 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{review.commentsCount}</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
