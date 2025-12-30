import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@repo/ui";
export function NetworkErrorFallback({ onRetry, isRetrying = false }) {
    const { t } = useTranslation();
    return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[50vh] px-6 text-center", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6", children: _jsx(WifiOff, { className: "h-10 w-10 text-gray-400" }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: t("network.errorTitle") }), _jsx("p", { className: "text-gray-500 mb-6 max-w-xs", children: t("network.errorDescription") }), _jsxs(Button, { onClick: onRetry, disabled: isRetrying, className: "min-w-[140px]", children: [isRetrying ? (_jsx(RefreshCw, { className: "h-4 w-4 animate-spin mr-2" })) : (_jsx(RefreshCw, { className: "h-4 w-4 mr-2" })), t("network.retry")] })] }));
}
