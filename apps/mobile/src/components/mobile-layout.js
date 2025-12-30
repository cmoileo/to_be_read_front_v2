import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePlatform } from '../hooks/use-platform';
import { cn } from '@repo/ui';
/**
 * Layout mobile avec gestion des safe areas iOS
 * Utilise les variables CSS env() pour les encoches
 */
export function MobileLayout({ children, header, footer, className, noScroll = false }) {
    const { isMobile } = usePlatform();
    return (_jsxs("div", { className: "flex flex-col h-[100dvh] bg-background", children: [header && (_jsx("header", { className: cn("flex-shrink-0 bg-background border-b border-border z-50", isMobile && "pt-[env(safe-area-inset-top)]"), children: header })), _jsx("main", { className: cn("flex-1 overflow-y-auto overscroll-y-contain", noScroll && "overflow-hidden", 
                // Smooth scroll pour iOS
                "scroll-smooth [-webkit-overflow-scrolling:touch]", className), children: children }), footer && (_jsx("footer", { className: cn("flex-shrink-0 bg-background border-t border-border z-50", isMobile && "pb-[env(safe-area-inset-bottom)]"), children: footer }))] }));
}
/**
 * Container avec padding safe area sur tous les côtés
 */
export function SafeAreaView({ children, className }) {
    const { isMobile } = usePlatform();
    return (_jsx("div", { className: cn(isMobile && [
            "pt-[env(safe-area-inset-top)]",
            "pb-[env(safe-area-inset-bottom)]",
            "pl-[env(safe-area-inset-left)]",
            "pr-[env(safe-area-inset-right)]",
        ], className), children: children }));
}
