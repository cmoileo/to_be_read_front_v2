import { Card, CardContent } from "../components/card";
import { Rating } from "../components/rating";
import { Button } from "../components/button";
import { Trash2, Heart, MessageCircle } from "lucide-react";

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

interface ProfileReviewCardProps {
  review: Review;
  onClick?: (reviewId: number) => void;
  onDelete?: (reviewId: number) => void;
  showDeleteButton?: boolean;
}

export const ProfileReviewCard = ({
  review,
  onClick,
  onDelete,
  showDeleteButton = false,
}: ProfileReviewCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(review.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(review.id);
    }
  };

  const bookTitle = review.book.volumeInfo.title;
  const bookAuthors = review.book.volumeInfo.authors?.join(", ") || "Unknown author";
  const bookThumbnail = review.book.volumeInfo.imageLinks?.thumbnail;

  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleClick}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {bookThumbnail && (
            <img src={bookThumbnail} alt={bookTitle} className="w-16 h-24 object-cover rounded" />
          )}

          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-semibold line-clamp-1">{bookTitle}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{bookAuthors}</p>
            </div>

            <Rating value={review.value} readOnly size="sm" />

            <p className="text-sm line-clamp-2">{review.content}</p>

            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {Number(review.likesCount) || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                {Number(review.commentsCount) || 0}
              </span>
            </div>

            {showDeleteButton && onDelete && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
