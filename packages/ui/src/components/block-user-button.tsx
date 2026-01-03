"use client";

import { useState } from "react";
import { Ban, Loader2, UserCheck } from "lucide-react";
import { Button } from "./button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import { useTranslation } from "react-i18next";

interface BlockUserButtonProps {
  isBlocked: boolean;
  isLoading?: boolean;
  onBlock: () => void;
  onUnblock: () => void;
  variant?: "button" | "dropdown";
}

export const BlockUserButton = ({
  isBlocked,
  isLoading = false,
  onBlock,
  onUnblock,
  variant = "button",
}: BlockUserButtonProps) => {
  const { t } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleBlockClick = () => {
    if (isBlocked) {
      onUnblock();
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmBlock = () => {
    setShowConfirmDialog(false);
    onBlock();
  };

  if (variant === "dropdown") {
    return (
      <>
        <button
          onClick={handleBlockClick}
          disabled={isLoading}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-sm transition-colors"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isBlocked ? (
            <UserCheck className="h-4 w-4" />
          ) : (
            <Ban className="h-4 w-4" />
          )}
          {isBlocked ? t("block.unblock") : t("block.block")}
        </button>

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("block.confirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("block.confirmDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmBlock}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("block.block")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <Button
        variant={isBlocked ? "outline" : "destructive"}
        size="sm"
        onClick={handleBlockClick}
        disabled={isLoading}
        className="gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isBlocked ? (
          <UserCheck className="h-4 w-4" />
        ) : (
          <Ban className="h-4 w-4" />
        )}
        {isBlocked ? t("block.unblock") : t("block.block")}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("block.confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("block.confirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBlock}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("block.block")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
