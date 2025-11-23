"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordConfirm } from "@/app/_auth/actions";
import type { ResetPasswordConfirmFormValues } from "@repo/ui";

export function useResetPasswordConfirmViewModel() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const confirmReset = async (values: ResetPasswordConfirmFormValues) => {
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

  return {
    confirmReset,
    isLoading,
    error,
  };
}
