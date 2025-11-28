"use client";

import { useRouter } from "next/navigation";
import { ToReadListScreen, useTranslation, ArrowLeft } from "@repo/ui";
import { useToReadListViewModel } from "@/viewmodels/use-to-read-list-viewmodel";

export default function ReadingListClient() {
  const router = useRouter();
  const { t } = useTranslation();

  const { items, isLoading, hasMore, isFetchingMore, handleLoadMore, handleRemoveFromList } =
    useToReadListViewModel();

  const handleBack = () => {
    router.back();
  };

  const handleBookClick = (googleBookId: string) => {
    router.push(`/book/${googleBookId}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">{t("toReadList.title")}</h1>
      </div>
      <ToReadListScreen
        items={items}
        isLoading={isLoading}
        hasMore={hasMore}
        isFetchingMore={isFetchingMore}
        onLoadMore={handleLoadMore}
        onBookClick={handleBookClick}
        onRemove={handleRemoveFromList}
      />
    </div>
  );
}
