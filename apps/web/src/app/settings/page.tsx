"use client";

import { useRouter } from "next/navigation";
import { SettingsSection } from "@repo/ui";
import { useSettingsViewModel } from "@/viewmodels/use-settings-viewmodel";

export default function SettingsPage() {
  const router = useRouter();
  const {
    currentLocale,
    notificationsEnabled,
    isLoggingOut,
    isDeletingAccount,
    handleLogout,
    handleDeleteAccount,
    handleChangeLanguage,
    handleToggleNotifications,
  } = useSettingsViewModel();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <SettingsSection
        currentLocale={currentLocale}
        notificationsEnabled={notificationsEnabled}
        isLoggingOut={isLoggingOut}
        isDeletingAccount={isDeletingAccount}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        onChangeLanguage={handleChangeLanguage}
        onToggleNotifications={handleToggleNotifications}
        onBack={() => router.back()}
      />
    </div>
  );
}
