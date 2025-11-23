"use client";

import { ResetPasswordRequestForm } from "@repo/ui";
import { useResetPasswordViewModel } from "@/viewmodels/use-reset-password-viewmodel";

export default function ResetPasswordPage() {
  const viewModel = useResetPasswordViewModel();

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <ResetPasswordRequestForm
        onSubmit={viewModel.requestReset}
        isLoading={viewModel.isLoading}
        error={viewModel.error}
        success={viewModel.success}
        onBackToLoginClick={viewModel.navigateToLogin}
      />
    </div>
  );
}
