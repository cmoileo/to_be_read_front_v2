import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@repo/ui";
import { MobileStorage } from "../services/mobile-storage.service";
import { useLoginViewModel } from "../viewmodels/use-login-viewmodel";

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
    <div className="flex min-h-screen items-center justify-center p-6">
      <LoginForm
        onSubmit={viewModel.login}
        isLoading={viewModel.isLoading}
        error={viewModel.error}
        onRegisterClick={viewModel.navigateToRegister}
        onForgotPasswordClick={viewModel.navigateToResetPassword}
      />
    </div>
  );
}
