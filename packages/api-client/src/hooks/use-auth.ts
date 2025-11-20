import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TokenStorage } from "@repo/services";
import { AuthApi } from "../apis/auth.api";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.register,
    onSuccess: (data) => {
      TokenStorage.setToken(data.token.token);
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.login,
    onSuccess: (data) => {
      TokenStorage.setToken(data.token.token);
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.logout,
    onSuccess: () => {
      TokenStorage.clearToken();
      queryClient.clear();
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const response = await AuthApi.getMe();
      return response.user;
    },
    enabled: TokenStorage.hasToken(),
    retry: false,
  });
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
};

export const useDeleteMe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.deleteMe,
    onSuccess: () => {
      TokenStorage.clearToken();
      queryClient.clear();
    },
  });
};

export const useIsUsernameAvailable = (username: string) => {
  return useQuery({
    queryKey: ["username-available", username],
    queryFn: () => AuthApi.isUsernameAvailable(username),
    enabled: username.length >= 3,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: AuthApi.resetPassword,
  });
};

export const useResetPasswordConfirm = () => {
  return useMutation({
    mutationFn: AuthApi.resetPasswordConfirm,
  });
};
