import { cn } from "../lib/utils";

interface NavItem {
  label: string;
  icon: string;
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
        "fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50",
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => (
          <button
            key={item.href}
            onClick={() => onNavigate(item.href)}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full transition-colors",
              "hover:bg-accent hover:text-accent-foreground rounded-md",
              item.isActive ? "text-primary font-semibold" : "text-muted-foreground"
            )}
            aria-label={item.label}
            aria-current={item.isActive ? "page" : undefined}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
