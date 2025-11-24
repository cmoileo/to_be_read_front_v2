import { Card, CardContent } from "../components/card";
import { Rating } from "../components/rating";

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

interface ReviewCardProps {
  review: Review;
  onClick?: (reviewId: number) => void;
}

export const ReviewCard = ({ review, onClick }: ReviewCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(review.id);
    }
  };

  const bookTitle = review.book.volumeInfo.title;
  const bookAuthors = review.book.volumeInfo.authors?.join(", ") || "Unknown author";
  const bookThumbnail = review.book.volumeInfo.imageLinks?.thumbnail;

  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {bookThumbnail && (
            <img
              src={bookThumbnail}
              alt={bookTitle}
              className="w-16 h-24 object-cover rounded"
            />
          )}
          
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-semibold line-clamp-1">{bookTitle}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{bookAuthors}</p>
            </div>
            
            <Rating value={review.value} readOnly size="sm" />
            
            <p className="text-sm line-clamp-2">{review.content}</p>
            
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>❤️ {review.likesCount}</span>
              <span>💬 {review.commentsCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
