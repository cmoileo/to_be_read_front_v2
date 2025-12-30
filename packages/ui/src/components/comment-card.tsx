import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Heart, Trash2, MoreHorizontal, Flag } from "lucide-react";
import { cn } from "../lib/utils";
import { useTranslation } from "react-i18next";

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

interface CommentCardProps {
  comment: Comment;
  onLike?: (commentId: number) => void;
  onDelete?: (commentId: number) => void;
  onAuthorClick?: (authorId: number) => void;
  onReport?: (commentId: number) => void;
}

export function CommentCard({
  comment,
  onLike,
  onDelete,
  onAuthorClick,
  onReport,
}: CommentCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });
  };

  const getInitials = () => {
    return comment.author.userName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex gap-3 py-3">
      <button
        onClick={() => onAuthorClick?.(comment.author.id)}
        className="flex-shrink-0"
        type="button"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar || undefined} alt={comment.author.userName} />
          <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
        </Avatar>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAuthorClick?.(comment.author.id)}
            className="text-sm font-semibold hover:underline"
            type="button"
          >
            @{comment.author.userName}
          </button>
          <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
        </div>

        <p className="text-sm mt-1 break-words">{comment.content}</p>

        <div className="flex items-center gap-3 mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 gap-1"
            onClick={() => onLike?.(comment.id)}
          >
            <Heart
              className={cn("h-4 w-4", comment.isLiked && "fill-red-500 text-red-500")}
            />
            <span className="text-xs">{Number(comment.likesCount)}</span>
          </Button>

          {comment.isFromCurrentUser && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-destructive hover:text-destructive"
              onClick={() => onDelete?.(comment.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          {!comment.isFromCurrentUser && onReport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onReport(comment.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  {t("report.reportContent")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
