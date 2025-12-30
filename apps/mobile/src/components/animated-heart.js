import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { useHaptics } from "../hooks/use-haptics";
const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
};
export function AnimatedHeart({ isLiked, onToggle, size = "md", showCount = false, count = 0, }) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [localIsLiked, setLocalIsLiked] = useState(isLiked);
    const { mediumImpact, success } = useHaptics();
    useEffect(() => {
        setLocalIsLiked(isLiked);
    }, [isLiked]);
    const handleClick = useCallback(async () => {
        setIsAnimating(true);
        setLocalIsLiked(!localIsLiked);
        if (!localIsLiked) {
            success();
        }
        else {
            mediumImpact();
        }
        try {
            await onToggle();
        }
        catch {
            setLocalIsLiked(localIsLiked);
        }
        setTimeout(() => setIsAnimating(false), 300);
    }, [localIsLiked, onToggle, success, mediumImpact]);
    return (_jsxs("button", { onClick: handleClick, className: "flex items-center gap-1.5 touch-manipulation active:scale-95 transition-transform", type: "button", children: [_jsxs("div", { className: `relative transition-transform duration-300 ${isAnimating ? "scale-125" : "scale-100"}`, children: [_jsx(Heart, { className: `${sizeClasses[size]} transition-all duration-300 ${localIsLiked ? "fill-red-500 text-red-500" : "text-gray-500"}` }), isAnimating && localIsLiked && (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute inset-0 animate-ping", children: _jsx(Heart, { className: `${sizeClasses[size]} text-red-500 opacity-75` }) }), _jsx("div", { className: "absolute -top-1 -left-1 -right-1 -bottom-1 flex items-center justify-center", children: [...Array(6)].map((_, i) => (_jsx("div", { className: "absolute w-1 h-1 bg-red-500 rounded-full animate-burst", style: {
                                        transform: `rotate(${i * 60}deg) translateY(-10px)`,
                                        animationDelay: `${i * 50}ms`,
                                    } }, i))) })] }))] }), showCount && (_jsx("span", { className: `text-sm transition-all duration-200 ${localIsLiked ? "text-red-500 font-medium" : "text-gray-500"}`, children: count }))] }));
}
