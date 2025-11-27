import { useState } from "react";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { Button } from "../components/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
import { Rating } from "../components/rating";
import { Separator } from "../components/separator";
import { CommentCard } from "../components/comment-card";
import { CommentForm } from "../components/comment-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/alert-dialog";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";

interface ReviewAuthor {
  id: number;
  userName: string;
  avatar: string | null;
}

interface ReviewBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

interface Review {
  id: number;
  content: string;
  value: number;
  likesCount: number;
  isLiked: boolean;
  isFromMe: boolean;
  createdAt: string;
  author: ReviewAuthor;
  book: ReviewBook;
}

interface CommentAuthor {
  id: number;
  userName: string;
  avatar: string | null;
}

interface Comment {
  id: number;
  content: string;
  likesCount: number;
  isLiked: boolean;
  isFromCurrentUser: boolean;
  createdAt: string;
  author: CommentAuthor;
}

interface SingleReviewScreenProps {
  review: Review | null;
  comments: Comment[];
  isLoading?: boolean;
  hasMoreComments?: boolean;
  isFetchingMoreComments?: boolean;
  isCreatingComment?: boolean;
  onBack?: () => void;
  onLikeReview?: () => void;
  onLikeComment?: (commentId: number) => void;
  onDeleteComment?: (commentId: number) => void;
  onCreateComment?: (content: string) => Promise<void>;
  onLoadMoreComments?: () => void;
  onAuthorClick?: (authorId: number) => void;
  onBookClick?: (bookId: string) => void;
}

export function SingleReviewScreen({
  review,
  comments,
  isLoading = false,
  hasMoreComments = false,
  isFetchingMoreComments = false,
  isCreatingComment = false,
  onBack,
  onLikeReview,
  onLikeComment,
  onDeleteComment,
  onCreateComment,
  onLoadMoreComments,
  onAuthorClick,
  onBookClick,
}: SingleReviewScreenProps) {
  const { t } = useTranslation();
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const handleConfirmDeleteComment = () => {
    if (commentToDelete !== null && onDeleteComment) {
      onDeleteComment(commentToDelete);
    }
    setCommentToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading && !review) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">{t("review.notFound")}</p>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            {t("common.back")}
          </Button>
        )}
      </div>
    );
  }

  const getAuthorInitials = () => {
    return review.author.userName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl pb-24">
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Button>
      )}

      <div
        role="button"
        tabIndex={0}
        className="flex gap-4 mb-6 text-left w-full hover:bg-accent/50 rounded-lg p-2 -ml-2 transition-colors cursor-pointer"
        onClick={() => onBookClick?.(review.book.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onBookClick?.(review.book.id);
          }
        }}
      >
        {review.book.volumeInfo.imageLinks?.thumbnail && (
          <img
            src={review.book.volumeInfo.imageLinks.thumbnail}
            alt={review.book.volumeInfo.title}
            className="w-24 h-36 object-cover rounded-lg shadow-md flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold line-clamp-2">{review.book.volumeInfo.title}</h1>
          {review.book.volumeInfo.authors && (
            <p className="text-sm text-muted-foreground mt-1">
              {review.book.volumeInfo.authors.join(", ")}
            </p>
          )}
          <div className="mt-3">
            <Rating value={review.value} readOnly size="sm" />
          </div>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => onAuthorClick?.(review.author.id)}
            type="button"
            className="flex-shrink-0"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.author.avatar || undefined} alt={review.author.userName} />
              <AvatarFallback>{getAuthorInitials()}</AvatarFallback>
            </Avatar>
          </button>
          <div>
            <button
              onClick={() => onAuthorClick?.(review.author.id)}
              type="button"
              className="font-semibold hover:underline"
            >
              @{review.author.userName}
            </button>
            <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap">{review.content}</p>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={onLikeReview}
          >
            <Heart
              className={cn("h-5 w-5", review.isLiked && "fill-red-500 text-red-500")}
            />
            <span>{Number(review.likesCount)}</span>
          </Button>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="h-5 w-5" />
            <span>{comments.length}</span>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("comments.title")}</h2>

        {onCreateComment && (
          <CommentForm onSubmit={onCreateComment} isLoading={isCreatingComment} />
        )}

        <div className="divide-y">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t("comments.empty")}
            </p>
          ) : (
            comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onLike={onLikeComment}
                onDelete={(id) => setCommentToDelete(id)}
                onAuthorClick={onAuthorClick}
              />
            ))
          )}
        </div>

        {hasMoreComments && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onLoadMoreComments}
            disabled={isFetchingMoreComments}
          >
            {isFetchingMoreComments ? t("common.loading") : t("common.loadMore")}
          </Button>
        )}
      </div>

      <AlertDialog open={commentToDelete !== null} onOpenChange={(open) => !open && setCommentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("comments.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("comments.deleteConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteComment} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
