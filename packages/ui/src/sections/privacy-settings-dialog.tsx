"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/dialog";
import { Button } from "../components/button";
import { Switch } from "../components/switch";
import { Label } from "../components/label";
import { useTranslation } from "react-i18next";

interface PrivacySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIsPrivate: boolean;
  onSave: (isPrivate: boolean) => void;
  isLoading?: boolean;
}

export const PrivacySettingsDialog = ({
  open,
  onOpenChange,
  currentIsPrivate,
  onSave,
  isLoading = false,
}: PrivacySettingsDialogProps) => {
  const { t } = useTranslation();
  const [isPrivate, setIsPrivate] = useState(currentIsPrivate);

  const handleSave = () => {
    onSave(isPrivate);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("settings.privacy.title")}</DialogTitle>
          <DialogDescription>{t("settings.privacy.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="private-mode" className="flex flex-col space-y-1">
              <span className="font-medium">{t("settings.privacy.privateAccount")}</span>
              <span className="font-normal text-sm text-muted-foreground">
                {t("settings.privacy.privateAccountDescription")}
              </span>
            </Label>
            <Switch
              id="private-mode"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={isLoading}
            />
          </div>

          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">{t("settings.privacy.whatIsPrivate")}</p>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>{t("settings.privacy.privateExplanation1")}</li>
              <li>{t("settings.privacy.privateExplanation2")}</li>
              <li>{t("settings.privacy.privateExplanation3")}</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
