"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TokenStorage } from "@repo/services";
import { loginAction } from "@/app/_auth/actions";
import type { LoginFormValues } from "@repo/ui";

export function useLoginViewModel() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const login = async (values: LoginFormValues) => {
    setError("");
    startTransition(async () => {
      try {
        const { rememberMe, ...credentials } = values;
        const result = await loginAction({
          ...credentials,
          rememberMe,
        });
        TokenStorage.setToken(result.accessToken);
        router.push("/");
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue lors de la connexion");
      }
    });
  };

  const navigateToRegister = () => {
    router.push("/register");
  };

  const navigateToResetPassword = () => {
    router.push("/reset-password");
  };

  return {
    login,
    isLoading: isPending,
    error,
    navigateToRegister,
    navigateToResetPassword,
  };
}
