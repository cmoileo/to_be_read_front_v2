"use client";

import { LoginForm } from "@repo/ui";
import { loginAction } from "../_auth/actions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { LoginFormValues } from "@repo/ui";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const handleLogin = async (values: LoginFormValues) => {
    setError("");
    startTransition(async () => {
      try {
        await loginAction(values);
        router.push("/");
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue lors de la connexion");
      }
    });
  };

  const goToRegister = () => {
    router.push("/register");
  };

  const goToForgotPassword = () => {
    router.push("/reset-password");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isPending}
        error={error}
        onRegisterClick={goToRegister}
        onForgotPasswordClick={goToForgotPassword}
      />
    </div>
  );
}
