import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { MobileAuthService } from "../services/mobile-auth.service";
import { MobileProfileService } from "../services/mobile-profile.service";
import { useConnectedUser } from "@repo/stores";
import { MobileStorage } from "../services/mobile-storage.service";

export function useSettingsViewModel() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const { clearUser } = useConnectedUser();

  const { data: meData } = useQuery({
    queryKey: ["me-settings"],
    queryFn: () => MobileAuthService.getMe(),
    staleTime: 30000,
  });

  const user = meData?.user;
  const currentLocale = user?.locale || i18n.language || "en";
  const notificationsEnabled = user?.pushNotificationsEnabled ?? true;

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await MobileAuthService.logout();
    },
    onSuccess: async () => {
      await MobileStorage.clearTokens();
      clearUser();
      navigate({ to: "/onboarding" });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return MobileAuthService.deleteAccount();
    },
    onSuccess: () => {
      clearUser();
      navigate({ to: "/onboarding" });
    },
  });

  const changeLanguageMutation = useMutation({
    mutationFn: async (locale: string) => {
      await MobileProfileService.updateProfile({ locale: locale as "en" | "fr" });
      return locale;
    },
    onSuccess: (locale) => {
      i18n.changeLanguage(locale);
      queryClient.invalidateQueries({ queryKey: ["me-settings"] });
    },
  });

  const notificationSettingsMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      return MobileAuthService.updateNotificationSettings(enabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me-settings"] });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  const handleChangeLanguage = (locale: string) => {
    changeLanguageMutation.mutate(locale);
  };

  const handleToggleNotifications = (enabled: boolean) => {
    notificationSettingsMutation.mutate(enabled);
  };

  return {
    currentLocale,
    notificationsEnabled,
    isLoggingOut: logoutMutation.isPending,
    isDeletingAccount: deleteAccountMutation.isPending,
    handleLogout,
    handleDeleteAccount,
    handleChangeLanguage,
    handleToggleNotifications,
  };
}
