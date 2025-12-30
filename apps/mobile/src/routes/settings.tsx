import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { MobileStorage } from "../services/mobile-storage.service";
import { SettingsSection, PrivacySettingsDialog, Button } from "@repo/ui";
import { useSettingsViewModel } from "../viewmodels/use-settings-viewmodel";
import { usePlatform } from "../hooks/use-platform";
import { PageTransition } from "../components/page-transition";
import { Bug } from "lucide-react";

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
    isPrivate,
    showPrivacyDialog,
    isLoggingOut,
    isDeletingAccount,
    isUpdatingPrivacy,
    handleLogout,
    handleDeleteAccount,
    handleChangeLanguage,
    handleToggleNotifications,
    handleOpenPrivacySettings,
    handleSavePrivacySettings,
    setShowPrivacyDialog,
  } = useSettingsViewModel();

  return (
    <div className="min-h-screen bg-background">
      <PageTransition className={`p-4 ${isMobile ? 'pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)]' : ''}`}>
        <SettingsSection
          currentLocale={currentLocale}
          notificationsEnabled={notificationsEnabled}
          isPrivate={isPrivate}
          isLoggingOut={isLoggingOut}
          isDeletingAccount={isDeletingAccount}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          onChangeLanguage={handleChangeLanguage}
          onToggleNotifications={handleToggleNotifications}
          onOpenPrivacySettings={handleOpenPrivacySettings}
          onBack={() => navigate({ to: "/profile" })}
        />
        
        {/* Debug Button */}
        <Button
          onClick={() => navigate({ to: "/debug-logs" })}
          variant="outline"
          className="mt-4 w-full"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug Logs (Dev)
        </Button>
      </PageTransition>

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
