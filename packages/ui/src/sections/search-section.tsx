import { Button } from "../components/button";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";

interface SearchSectionProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onShowMore?: () => void;
  showMoreButton?: boolean;
  emptyMessage?: string;
}

export function SearchSection<T>({
  title,
  items,
  renderItem,
  onShowMore,
  showMoreButton = false,
  emptyMessage,
}: SearchSectionProps<T>) {
  const { t } = useTranslation();

  if (items.length === 0 && !emptyMessage) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {showMoreButton && onShowMore && items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowMore}
            className="text-primary hover:text-primary/80 hover:bg-primary/10 font-medium"
          >
            {t("search.showMore")} →
          </Button>
        )}
      </div>
      {items.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-left-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
