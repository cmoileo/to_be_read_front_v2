import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterForm } from "@repo/ui";
import { MobileStorage } from "../services/mobile-storage.service";
import { useRegisterViewModel } from "../viewmodels/use-register-viewmodel";

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (hasTokens) {
      throw redirect({ to: "/" });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  const viewModel = useRegisterViewModel();

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <RegisterForm
        onSubmit={viewModel.register}
        isLoading={viewModel.isLoading}
        error={viewModel.error}
        isUsernameAvailable={viewModel.checkUsernameAvailability}
        onLoginClick={viewModel.navigateToLogin}
      />
    </div>
  );
}
