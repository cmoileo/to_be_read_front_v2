import { Button } from "../components/button";
import { useTranslation } from "react-i18next";

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {showMoreButton && onShowMore && items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onShowMore}>
            {t("search.showMore")}
          </Button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index}>{renderItem(item, index)}</div>
          ))}
        </div>
      )}
    </div>
  );
}
