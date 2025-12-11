import { createFileRoute, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { MobileStorage } from "../services/mobile-storage.service";
import {
  BottomNav,
  useTranslation,
  CreateReviewForm,
  useToast,
  Home,
  Search,
  PenSquare,
  User,
} from "@repo/ui";
import { useCreateReviewViewModel } from "../viewmodels/use-create-review-viewmodel";
import { usePlatform } from "../hooks/use-platform";
import { PageTransition } from "../components/page-transition";

export const Route = createFileRoute("/create-review")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: CreateReviewPage,
});

function CreateReviewPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { toast } = useToast();
  const viewModel = useCreateReviewViewModel();
  const { isMobile } = usePlatform();

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

  const handleSubmit = async (data: { content: string; value: number; googleBookId: string }) => {
    const success = await viewModel.createReview(data);
    if (success) {
      toast({
        title: t("review.success.title"),
        description: t("review.success.description"),
      });
      navigate({ to: "/" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PageTransition className={`flex-1 p-6 pb-20 overflow-y-auto ${isMobile ? 'pt-[calc(env(safe-area-inset-top)+1.5rem)]' : ''}`}>
        <CreateReviewForm
          onSubmit={handleSubmit}
          onSearchBooks={viewModel.searchBooks}
          isLoading={viewModel.isLoading}
          error={viewModel.error}
        />
      </PageTransition>

      <BottomNav items={navItems} onNavigate={handleNavigate} />
    </div>
  );
}
