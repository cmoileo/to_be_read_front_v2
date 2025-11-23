"use client";

import { LoginForm } from "@repo/ui";
import { useLoginViewModel } from "@/viewmodels/use-login-viewmodel";

export default function LoginPage() {
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
