import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MobileStorage } from "../services/mobile-storage.service";
import { MobileAuthService } from "../services/mobile-auth.service";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const useMobileLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MobileAuthService.login,
    onSuccess: async (data) => {
      await MobileStorage.setAccessToken(data.token.token);
      await MobileStorage.setRefreshToken(data.refreshToken);
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
};

export const useMobileRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MobileAuthService.register,
    onSuccess: async (data) => {
      await MobileStorage.setAccessToken(data.token.token);
      await MobileStorage.setRefreshToken(data.refreshToken);
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
};

export const useMobileLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MobileAuthService.logout,
    onSuccess: async () => {
      await MobileStorage.clearTokens();
      queryClient.clear();
    },
    onError: async () => {
      await MobileStorage.clearTokens();
      queryClient.clear();
    },
  });
};

export const useMobileMe = (enabled = true) => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const response = await MobileAuthService.getMe();
      return response.user;
    },
    enabled,
    retry: false,
  });
};
