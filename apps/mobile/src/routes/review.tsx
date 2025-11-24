import { createFileRoute, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { MobileStorage } from "../services/mobile-storage.service";
import { BottomNav, useTranslation, CreateReviewForm, useToast } from "@repo/ui";
import { useCreateReviewViewModel } from "../viewmodels/use-create-review-viewmodel";

export const Route = createFileRoute("/review")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: ReviewPage,
});

function ReviewPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { toast } = useToast();
  const viewModel = useCreateReviewViewModel();

  const navItems = [
    {
      label: t("navigation.home"),
      icon: "🏠",
      href: "/",
      isActive: currentPath === "/",
    },
    {
      label: t("navigation.search"),
      icon: "🔍",
      href: "/search",
      isActive: currentPath === "/search",
    },
    {
      label: t("navigation.createReview"),
      icon: "✍️",
      href: "/review",
      isActive: currentPath === "/review",
    },
    {
      label: t("navigation.profile"),
      icon: "👤",
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
      <div className="flex-1 p-6 pb-20 overflow-y-auto">
        <CreateReviewForm
          onSubmit={handleSubmit}
          onSearchBooks={viewModel.searchBooks}
          isLoading={viewModel.isLoading}
          error={viewModel.error}
        />
      </div>

      <BottomNav items={navItems} onNavigate={handleNavigate} />
    </div>
  );
}
