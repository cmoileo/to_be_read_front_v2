"use client";

import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { BookOpen } from "lucide-react";

export type AuthPromptType = "like" | "comment" | "follow" | "toReadList" | "review";

interface AuthPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptType: AuthPromptType;
  onLogin: () => void;
  onRegister: () => void;
}

export function AuthPromptDialog({
  open,
  onOpenChange,
  promptType,
  onLogin,
  onRegister,
}: AuthPromptDialogProps) {
  const { t } = useTranslation();

  const getPromptMessage = () => {
    switch (promptType) {
      case "like":
        return t("visitor.likePrompt");
      case "comment":
        return t("visitor.commentPrompt");
      case "follow":
        return t("visitor.followPrompt");
      case "toReadList":
        return t("visitor.toReadListPrompt");
      case "review":
        return t("visitor.reviewPrompt");
      default:
        return t("visitor.description");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-xl">{t("visitor.title")}</DialogTitle>
          <DialogDescription className="text-center">{getPromptMessage()}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={onRegister} className="w-full">
            {t("visitor.register")}
          </Button>
          <Button variant="outline" onClick={onLogin} className="w-full">
            {t("visitor.login")}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-muted-foreground"
          >
            {t("visitor.continueAsVisitor")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
