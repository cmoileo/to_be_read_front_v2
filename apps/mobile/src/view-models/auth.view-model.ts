import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useLogin, useIsUsernameAvailable } from "@repo/api-client";
import { TokenStorage } from "@repo/services";
import { useAuthModel } from "../models/hooks/use-auth-model";
import type { LoginFormValues } from "@repo/ui";

export const useLoginViewModel = () => {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { setUser } = useAuthModel();
  
  const loginMutation = useLogin({
    onSuccess: (data) => {
      TokenStorage.setToken(data.token);
      setUser(data.user);
      navigate({ to: "/" });
    },
    onError: (err) => {
      setError(err.message || "Une erreur est survenue lors de la connexion");
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setError("");
    loginMutation.mutate(values);
  };

  const goToRegister = () => {
    navigate({ to: "/register" });
  };

  const goToForgotPassword = () => {
    navigate({ to: "/reset-password" });
  };

  return {
    handleSubmit,
    isLoading: loginMutation.isPending,
    error,
    goToRegister,
    goToForgotPassword,
  };
};

export const useRegisterViewModel = () => {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { setUser } = useAuthModel();
  
  const registerMutation = useLogin({
    onSuccess: (data) => {
      TokenStorage.setToken(data.token);
      setUser(data.user);
      navigate({ to: "/" });
    },
    onError: (err) => {
      setError(err.message || "Une erreur est survenue lors de l'inscription");
    },
  });

  const isUsernameAvailableQuery = useIsUsernameAvailable();

  const handleSubmit = async (values: any) => {
    setError("");
    registerMutation.mutate(values);
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const result = await isUsernameAvailableQuery.mutateAsync(username);
      return result.available;
    } catch {
      return false;
    }
  };

  const goToLogin = () => {
    navigate({ to: "/login" });
  };

  return {
    handleSubmit,
    isLoading: registerMutation.isPending,
    error,
    checkUsernameAvailability,
    goToLogin,
  };
};

export const useResetPasswordRequestViewModel = () => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string }) => {
    setError("");
    setSuccess(false);
    
    try {
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    }
  };

  const goBackToLogin = () => {
    navigate({ to: "/login" });
  };

  return {
    handleSubmit,
    isLoading: false,
    error,
    success,
    goBackToLogin,
  };
};

export const useResetPasswordConfirmViewModel = (token: string) => {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    setError("");
    
    try {
      navigate({ to: "/login" });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    }
  };

  return {
    handleSubmit,
    isLoading: false,
    error,
    token,
  };
};
