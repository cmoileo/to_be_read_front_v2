"use client";

import { ResetPasswordConfirmForm } from "@repo/ui";
import { resetPasswordConfirm } from "../../_auth/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { ResetPasswordConfirmFormValues } from "@repo/ui";

export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetConfirm = async (values: ResetPasswordConfirmFormValues) => {
    setError("");
    setIsLoading(true);
    
    try {
      await resetPasswordConfirm({ token: values.token, password: values.password });
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

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
        onSubmit={handleResetConfirm}
        token={token}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
