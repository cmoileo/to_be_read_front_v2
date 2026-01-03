"use client";

import { useState, ReactNode } from "react";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Button } from "./button";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";

interface SpoilerGuardProps {
  children: ReactNode;
  active: boolean;
}

export function SpoilerGuard({ children, active }: SpoilerGuardProps) {
  const { t } = useTranslation();
  const [isRevealed, setIsRevealed] = useState(false);

  if (!active) {
    return <>{children}</>;
  }

  if (isRevealed) {
    return (
      <div className="relative">
        <div className="animate-in fade-in duration-300">{children}</div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsRevealed(false)}
          className="mt-2 gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <EyeOff className="h-3 w-3" />
          {t("review.spoiler.hide")}
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[120px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 blur-md select-none pointer-events-none opacity-20">
        {children}
      </div>
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-2 p-3",
          "bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-red-500/5",
          "backdrop-blur-md rounded-lg border-2 border-dashed border-amber-500/30",
          "transition-all duration-200 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10"
        )}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-full animate-pulse" />
            <div className="relative bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-2 rounded-full border border-amber-500/30">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="space-y-0.5 px-2">
            <p className="text-xs font-semibold text-amber-900 dark:text-amber-100">
              {t("review.spoiler.warning")}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight max-w-[180px] mx-auto">
              {t("review.spoiler.description")}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => setIsRevealed(true)}
          className={cn(
            "gap-1.5 h-7 px-3 text-xs shadow-lg",
            "bg-gradient-to-r from-amber-500 to-orange-500",
            "hover:from-amber-600 hover:to-orange-600",
            "text-white border-0",
            "transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/25"
          )}
        >
          <Eye className="h-3 w-3" />
          {t("review.spoiler.reveal")}
        </Button>
      </div>
    </div>
  );
}
