import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { useHaptics } from "../hooks/use-haptics";

interface AnimatedHeartProps {
  isLiked: boolean;
  onToggle: () => Promise<void>;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function AnimatedHeart({
  isLiked,
  onToggle,
  size = "md",
  showCount = false,
  count = 0,
}: AnimatedHeartProps) {
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
    } else {
      mediumImpact();
    }

    try {
      await onToggle();
    } catch {
      setLocalIsLiked(localIsLiked);
    }

    setTimeout(() => setIsAnimating(false), 300);
  }, [localIsLiked, onToggle, success, mediumImpact]);

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 touch-manipulation active:scale-95 transition-transform"
      type="button"
    >
      <div
        className={`relative transition-transform duration-300 ${isAnimating ? "scale-125" : "scale-100"}`}
      >
        <Heart
          className={`${sizeClasses[size]} transition-all duration-300 ${
            localIsLiked ? "fill-red-500 text-red-500" : "text-gray-500"
          }`}
        />

        {isAnimating && localIsLiked && (
          <>
            <div className="absolute inset-0 animate-ping">
              <Heart className={`${sizeClasses[size]} text-red-500 opacity-75`} />
            </div>
            <div className="absolute -top-1 -left-1 -right-1 -bottom-1 flex items-center justify-center">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-red-500 rounded-full animate-burst"
                  style={{
                    transform: `rotate(${i * 60}deg) translateY(-10px)`,
                    animationDelay: `${i * 50}ms`,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showCount && (
        <span
          className={`text-sm transition-all duration-200 ${
            localIsLiked ? "text-red-500 font-medium" : "text-gray-500"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
