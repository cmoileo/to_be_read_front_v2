"use client";

import { RegisterForm } from "@repo/ui";
import { useRegisterViewModel } from "@/viewmodels/use-register-viewmodel";

export default function RegisterPage() {
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
