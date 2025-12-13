import { useTranslation } from "react-i18next";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@repo/ui";

interface NetworkErrorFallbackProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export function NetworkErrorFallback({ onRetry, isRetrying = false }: NetworkErrorFallbackProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <WifiOff className="h-10 w-10 text-gray-400" />
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">{t("network.errorTitle")}</h2>

      <p className="text-gray-500 mb-6 max-w-xs">{t("network.errorDescription")}</p>

      <Button onClick={onRetry} disabled={isRetrying} className="min-w-[140px]">
        {isRetrying ? (
          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <RefreshCw className="h-4 w-4 mr-2" />
        )}
        {t("network.retry")}
      </Button>
    </div>
  );
}
