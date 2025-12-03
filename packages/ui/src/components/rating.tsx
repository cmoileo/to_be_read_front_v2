import { useState } from "react";
import { cn } from "../lib/utils";
import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Rating({
  value,
  onChange,
  max = 5,
  disabled = false,
  readOnly = false,
  size = "md",
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const isInteractive = !disabled && !readOnly && onChange;

  const sizeClasses = {
    sm: { container: "gap-0.5", icon: "w-4 h-4" },
    md: { container: "gap-1", icon: "w-6 h-6" },
    lg: { container: "gap-1.5", icon: "w-8 h-8" },
  };

  const handleClick = (starIndex: number) => {
    if (!isInteractive || !onChange) return;

    const fullValue = starIndex;
    const halfValue = starIndex - 0.5;

    if (value === fullValue) {
      onChange(halfValue);
    } else if (value === halfValue) {
      onChange(0);
    } else {
      onChange(fullValue);
    }
  };

  const displayValue = hoverValue ?? value;

  const getStarState = (starIndex: number): "full" | "half" | "empty" => {
    if (displayValue >= starIndex) return "full";
    if (displayValue >= starIndex - 0.5) return "half";
    return "empty";
  };

  return (
    <div className={cn("flex items-center", sizeClasses[size].container, className)}>
      {Array.from({ length: max }, (_, i) => i + 1).map((starIndex) => {
        const state = getStarState(starIndex);

        return (
          <button
            key={starIndex}
            type="button"
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => isInteractive && setHoverValue(starIndex)}
            onMouseLeave={() => setHoverValue(null)}
            disabled={disabled || readOnly}
            className={cn(
              "relative transition-all duration-200 ease-out p-0.5 -mx-0.5 rounded",
              isInteractive && "cursor-pointer hover:scale-125 active:scale-110",
              (disabled || readOnly) && "cursor-default"
            )}
            aria-label={`Rate ${starIndex} out of ${max}`}
          >
            {state === "half" ? (
              <div className="relative">
                <Star
                  className={cn(sizeClasses[size].icon, "text-muted-foreground/30")}
                />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    className={cn(
                      sizeClasses[size].icon,
                      "text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                    )}
                  />
                </div>
              </div>
            ) : (
              <Star
                className={cn(
                  sizeClasses[size].icon,
                  "transition-all duration-200",
                  state === "full"
                    ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                    : "text-muted-foreground/30"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
