"use client";

import { useRouter } from "next/navigation";
import { SettingsSection } from "@repo/ui";
import { useSettingsViewModel } from "@/viewmodels/use-settings-viewmodel";

export default function SettingsPage() {
  const router = useRouter();
  const {
    currentLocale,
    currentTheme,
    notificationsEnabled,
    isLoggingOut,
    isDeletingAccount,
    handleLogout,
    handleDeleteAccount,
    handleChangeLanguage,
    handleChangeTheme,
    handleToggleNotifications,
  } = useSettingsViewModel();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <SettingsSection
        currentLocale={currentLocale}
        currentTheme={currentTheme}
        notificationsEnabled={notificationsEnabled}
        isLoggingOut={isLoggingOut}
        isDeletingAccount={isDeletingAccount}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        onChangeLanguage={handleChangeLanguage}
        onChangeTheme={handleChangeTheme}
        onToggleNotifications={handleToggleNotifications}
        onBack={() => router.back()}
      />
    </div>
  );
}
