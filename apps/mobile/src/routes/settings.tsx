import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { MobileStorage } from "../services/mobile-storage.service";
import { SettingsSection, ArrowLeft } from "@repo/ui";
import { useSettingsViewModel } from "../viewmodels/use-settings-viewmodel";

export const Route = createFileRoute("/settings")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-background">
      <div className="p-4">
        <button
          onClick={() => navigate({ to: "/profile" })}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <SettingsSection
          currentLocale={currentLocale}
          notificationsEnabled={notificationsEnabled}
          isLoggingOut={isLoggingOut}
          isDeletingAccount={isDeletingAccount}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          onChangeLanguage={handleChangeLanguage}
          onToggleNotifications={handleToggleNotifications}
        />
      </div>
    </div>
  );
}
