import type { ToReadListItem } from "@repo/types";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ToReadListItemCardProps {
  item: ToReadListItem;
  onBookClick?: (bookId: string) => void;
  onRemove?: (googleBookId: string) => void;
  isRemoving?: boolean;
}

export function ToReadListItemCard({
  item,
  onBookClick,
  onRemove,
  isRemoving = false,
}: ToReadListItemCardProps) {
  const { t } = useTranslation();
  const book = item.book;
  const thumbnail = book.volumeInfo.imageLinks?.thumbnail;
  const title = book.volumeInfo.title;
  const authors = book.volumeInfo.authors?.join(", ") || "";

  const handleClick = () => {
    if (onBookClick) {
      onBookClick(book.id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(item.googleBookId);
    }
  };

  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors overflow-hidden"
      onClick={handleClick}
    >
      <CardContent className="p-4 flex gap-3">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-16 h-24 object-cover rounded shadow-sm" />
        ) : (
          <div className="w-16 h-24 bg-muted rounded flex items-center justify-center">
            <span className="text-xs text-muted-foreground text-center px-1">
              {t("toReadList.noCover")}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold line-clamp-2 mb-1">{title}</h3>
          {authors && <p className="text-sm text-muted-foreground line-clamp-1">{authors}</p>}
          {book.volumeInfo.publishedDate && (
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(book.volumeInfo.publishedDate).getFullYear()}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {t("toReadList.addedOn", {
              date: new Date(item.createdAt).toLocaleDateString(),
            })}
          </p>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
