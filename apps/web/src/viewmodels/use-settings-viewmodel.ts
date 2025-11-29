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

export function useSettingsViewModel() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
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
