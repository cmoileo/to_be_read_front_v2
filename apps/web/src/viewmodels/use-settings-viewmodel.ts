import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  logoutAction,
  deleteAccountAction,
  updateNotificationSettingsAction,
  getUserFromCookies,
} from "@/app/_auth/actions";
import { updateProfileAction } from "@/app/_profile/actions";
import { useTheme } from "@/providers/theme-provider";

export function useSettingsViewModel() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [currentLocale, setCurrentLocale] = useState(i18n.language || "en");

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => getUserFromCookies(),
    staleTime: 60000,
  });

  const notificationsEnabled = user?.pushNotificationsEnabled ?? true;

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logoutAction();
    },
    onSuccess: () => {
      router.push("/login");
      router.refresh();
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return deleteAccountAction();
    },
    onSuccess: () => {
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
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });

  const notificationSettingsMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      return updateNotificationSettingsAction(enabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
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

  return {
    currentLocale,
    currentTheme: theme,
    notificationsEnabled,
    isLoggingOut: logoutMutation.isPending,
    isDeletingAccount: deleteAccountMutation.isPending,
    handleLogout,
    handleDeleteAccount,
    handleChangeLanguage,
    handleChangeTheme,
    handleToggleNotifications,
  };
}
