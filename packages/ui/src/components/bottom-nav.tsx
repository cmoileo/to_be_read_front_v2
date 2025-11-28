import { cn } from "../lib/utils";
import type { ReactNode } from "react";

interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
  isActive: boolean;
}

interface BottomNavProps {
  items: NavItem[];
  onNavigate: (href: string) => void;
  className?: string;
}

export function BottomNav({ items, onNavigate, className }: BottomNavProps) {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80",
        "border-t border-border/50 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]",
        "safe-area-inset-bottom",
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {items.map((item) => (
          <button
            key={item.href}
            onClick={() => onNavigate(item.href)}
            className={cn(
              "relative flex flex-col items-center justify-center flex-1 h-full py-2",
              "transition-all duration-200 rounded-xl mx-1",
              "hover:bg-accent/50 active:scale-95",
              item.isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={item.label}
            aria-current={item.isActive ? "page" : undefined}
          >
            {/* Active indicator */}
            {item.isActive && (
              <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
            )}
            <div
              className={cn("mb-1 transition-transform duration-200", item.isActive && "scale-110")}
            >
              {item.icon}
            </div>
            <span
              className={cn(
                "text-[11px] font-medium transition-colors duration-200",
                item.isActive && "font-semibold"
              )}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
