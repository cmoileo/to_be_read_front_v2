import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { MobileStorage } from "../services/mobile-storage.service";
import { ToReadListScreen, useTranslation, ArrowLeft } from "@repo/ui";
import { useToReadListViewModel } from "../viewmodels/use-to-read-list-viewmodel";

export const Route = createFileRoute("/to-read-list")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: ToReadListPage,
});

function ToReadListPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { t } = useTranslation();

  const { items, isLoading, hasMore, isFetchingMore, handleLoadMore, handleRemoveFromList } =
    useToReadListViewModel();

  const handleBack = () => {
    router.history.back();
  };

  const handleBookClick = (googleBookId: string) => {
    navigate({ to: `/book/${googleBookId}` });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="p-4 border-b flex items-center gap-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">{t("toReadList.title")}</h1>
      </div>
      <div className="flex-1 p-4">
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
    </div>
  );
}
