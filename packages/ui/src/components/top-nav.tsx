"use client";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Home, Search, PenSquare, User, BookOpen, Menu, X, LogIn, Bell } from "lucide-react";

interface TopNavProps {
  userName?: string;
  userAvatar?: string | null;
  onLogout?: () => void;
  currentPath: string;
  Link: React.ComponentType<{
    href: string;
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
  }>;
  isVisitor?: boolean;
  unreadNotificationsCount?: number;
}

export function TopNav({
  userName,
  userAvatar,
  onLogout,
  currentPath,
  Link,
  isVisitor = false,
  unreadNotificationsCount = 0,
}: TopNavProps) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allNavItems = [
    {
      label: t("navigation.home"),
      icon: <Home className="w-5 h-5" />,
      href: "/",
      visitorAccess: true,
    },
    {
      label: t("navigation.search"),
      icon: <Search className="w-5 h-5" />,
      href: "/search",
      visitorAccess: true,
    },
    {
      label: t("navigation.createReview"),
      icon: <PenSquare className="w-5 h-5" />,
      href: "/review",
      visitorAccess: false,
    },
  ];

  const navItems = isVisitor ? allNavItems.filter((item) => item.visitorAccess) : allNavItems;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80 shadow-soft">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2 group">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-transform duration-200 group-hover:scale-105">
                Inkgora
              </span>
            </Link>

            <div className="hidden md:flex md:gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    "hover:bg-accent/50",
                    currentPath === item.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {currentPath === item.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {userName ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/notifications"
                  className={cn(
                    "relative p-2 rounded-lg transition-all duration-200",
                    "hover:bg-accent/50",
                    currentPath === "/notifications"
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center px-1">
                      {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200",
                    "hover:bg-muted",
                    currentPath === "/profile" ? "bg-primary/10" : "bg-muted/50"
                  )}
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs">
                      {userName?.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="text-sm font-medium text-foreground">{userName}</span>
                </Link>
                {onLogout && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    {t("auth.logout")}
                  </Button>
                )}
              </div>
            ) : isVisitor ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    {t("visitor.login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">{t("visitor.register")}</Button>
                </Link>
              </div>
            ) : null}

            <button
              className={cn(
                "md:hidden p-2 rounded-lg transition-all duration-200",
                "hover:bg-accent active:scale-95",
                mobileMenuOpen && "bg-accent"
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={t("common.toggleMenu")}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 z-50 md:hidden animate-in slide-in-from-top-2 duration-200 bg-background border-b border-border/50 shadow-lg">
            <div className="container space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    "hover:bg-accent/50 active:scale-[0.98]",
                    currentPath === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              {userName ? (
                <div className="border-t border-border/50 pt-4 mt-4 space-y-2">
                  <Link
                    href="/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      "hover:bg-accent/50 active:scale-[0.98]",
                      currentPath === "/notifications"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="relative">
                      <Bell className="w-5 h-5" />
                      {unreadNotificationsCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                          {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
                        </span>
                      )}
                    </div>
                    <span>{t("navigation.notifications")}</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      "hover:bg-accent/50 active:scale-[0.98]",
                      currentPath === "/profile"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium">
                        {userName?.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span>{userName}</span>
                  </Link>
                  {onLogout && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      {t("auth.logout")}
                    </Button>
                  )}
                </div>
              ) : isVisitor ? (
                <div className="border-t border-border/50 pt-4 mt-4 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>{t("visitor.login")}</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <User className="w-5 h-5" />
                    <span>{t("visitor.register")}</span>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </>
  );
}
