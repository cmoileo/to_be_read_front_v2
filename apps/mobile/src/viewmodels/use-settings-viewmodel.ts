import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { MobileAuthService } from "../services/mobile-auth.service";
import { MobileProfileService } from "../services/mobile-profile.service";
import { useConnectedUser } from "@repo/stores";
import { MobileStorage } from "../services/mobile-storage.service";
import { useToast } from "@repo/ui";

export function useSettingsViewModel() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { i18n, t } = useTranslation();
  const { clearUser } = useConnectedUser();
  const { toast } = useToast();
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);

  const { data: meData } = useQuery({
    queryKey: ["me-settings"],
    queryFn: () => MobileAuthService.getMe(),
    staleTime: 30000,
  });

  const user = meData?.user;
  const currentLocale = user?.locale || i18n.language || "en";
  const notificationsEnabled = user?.pushNotificationsEnabled ?? true;
  const isPrivate = user?.isPrivate ?? false;

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await MobileAuthService.logout();
    },
    onSuccess: async () => {
      clearUser();
      queryClient.clear();
      await navigate({ to: "/onboarding", replace: true });
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

  const privacySettingsMutation = useMutation({
    mutationFn: async (isPrivate: boolean) => {
      return MobileAuthService.updatePrivacySettings({ isPrivate });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["me-settings"] });
      queryClient.invalidateQueries({ queryKey: ["connectedUser"] });
      setShowPrivacyDialog(false);
      toast({
        title: t("common.save"),
        description: data.message || t("settings.privacy.updated"),
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: t("common.error"),
        variant: "destructive",
      });
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

  const handleOpenPrivacySettings = () => {
    setShowPrivacyDialog(true);
  };

  const handleSavePrivacySettings = (isPrivate: boolean) => {
    privacySettingsMutation.mutate(isPrivate);
  };

  return {
    currentLocale,
    notificationsEnabled,
    isPrivate,
    showPrivacyDialog,
    isLoggingOut: logoutMutation.isPending,
    isDeletingAccount: deleteAccountMutation.isPending,
    isUpdatingPrivacy: privacySettingsMutation.isPending,
    handleLogout,
    handleDeleteAccount,
    handleChangeLanguage,
    handleToggleNotifications,
    handleOpenPrivacySettings,
    handleSavePrivacySettings,
    setShowPrivacyDialog,
  };
}
