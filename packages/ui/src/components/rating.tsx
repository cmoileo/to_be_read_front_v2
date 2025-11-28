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
  max = 10,
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

  const handleClick = (rating: number) => {
    if (isInteractive && onChange) {
      onChange(rating);
    }
  };

  const displayValue = hoverValue ?? value;

  return (
    <div className={cn("flex items-center", sizeClasses[size].container, className)}>
      {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => handleClick(rating)}
          onMouseEnter={() => isInteractive && setHoverValue(rating)}
          onMouseLeave={() => setHoverValue(null)}
          disabled={disabled || readOnly}
          className={cn(
            "transition-all duration-200 ease-out p-0.5 -mx-0.5 rounded",
            isInteractive && "cursor-pointer hover:scale-125 active:scale-110",
            (disabled || readOnly) && "cursor-default"
          )}
          aria-label={`Rate ${rating} out of ${max}`}
        >
          <Star
            className={cn(
              sizeClasses[size].icon,
              "transition-all duration-200",
              rating <= displayValue
                ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                : "text-muted-foreground/30"
            )}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {value}/{max}
        </span>
      )}
    </div>
  );
}
