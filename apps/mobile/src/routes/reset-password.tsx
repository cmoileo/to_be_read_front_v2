import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordRequestForm } from "@repo/ui";
import { useState } from "react";
import { useResetPassword } from "@repo/api-client";
import type { ResetPasswordRequestFormValues } from "@repo/ui";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const navigate = Route.useNavigate();
  
  const resetPasswordMutation = useResetPassword();

  const handleSubmit = async (values: ResetPasswordRequestFormValues) => {
    setError("");
    setSuccess(false);
    
    resetPasswordMutation.mutate(values, {
      onSuccess: () => {
        setSuccess(true);
      },
      onError: (err) => {
        setError(err.message || "Une erreur est survenue");
      },
    });
  };

  const goBackToLogin = () => {
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <ResetPasswordRequestForm
        onSubmit={handleSubmit}
        isLoading={resetPasswordMutation.isPending}
        error={error}
        success={success}
        onBackToLoginClick={goBackToLogin}
      />
    </div>
  );
}
