"use client";

import { RegisterForm } from "@repo/ui";
import { registerAction, checkUsernameAvailability } from "../_auth/actions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { RegisterFormValues } from "@repo/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const handleRegister = async (values: RegisterFormValues) => {
    setError("");
    const credentials = {
      userName: values.username,
      email: values.email,
      password: values.password,
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

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isPending}
        error={error}
        isUsernameAvailable={checkUsername}
        onLoginClick={goToLogin}
      />
    </div>
  );
}
