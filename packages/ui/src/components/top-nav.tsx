"use client";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface TopNavProps {
  userName?: string;
  onLogout?: () => void;
  currentPath: string;
  Link: React.ComponentType<{
    href: string;
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
  }>;
}

export function TopNav({ userName, onLogout, currentPath, Link }: TopNavProps) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: t("navigation.home"),
      icon: "🏠",
      href: "/",
    },
    {
      label: t("navigation.search"),
      icon: "🔍",
      href: "/search",
    },
    {
      label: t("navigation.createReview"),
      icon: "✍️",
      href: "/review",
    },
    {
      label: t("navigation.profile"),
      icon: "👤",
      href: "/profile",
    },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">📚 To Be Read</span>
            </Link>

            <div className="hidden md:flex md:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                    currentPath === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {userName && (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{userName}</span>
                {onLogout && (
                  <Button variant="ghost" size="sm" onClick={onLogout}>
                    Déconnexion
                  </Button>
                )}
              </div>
            )}

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="text-2xl">{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t md:hidden">
            <div className="container space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    currentPath === item.href ? "bg-accent text-primary" : "text-muted-foreground"
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}

              {userName && (
                <div className="border-t pt-4 mt-4 space-y-2">
                  <div className="px-3 py-2 text-sm text-muted-foreground">{userName}</div>
                  {onLogout && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onLogout}
                      className="w-full justify-start"
                    >
                      Déconnexion
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
