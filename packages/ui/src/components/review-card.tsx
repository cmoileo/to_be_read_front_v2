import { Review } from "@repo/types";
import { Card, CardContent, CardHeader } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Rating } from "./rating";
import { SpoilerGuard } from "./spoiler-guard";

interface ReviewCardProps {
  review: Review;
  onClick?: () => void;
}

export function ReviewCard({ review, onClick }: ReviewCardProps) {
  return (
    <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={review.author?.avatar || undefined} alt={review.author?.userName} />
              <AvatarFallback>
                {review.author?.userName?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">@{review.author?.userName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {review.book?.volumeInfo?.title}
              </p>
            </div>
          </div>
          <Rating value={review.value} readOnly size="sm" />
        </div>
      </CardHeader>
      <CardContent>
        <SpoilerGuard active={review.containsSpoiler}>
          <p className="text-sm line-clamp-3">{review.content}</p>
        </SpoilerGuard>
      </CardContent>
    </Card>
  );
}
