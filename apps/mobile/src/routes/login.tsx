import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@repo/ui";
import { MobileStorage } from "../services/mobile-storage.service";
import { useLoginViewModel } from "../viewmodels/use-login-viewmodel";
import { PageTransition } from "../components/page-transition";
import { useEffect, useRef } from "react";
import { Keyboard } from "@capacitor/keyboard";
import { Capacitor } from "@capacitor/core";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (hasTokens) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const viewModel = useLoginViewModel();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let showListener: any;
    let hideListener: any;

    const setupListeners = async () => {
      showListener = await Keyboard.addListener("keyboardWillShow", (info) => {
        if (containerRef.current) {
          containerRef.current.style.transform = `translateY(-${info.keyboardHeight / 2}px)`;
          containerRef.current.style.transition = "transform 0.3s ease-out";
        }
      });

      hideListener = await Keyboard.addListener("keyboardWillHide", () => {
        if (containerRef.current) {
          containerRef.current.style.transform = "translateY(0)";
          containerRef.current.style.transition = "transform 0.3s ease-out";
        }
      });
    };

    setupListeners();

    return () => {
      showListener?.remove();
      hideListener?.remove();
    };
  }, []);

  return (
    <PageTransition className="flex min-h-screen items-center justify-center p-6 safe-area-inset-top safe-area-inset-bottom">
      <div ref={containerRef} className="w-full">
        <LoginForm
          onSubmit={viewModel.login}
          isLoading={viewModel.isLoading}
          error={viewModel.error}
          onRegisterClick={viewModel.navigateToRegister}
          onForgotPasswordClick={viewModel.navigateToResetPassword}
        />
      </div>
    </PageTransition>
  );
}
