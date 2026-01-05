import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { MobileAuthService } from "../services/mobile-auth.service";
import { MobileProfileService } from "../services/mobile-profile.service";
import { useConnectedUser } from "@repo/stores";
import { useToast } from "@repo/ui";
import { useTheme } from "../providers/theme-provider";

export function useSettingsViewModel() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { i18n, t } = useTranslation();
  const { clearUser } = useConnectedUser();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(i18n.language || "en");

  useEffect(() => {
    console.log("[Settings] Current theme from context:", theme);
  }, [theme]);

  const { data: meData } = useQuery({
    queryKey: ["me-settings"],
    queryFn: () => MobileAuthService.getMe(),
    staleTime: 30000,
  });

  const user = meData?.user;
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
      queryClient.invalidateQueries({ queryKey: ["me-settings"] });
      queryClient.invalidateQueries({ queryKey: ["connectedUser"] });
      i18n.changeLanguage(locale);
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
    setCurrentLocale(locale);
    i18n.changeLanguage(locale);
    changeLanguageMutation.mutate(locale);
  };

  const handleChangeTheme = (newTheme: "light" | "dark" | "system") => {
    console.log("[Settings] Changing theme to:", newTheme, "Current:", theme);
    setTheme(newTheme);
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

  const handleOpenLegal = () => {
    navigate({ to: "/legal" });
  };

  return {
    currentLocale,
    currentTheme: theme,
    notificationsEnabled,
    isPrivate,
    showPrivacyDialog,
    isLoggingOut: logoutMutation.isPending,
    isDeletingAccount: deleteAccountMutation.isPending,
    isUpdatingPrivacy: privacySettingsMutation.isPending,
    handleLogout,
    handleDeleteAccount,
    handleChangeLanguage,
    handleChangeTheme,
    handleToggleNotifications,
    handleOpenPrivacySettings,
    handleSavePrivacySettings,
    handleOpenLegal,
    setShowPrivacyDialog,
  };
}
