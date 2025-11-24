import { useState } from "react";
import { cn } from "../lib/utils";

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
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const handleClick = (rating: number) => {
    if (isInteractive && onChange) {
      onChange(rating);
    }
  };

  const displayValue = hoverValue ?? value;

  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => handleClick(rating)}
          onMouseEnter={() => isInteractive && setHoverValue(rating)}
          onMouseLeave={() => setHoverValue(null)}
          disabled={disabled || readOnly}
          className={cn(
            "transition-all duration-150 ease-in-out",
            isInteractive && "cursor-pointer hover:scale-110",
            (disabled || readOnly) && "cursor-default",
            sizeClasses[size]
          )}
          aria-label={`Rate ${rating} out of ${max}`}
        >
          <span
            className={cn(
              "transition-colors",
              rating <= displayValue ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"
            )}
          >
            {rating <= displayValue ? "★" : "☆"}
          </span>
        </button>
      ))}
    </div>
  );
}
