"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordRequest } from "@/app/_auth/actions";
import type { ResetPasswordRequestFormValues } from "@repo/ui";

export function useResetPasswordViewModel() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const requestReset = async (values: ResetPasswordRequestFormValues) => {
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

  const navigateToLogin = () => {
    router.push("/login");
  };

  return {
    requestReset,
    isLoading,
    error,
    success,
    navigateToLogin,
  };
}
