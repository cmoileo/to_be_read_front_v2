"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerAction, checkUsernameAvailability } from "@/app/_auth/actions";
import type { RegisterFormValues } from "@repo/ui";

export function useRegisterViewModel() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const register = async (values: RegisterFormValues) => {
    setError("");
    const { rememberMe, ...rest } = values;
    const credentials = {
      userName: rest.username,
      email: rest.email,
      password: rest.password,
      rememberMe,
    };
    
    startTransition(async () => {
      try {
        await registerAction(credentials);
        router.push("/");
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue lors de l'inscription");
      }
    });
  };

  const checkUsername = async (username: string): Promise<boolean> => {
    try {
      const result = await checkUsernameAvailability(username);
      return result.available;
    } catch {
      return false;
    }
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  return {
    register,
    isLoading: isPending,
    error,
    checkUsernameAvailability: checkUsername,
    navigateToLogin,
  };
}
