import { useForm } from "@tanstack/react-form";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Checkbox } from "../components/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import { type LoginFormValues } from "../schemas/auth.schema";
import { useTranslation } from "react-i18next";
import { BookOpen, AlertCircle, Loader2 } from "lucide-react";

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  isLoading?: boolean;
  error?: string;
  onRegisterClick?: () => void;
  onForgotPasswordClick?: () => void;
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  error,
  onRegisterClick,
  onForgotPasswordClick,
}: LoginFormProps) {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <Card className="w-full max-w-md border-0 shadow-soft-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">{t("auth.login.title")}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("auth.login.description")}
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardContent className="space-y-5 pt-4">
          {error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form.Field
            name="email"
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {t("auth.login.emailOrUsername")}
                </Label>
                <Input
                  id={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  placeholder={t("auth.login.emailOrUsernamePlaceholder")}
                  className="h-12"
                />
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {t("auth.login.password")}
                </Label>
                <Input
                  id={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="h-12"
                />
              </div>
            )}
          </form.Field>

          {onForgotPasswordClick && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                onClick={onForgotPasswordClick}
                className="px-0 text-sm text-primary hover:text-primary/80"
                disabled={isLoading}
              >
                {t("auth.login.forgotPassword")}
              </Button>
            </div>
          )}

          <form.Field
            name="rememberMe"
          >
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked === true)}
                  disabled={isLoading}
                />
                <Label htmlFor={field.name} className="text-sm font-medium cursor-pointer">
                  {t("auth.login.rememberMe")}
                </Label>
              </div>
            )}
          </form.Field>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2">
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("auth.login.loading")}
              </span>
            ) : (
              t("auth.login.submit")
            )}
          </Button>

          {onRegisterClick && (
            <div className="text-center text-sm text-muted-foreground">
              {t("auth.login.noAccount")}{" "}
              <Button
                type="button"
                variant="link"
                onClick={onRegisterClick}
                className="px-0 font-semibold text-primary hover:text-primary/80"
                disabled={isLoading}
              >
                {t("auth.login.register")}
              </Button>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
