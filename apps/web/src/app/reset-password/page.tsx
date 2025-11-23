"use client";

import { ResetPasswordRequestForm } from "@repo/ui";
import { resetPasswordRequest } from "../_auth/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ResetPasswordRequestFormValues } from "@repo/ui";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: ResetPasswordRequestFormValues) => {
    setError("");
    setSuccess(false);
    setIsLoading(true);
    
    try {
      await resetPasswordRequest(values.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <ResetPasswordRequestForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        success={success}
        onBackToLoginClick={goBackToLogin}
      />
    </div>
  );
}
