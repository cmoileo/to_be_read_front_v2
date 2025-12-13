import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useToast } from "@repo/ui";
import {
  logoutAction,
  deleteAccountAction,
  updateNotificationSettingsAction,
  updatePrivacySettingsAction,
} from "@/app/_auth/actions";
import { updateProfileAction } from "@/app/_profile/actions";
import { useTheme } from "@/providers/theme-provider";
import { useConnectedUser, connectedUserKeys } from "@repo/stores";

export function useSettingsViewModel() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { i18n, t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { user, clearUser, updateUser } = useConnectedUser();
  const { toast } = useToast();
  const [currentLocale, setCurrentLocale] = useState(i18n.language || "en");
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);

  const notificationsEnabled = user?.pushNotificationsEnabled ?? true;
  const isPrivate = user?.isPrivate ?? false;

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logoutAction();
    },
    onSuccess: () => {
      clearUser();
      router.push("/login");
      router.refresh();
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return deleteAccountAction();
    },
    onSuccess: () => {
      clearUser();
      router.push("/login");
      router.refresh();
    },
  });

  const changeLanguageMutation = useMutation({
    mutationFn: async (locale: string) => {
      const formData = new FormData();
      formData.append("locale", locale);
      await updateProfileAction(formData);
      return locale;
    },
    onSuccess: (locale) => {
      setCurrentLocale(locale);
      i18n.changeLanguage(locale);
      updateUser({ locale: locale as "en" | "fr" });
    },
  });

  const changeThemeMutation = useMutation({
    mutationFn: async (newTheme: "light" | "dark" | "system") => {
      const formData = new FormData();
      formData.append("theme", newTheme);
      await updateProfileAction(formData);
      return newTheme;
    },
    onSuccess: (newTheme) => {
      setTheme(newTheme);
      updateUser({ theme: newTheme });
    },
  });

  const notificationSettingsMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      return updateNotificationSettingsAction(enabled);
    },
    onSuccess: (_, enabled) => {
      updateUser({ pushNotificationsEnabled: enabled });
    },
  });

  const privacySettingsMutation = useMutation({
    mutationFn: async (isPrivate: boolean) => {
      return updatePrivacySettingsAction(isPrivate);
    },
    onSuccess: (data) => {
      updateUser({ isPrivate: data.isPrivate });
      queryClient.invalidateQueries({ queryKey: connectedUserKeys.all });
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

  const handleChangeTheme = (newTheme: "light" | "dark" | "system") => {
    changeThemeMutation.mutate(newTheme);
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
    setShowPrivacyDialog,
  };
}
