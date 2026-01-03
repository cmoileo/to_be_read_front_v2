import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { MobileStorage } from "../services/mobile-storage.service";
import {
  BlockedUsersList,
  useTranslation,
  ArrowLeft,
} from "@repo/ui";
import { useBlockedUsersViewModel } from "../viewmodels/use-blocked-users-viewmodel";
import { usePlatform } from "../hooks/use-platform";
import { PageTransition } from "../components/page-transition";

export const Route = createFileRoute("/blocked-users")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: BlockedUsersPage,
});

function BlockedUsersPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { t } = useTranslation();
  const { isMobile } = usePlatform();

  const {
    blockedUsers,
    isLoading,
    hasMore,
    isFetchingMore,
    unblockingUserId,
    handleUnblock,
    handleLoadMore,
  } = useBlockedUsersViewModel();

  const handleBack = () => {
    router.history.back();
  };

  const handleUserClick = (userId: number) => {
    navigate({ to: `/user/${userId}` });
  };

  return (
    <PageTransition className="min-h-screen">
      <div className={`p-4 border-b ${isMobile ? 'pt-[calc(env(safe-area-inset-top)+1rem)]' : ''}`}>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors haptic-tap"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t("common.back")}</span>
        </button>
      </div>

      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">{t("block.blockedUsers")}</h1>
        
        <BlockedUsersList
          users={blockedUsers}
          isLoading={isLoading}
          hasMore={hasMore}
          isFetchingMore={isFetchingMore}
          unblockingUserId={unblockingUserId}
          onUnblock={handleUnblock}
          onLoadMore={handleLoadMore}
          onUserClick={handleUserClick}
        />
      </div>
    </PageTransition>
  );
}
