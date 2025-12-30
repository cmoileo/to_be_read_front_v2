import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@repo/ui';
import { usePlatform } from '../hooks/use-platform';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
/**
 * Header mobile avec gestion des safe areas et bouton retour
 */
export function MobileHeader({ title, leftContent, rightContent, showBack = false, onBack, className, transparent = false, }) {
    const { isMobile } = usePlatform();
    const router = useRouter();
    const handleBack = () => {
        if (onBack) {
            onBack();
        }
        else {
            router.history.back();
        }
    };
    return (_jsxs("header", { className: cn("sticky top-0 z-40 px-4 py-3 flex items-center justify-between", !transparent && "bg-background/95 backdrop-blur-lg border-b border-border/50", 
        // Safe area pour iOS
        isMobile && "pt-[calc(env(safe-area-inset-top)+0.75rem)]", className), children: [_jsxs("div", { className: "flex items-center gap-2 min-w-[60px]", children: [showBack && (_jsx("button", { onClick: handleBack, className: "p-2 -ml-2 rounded-full hover:bg-accent/50 active:scale-95 transition-all duration-150 touch-manipulation", "aria-label": "Retour", children: _jsx(ChevronLeft, { className: "w-6 h-6" }) })), leftContent] }), title && (_jsx("h1", { className: "text-lg font-semibold text-center flex-1 truncate", children: title })), _jsx("div", { className: "flex items-center gap-2 min-w-[60px] justify-end", children: rightContent })] }));
}
