"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import type { ReportEntityType, ReportReason } from "@repo/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: ReportEntityType;
  entityId: number;
  onSubmit: (reason: ReportReason, description?: string) => void;
  isLoading?: boolean;
}

const REPORT_REASONS: ReportReason[] = [
  "SPAM",
  "HARASSMENT",
  "HATE_SPEECH",
  "SPOILERS",
  "INAPPROPRIATE",
  "OTHER",
];

export function ReportDialog({
  open,
  onOpenChange,
  entityType,
  entityId: _entityId,
  onSubmit,
  isLoading = false,
}: ReportDialogProps) {
  const { t } = useTranslation();
  const [reason, setReason] = React.useState<ReportReason | "">("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    onSubmit(reason, description || undefined);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setReason("");
      setDescription("");
    }
    onOpenChange(newOpen);
  };

  const getEntityLabel = () => {
    switch (entityType) {
      case "review":
        return t("report.entityTypes.review");
      case "comment":
        return t("report.entityTypes.comment");
      case "user":
        return t("report.entityTypes.user");
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("report.title")}</DialogTitle>
            <DialogDescription>
              {t("report.description", { entity: getEntityLabel() })}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">{t("report.reason")}</Label>
              <Select
                value={reason}
                onValueChange={(value) => setReason(value as ReportReason)}
              >
                <SelectTrigger id="reason">
                  <SelectValue placeholder={t("report.selectReason")} />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {t(`report.reasons.${r}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">
                {t("report.additionalDetails")}
              </Label>
              <Textarea
                id="description"
                placeholder={t("report.descriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={1000}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!reason || isLoading}
            >
              {isLoading ? t("common.loading") : t("report.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
