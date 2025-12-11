import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { MobileStorage } from "../services/mobile-storage.service";
import { SettingsSection } from "@repo/ui";
import { useSettingsViewModel } from "../viewmodels/use-settings-viewmodel";
import { usePlatform } from "../hooks/use-platform";
import { PageTransition } from "../components/page-transition";

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
  const { isMobile } = usePlatform();

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
      <PageTransition className={`p-4 ${isMobile ? 'pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)]' : ''}`}>
        <SettingsSection
          currentLocale={currentLocale}
          notificationsEnabled={notificationsEnabled}
          isLoggingOut={isLoggingOut}
          isDeletingAccount={isDeletingAccount}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          onChangeLanguage={handleChangeLanguage}
          onToggleNotifications={handleToggleNotifications}
          onBack={() => navigate({ to: "/profile" })}
        />
      </PageTransition>
    </div>
  );
}
