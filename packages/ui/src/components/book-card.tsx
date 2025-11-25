import { GoogleBook } from "@repo/types";
import { Card, CardContent } from "./card";

interface BookCardProps {
  book: GoogleBook;
  onClick?: () => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  const thumbnail = book.volumeInfo.imageLinks?.thumbnail;
  const title = book.volumeInfo.title;
  const authors = book.volumeInfo.authors?.join(", ") || "";

  return (
    <Card
      className="cursor-pointer hover:bg-accent transition-colors overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-4 flex gap-3">
        {thumbnail && (
          <img src={thumbnail} alt={title} className="w-16 h-24 object-cover rounded" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold line-clamp-2 mb-1">{title}</h3>
          {authors && <p className="text-sm text-muted-foreground line-clamp-1">{authors}</p>}
          {book.volumeInfo.publishedDate && (
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(book.volumeInfo.publishedDate).getFullYear()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
