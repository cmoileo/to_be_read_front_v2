"use client";

import { ResetPasswordConfirmForm } from "@repo/ui";
import { useResetPasswordConfirmViewModel } from "@/viewmodels/use-reset-password-confirm-viewmodel";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordConfirmPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const viewModel = useResetPasswordConfirmViewModel();

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Token invalide</h2>
          <p className="text-muted-foreground">
            Le lien de réinitialisation est invalide ou a expiré.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <ResetPasswordConfirmForm
        onSubmit={viewModel.confirmReset}
        token={token}
        isLoading={viewModel.isLoading}
        error={viewModel.error}
      />
    </div>
  );
}
