import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { MobileStorage } from "../../services/mobile-storage.service";
import {
  BottomNav,
  FollowListScreen,
  useTranslation,
  Home,
  Search,
  PenSquare,
  User,
  ArrowLeft,
} from "@repo/ui";
import { useFollowListViewModel } from "../../viewmodels/use-follow-list-viewmodel";

interface FollowingSearchParams {
  userName?: string;
}

export const Route = createFileRoute("/user/$userId/following")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  validateSearch: (search: Record<string, unknown>): FollowingSearchParams => {
    return {
      userName: typeof search.userName === "string" ? search.userName : undefined,
    };
  },
  component: FollowingPage,
});

function FollowingPage() {
  const { userId } = Route.useParams();
  const { userName } = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const { t } = useTranslation();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const userIdNumber = parseInt(userId, 10);

  const {
    users,
    isLoading,
    hasMore,
    isFetchingMore,
    handleLoadMore,
    handleFollow,
    handleUnfollow,
  } = useFollowListViewModel(userIdNumber, "following");

  const navItems = [
    {
      label: t("navigation.home"),
      icon: <Home className="w-6 h-6" />,
      href: "/",
      isActive: currentPath === "/",
    },
    {
      label: t("navigation.search"),
      icon: <Search className="w-6 h-6" />,
      href: "/search",
      isActive: currentPath === "/search",
    },
    {
      label: t("navigation.createReview"),
      icon: <PenSquare className="w-6 h-6" />,
      href: "/create-review",
      isActive: currentPath === "/create-review",
    },
    {
      label: t("navigation.profile"),
      icon: <User className="w-6 h-6" />,
      href: "/profile",
      isActive: currentPath === "/profile",
    },
  ];

  const handleNavigate = (href: string) => {
    navigate({ to: href });
  };

  const handleUserClick = (clickedUserId: number) => {
    navigate({ to: `/user/${clickedUserId}` });
  };

  const handleBack = () => {
    router.history.back();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 pb-20">
        <div className="p-4 border-b flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">
            {t("followList.followingTitle", { userName: userName || "" })}
          </h1>
        </div>

        <FollowListScreen
          type="following"
          users={users}
          isLoading={isLoading}
          hasMore={hasMore}
          isFetchingMore={isFetchingMore}
          onLoadMore={handleLoadMore}
          onUserClick={handleUserClick}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
        />
      </div>

      <BottomNav items={navItems} onNavigate={handleNavigate} />
    </div>
  );
}
