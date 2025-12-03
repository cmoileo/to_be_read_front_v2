import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useConnectedUser } from "@repo/stores";
import { MobileAuthService } from "../services/mobile-auth.service";
import { MobileStorage } from "../services/mobile-storage.service";
import { AuthApi } from "@repo/api-client";
import type { RegisterFormValues } from "@repo/ui";
import type { User } from "@repo/types";

function getBrowserLocale(): "en" | "fr" {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language || (navigator as any).userLanguage || "en";
  return lang.startsWith("fr") ? "fr" : "en";
}

export function useRegisterViewModel() {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { setUser } = useConnectedUser();
  const rememberMeRef = useRef<boolean>(false);

  const registerMutation = useMutation({
    mutationFn: MobileAuthService.register,
    onSuccess: async (data) => {
      const accessToken = data.token.token;
      await MobileStorage.setAccessToken(accessToken);
      await MobileStorage.setRefreshToken(data.refreshToken);
      await MobileStorage.setRememberMe(rememberMeRef.current);
      setUser(data.user as User);
      navigate({ to: "/" });
    },
    onError: (err) => {
      setError(err.message || "Une erreur est survenue lors de l'inscription");
    },
  });

  const register = (values: RegisterFormValues) => {
    setError("");
    rememberMeRef.current = values.rememberMe ?? false;
    const credentials = {
      userName: values.username,
      email: values.email,
      password: values.password,
      locale: getBrowserLocale(),
    };
    registerMutation.mutate(credentials);
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const result = await AuthApi.isUsernameAvailable(username);
      return result.available;
    } catch {
      return false;
    }
  };

  const navigateToLogin = () => {
    navigate({ to: "/login" });
  };

  return {
    register,
    isLoading: registerMutation.isPending,
    error,
    checkUsernameAvailability,
    navigateToLogin,
  };
}
