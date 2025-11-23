import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuthModel } from "../models/hooks/use-auth-model";
import { MobileAuthService } from "../services/mobile-auth.service";
import { MobileStorage } from "../services/mobile-storage.service";
import type { LoginFormValues } from "@repo/ui";
import type { UserBasic } from "@repo/types";

export function useLoginViewModel() {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { setUser } = useAuthModel();

  const loginMutation = useMutation({
    mutationFn: MobileAuthService.login,
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

  const login = (values: LoginFormValues) => {
    setError("");
    loginMutation.mutate(values);
  };

  const navigateToRegister = () => {
    navigate({ to: "/register" });
  };

  const navigateToResetPassword = () => {
    navigate({ to: "/reset-password" });
  };

  return {
    login,
    isLoading: loginMutation.isPending,
    error,
    navigateToRegister,
    navigateToResetPassword,
  };
}
