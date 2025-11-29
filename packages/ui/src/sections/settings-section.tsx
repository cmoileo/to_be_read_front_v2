"use client";

import { useState } from "react";
import { LogOut, Trash2, Globe, Bell, ChevronRight, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { Switch } from "../components/switch";
import { Separator } from "../components/separator";
import { useTranslation } from "react-i18next";

interface SettingsSectionProps {
  currentLocale?: string;
  notificationsEnabled?: boolean;
  isLoggingOut?: boolean;
  isDeletingAccount?: boolean;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  onChangeLanguage?: (locale: string) => void;
  onToggleNotifications?: (enabled: boolean) => void;
}

export const SettingsSection = ({
  currentLocale = "en",
  notificationsEnabled = true,
  isLoggingOut = false,
  isDeletingAccount = false,
  onLogout,
  onDeleteAccount,
  onChangeLanguage,
  onToggleNotifications,
}: SettingsSectionProps) => {
  const { t } = useTranslation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(false);
    onLogout?.();
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(false);
    onDeleteAccount?.();
  };

  return (
    <>
      <Card className="border-none shadow-none bg-transparent px-4">
        <CardHeader className="px-0">
          <CardTitle className="text-xl">{t("settings.title")}</CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{t("settings.language")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.languageDescription")}</p>
              </div>
            </div>
            <Select value={currentLocale} onValueChange={(value) => onChangeLanguage?.(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{t("settings.notifications")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("settings.notificationsDescription")}
                </p>
              </div>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={(checked) => onToggleNotifications?.(checked)}
            />
          </div>

          <Separator />

          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full flex items-center justify-between py-3 hover:bg-muted/50 rounded-lg transition-colors px-2 -mx-2"
            disabled={isLoggingOut}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                <LogOut className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium">{t("settings.logout")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.logoutDescription")}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <Separator />

          <button
            onClick={() => setShowDeleteDialog(true)}
            className="w-full flex items-center justify-between py-3 hover:bg-destructive/10 rounded-lg transition-colors px-2 -mx-2"
            disabled={isDeletingAccount}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-destructive/10">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div className="text-left">
                <p className="font-medium text-destructive">{t("settings.deleteAccount")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("settings.deleteAccountDescription")}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("settings.logoutConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("settings.logoutConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? t("common.loading") : t("settings.logout")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertDialogTitle className="text-destructive">
                {t("settings.deleteAccountConfirmTitle")}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {t("settings.deleteAccountConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingAccount ? t("common.loading") : t("settings.deleteAccountConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
