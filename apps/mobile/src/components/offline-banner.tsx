import { useTranslation } from "react-i18next";
import { WifiOff } from "lucide-react";
import { useNetworkStatus } from "../hooks/use-network-status";

export function OfflineBanner() {
  const { t } = useTranslation();
  const { isOnline } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 safe-area-inset-top">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">{t("network.offline")}</span>
    </div>
  );
}
