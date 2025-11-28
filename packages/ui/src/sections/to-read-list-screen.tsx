import { useTranslation } from "react-i18next";
import { ToReadListItemCard } from "../components/to-read-list-item-card";
import { Button } from "../components/button";
import { Loader2, BookOpen } from "lucide-react";
import type { ToReadListItem } from "@repo/types";

interface ToReadListScreenProps {
  items: ToReadListItem[];
  isLoading: boolean;
  hasMore: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
  onBookClick: (bookId: string) => void;
  onRemove: (googleBookId: string) => void;
  isRemoving?: boolean;
}

export function ToReadListScreen({
  items,
  isLoading,
  hasMore,
  isFetchingMore,
  onLoadMore,
  onBookClick,
  onRemove,
  isRemoving = false,
}: ToReadListScreenProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{t("toReadList.empty")}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">{t("toReadList.emptyDescription")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ToReadListItemCard
          key={item.id}
          item={item}
          onBookClick={onBookClick}
          onRemove={onRemove}
          isRemoving={isRemoving}
        />
      ))}

      {hasMore && (
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={onLoadMore}
            disabled={isFetchingMore}
          >
            {isFetchingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("common.loading")}
              </>
            ) : (
              t("common.loadMore")
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
