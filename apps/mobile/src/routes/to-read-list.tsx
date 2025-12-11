import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { MobileStorage } from "../services/mobile-storage.service";
import { ToReadListScreen, useTranslation, ArrowLeft } from "@repo/ui";
import { useToReadListViewModel } from "../viewmodels/use-to-read-list-viewmodel";
import { usePlatform } from "../hooks/use-platform";
import { PageTransition } from "../components/page-transition";

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
  const { isMobile } = usePlatform();

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
      <PageTransition>
        <div className={`p-4 border-b flex items-center gap-3 ${isMobile ? 'pt-[calc(env(safe-area-inset-top)+1rem)]' : ''}`}>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors haptic-tap"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{t("toReadList.title")}</h1>
        </div>
        <div className={`flex-1 p-4 ${isMobile ? 'pb-[calc(env(safe-area-inset-bottom)+1rem)]' : ''}`}>
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
      </PageTransition>
    </div>
  );
}
