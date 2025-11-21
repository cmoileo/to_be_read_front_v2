import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@repo/ui";
import { useState } from "react";
import { useLogin } from "@repo/api-client";
import { TokenStorage } from "@repo/services";
import { useAuthModel } from "../models/hooks/use-auth-model";
import type { LoginFormValues } from "@repo/ui";
import type { UserBasic } from "@repo/types";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [error, setError] = useState<string>("");
  const navigate = Route.useNavigate();
  const { setUser } = useAuthModel();
  
  const loginMutation = useLogin();

  const handleSubmit = async (values: LoginFormValues) => {
    setError("");
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        TokenStorage.setToken(data.token.token);
        setUser(data.user as UserBasic);
        navigate({ to: "/" });
      },
      onError: (err) => {
        setError(err.message || "Une erreur est survenue lors de la connexion");
      },
    });
  };

  const goToRegister = () => {
    navigate({ to: "/register" });
  };

  const goToForgotPassword = () => {
    navigate({ to: "/reset-password" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <LoginForm
        onSubmit={handleSubmit}
        isLoading={loginMutation.isPending}
        error={error}
        onRegisterClick={goToRegister}
        onForgotPasswordClick={goToForgotPassword}
      />
    </div>
  );
}
