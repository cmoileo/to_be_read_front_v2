import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState, useRef } from "react";
import { useHaptics } from "../hooks/use-haptics";
import { RefreshCw } from "lucide-react";
const PULL_THRESHOLD = 80;
const MAX_PULL = 120;
export function PullToRefresh({ onRefresh, children, className = "", disabled = false, }) {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const startY = useRef(0);
    const containerRef = useRef(null);
    const { lightImpact } = useHaptics();
    const handleTouchStart = useCallback((e) => {
        if (disabled || isRefreshing)
            return;
        const scrollTop = containerRef.current?.scrollTop ?? 0;
        if (scrollTop > 0)
            return;
        startY.current = e.touches[0].clientY;
    }, [disabled, isRefreshing]);
    const handleTouchMove = useCallback((e) => {
        if (disabled || isRefreshing || startY.current === 0)
            return;
        const scrollTop = containerRef.current?.scrollTop ?? 0;
        if (scrollTop > 0) {
            startY.current = 0;
            setPullDistance(0);
            return;
        }
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;
        if (diff > 0) {
            const resistance = 0.5;
            const distance = Math.min(diff * resistance, MAX_PULL);
            setPullDistance(distance);
            if (distance >= PULL_THRESHOLD && pullDistance < PULL_THRESHOLD) {
                lightImpact();
            }
        }
    }, [disabled, isRefreshing, pullDistance, lightImpact]);
    const handleTouchEnd = useCallback(async () => {
        if (disabled || isRefreshing)
            return;
        if (pullDistance >= PULL_THRESHOLD) {
            setIsRefreshing(true);
            try {
                await onRefresh();
            }
            finally {
                setIsRefreshing(false);
            }
        }
        startY.current = 0;
        setPullDistance(0);
    }, [disabled, isRefreshing, pullDistance, onRefresh]);
    const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);
    const rotation = progress * 360;
    return (_jsxs("div", { ref: containerRef, className: `relative overflow-auto ${className}`, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd, children: [_jsx("div", { className: "absolute left-1/2 -translate-x-1/2 flex items-center justify-center transition-opacity duration-200", style: {
                    top: pullDistance - 40,
                    opacity: pullDistance > 20 ? 1 : 0,
                }, children: _jsx("div", { className: `p-2 rounded-full bg-white shadow-md ${isRefreshing ? "animate-spin" : ""}`, style: {
                        transform: isRefreshing ? undefined : `rotate(${rotation}deg)`,
                    }, children: _jsx(RefreshCw, { className: "h-5 w-5 text-primary" }) }) }), _jsx("div", { style: {
                    transform: `translateY(${pullDistance}px)`,
                    transition: pullDistance === 0 ? "transform 0.2s ease-out" : undefined,
                }, children: children })] }));
}
