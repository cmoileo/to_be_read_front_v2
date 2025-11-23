import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@repo/ui";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthModel } from "../models/hooks/use-auth-model";
import type { LoginFormValues } from "@repo/ui";
import type { UserBasic } from "@repo/types";
import { MobileStorage } from "../services/mobile-storage.service";
import { MobileAuthService } from "../services/mobile-auth.service";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (hasTokens) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const [error, setError] = useState<string>("");
  const navigate = Route.useNavigate();
  const { setUser } = useAuthModel();
  
  const loginMutation = useMutation({
    mutationFn: MobileAuthService.login,
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setError("");
    loginMutation.mutate(values, {
      onSuccess: async (data) => {
        const accessToken = data.token.token;
        await MobileStorage.setAccessToken(accessToken);
        await MobileStorage.setRefreshToken(data.refreshToken);
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
