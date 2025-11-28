import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import {
  getUsernameSchema,
  getEmailSchema,
  getPasswordSchema,
  type RegisterFormValues,
} from "../schemas/auth.schema";
import { Sparkles, AlertCircle, Loader2, Lightbulb } from "lucide-react";

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void | Promise<void>;
  isLoading?: boolean;
  error?: string;
  onLoginClick?: () => void;
  isUsernameAvailable?: (username: string) => Promise<boolean>;
}

export function RegisterForm({
  onSubmit,
  isLoading = false,
  error,
  onLoginClick,
  isUsernameAvailable,
}: RegisterFormProps) {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <Card className="w-full max-w-md border-0 shadow-soft-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">{t("auth.register.title")}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("auth.register.description")}
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
            name="username"
            validators={{
              onChange: ({ value }) => {
                const result = getUsernameSchema().safeParse(value);
                return result.success ? undefined : result.error.errors[0]?.message;
              },
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                if (isUsernameAvailable && value.length >= 3) {
                  const available = await isUsernameAvailable(value);
                  if (!available) {
                    return t("auth.register.usernameTaken");
                  }
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {t("auth.register.username")}
                </Label>
                <Input
                  id={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  placeholder="john_doe"
                  className="h-12"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span>•</span> {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = getEmailSchema().safeParse(value);
                return result.success ? undefined : result.error.errors[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {t("auth.register.email")}
                </Label>
                <Input
                  id={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  placeholder="votre@email.com"
                  className="h-12"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span>•</span> {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                const result = getPasswordSchema().safeParse(value);
                return result.success ? undefined : result.error.errors[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {t("auth.register.password")}
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
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span>•</span> {field.state.meta.errors[0]}
                  </p>
                )}
                <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 shrink-0" />
                  {t("auth.register.passwordHint")}
                </p>
              </div>
            )}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{
              onChangeListenTo: ["password"],
              onChange: ({ value, fieldApi }) => {
                const password = fieldApi.form.getFieldValue("password");
                if (value !== password) {
                  return t("auth.validation.passwordMismatch");
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {t("auth.register.confirmPassword")}
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
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span>•</span> {field.state.meta.errors[0]}
                  </p>
                )}
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
                {t("auth.register.loading")}
              </span>
            ) : (
              t("auth.register.submit")
            )}
          </Button>

          {onLoginClick && (
            <div className="text-center text-sm text-muted-foreground">
              {t("auth.register.hasAccount")}{" "}
              <Button
                type="button"
                variant="link"
                onClick={onLoginClick}
                className="px-0 font-semibold text-primary hover:text-primary/80"
                disabled={isLoading}
              >
                {t("auth.register.login")}
              </Button>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
