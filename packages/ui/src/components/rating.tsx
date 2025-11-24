import { useState } from "react";
import { cn } from "../lib/utils";

interface RatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Rating({
  value,
  onChange,
  max = 10,
  disabled = false,
  size = "md",
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const handleClick = (rating: number) => {
    if (!disabled) {
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
          onMouseEnter={() => !disabled && setHoverValue(rating)}
          onMouseLeave={() => setHoverValue(null)}
          disabled={disabled}
          className={cn(
            "transition-all duration-150 ease-in-out",
            !disabled && "cursor-pointer hover:scale-110",
            disabled && "cursor-not-allowed opacity-50",
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
