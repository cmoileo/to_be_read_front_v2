import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@repo/ui";
import { MobileStorage } from "../services/mobile-storage.service";
import { useLoginViewModel } from "../viewmodels/use-login-viewmodel";
import { PageTransition } from "../components/page-transition";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (hasTokens) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const viewModel = useLoginViewModel();

  return (
    <PageTransition className="flex min-h-screen items-center justify-center p-6 safe-area-inset-top safe-area-inset-bottom">
      <LoginForm
        onSubmit={viewModel.login}
        isLoading={viewModel.isLoading}
        error={viewModel.error}
        onRegisterClick={viewModel.navigateToRegister}
        onForgotPasswordClick={viewModel.navigateToResetPassword}
      />
    </PageTransition>
  );
}
