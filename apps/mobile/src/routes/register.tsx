import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "@repo/ui";
import { useState } from "react";
import { useRegister } from "@repo/api-client";
import { TokenStorage } from "@repo/services";
import { useAuthModel } from "../models/hooks/use-auth-model";
import type { RegisterFormValues } from "@repo/ui";
import type { UserBasic } from "@repo/types";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const [error, setError] = useState<string>("");
  const navigate = Route.useNavigate();
  const { setUser } = useAuthModel();
  
  const registerMutation = useRegister();

  const handleSubmit = async (values: RegisterFormValues) => {
    setError("");
    const credentials = {
      userName: values.username,
      email: values.email,
      password: values.password,
    };
    registerMutation.mutate(credentials, {
      onSuccess: (data) => {
        TokenStorage.setToken(data.token.token);
        setUser(data.user as UserBasic);
        navigate({ to: "/" });
      },
      onError: (err) => {
        setError(err.message || "Une erreur est survenue lors de l'inscription");
      },
    });
  };

  const checkUsernameAvailability = async (_username: string): Promise<boolean> => {
    return true;
  };

  const goToLogin = () => {
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <RegisterForm
        onSubmit={handleSubmit}
        isLoading={registerMutation.isPending}
        error={error}
        isUsernameAvailable={checkUsernameAvailability}
        onLoginClick={goToLogin}
      />
    </div>
  );
}
