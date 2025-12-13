"use client";

import { useRouter } from "next/navigation";
import { SettingsSection, PrivacySettingsDialog } from "@repo/ui";
import { useSettingsViewModel } from "@/viewmodels/use-settings-viewmodel";

export default function SettingsPage() {
  const router = useRouter();
  const {
    currentLocale,
    currentTheme,
    notificationsEnabled,
    isPrivate,
    showPrivacyDialog,
    isLoggingOut,
    isDeletingAccount,
    isUpdatingPrivacy,
    handleLogout,
    handleDeleteAccount,
    handleChangeLanguage,
    handleChangeTheme,
    handleToggleNotifications,
    handleOpenPrivacySettings,
    handleSavePrivacySettings,
    setShowPrivacyDialog,
  } = useSettingsViewModel();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <SettingsSection
        currentLocale={currentLocale}
        currentTheme={currentTheme}
        notificationsEnabled={notificationsEnabled}
        isPrivate={isPrivate}
        isLoggingOut={isLoggingOut}
        isDeletingAccount={isDeletingAccount}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        onChangeLanguage={handleChangeLanguage}
        onChangeTheme={handleChangeTheme}
        onToggleNotifications={handleToggleNotifications}
        onOpenPrivacySettings={handleOpenPrivacySettings}
        onBack={() => router.back()}
      />

      <PrivacySettingsDialog
        open={showPrivacyDialog}
        onOpenChange={setShowPrivacyDialog}
        currentIsPrivate={isPrivate}
        onSave={handleSavePrivacySettings}
        isLoading={isUpdatingPrivacy}
      />
    </div>
  );
}
