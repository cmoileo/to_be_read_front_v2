import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card";
import { getUsernameSchema, getEmailSchema, getPasswordSchema, type RegisterFormValues } from "../schemas/auth.schema";

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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("auth.register.title")}</CardTitle>
        <CardDescription>{t("auth.register.description")}</CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
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
                <Label htmlFor={field.name}>{t("auth.register.username")}</Label>
                <Input
                  id={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  placeholder="john_doe"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
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
                <Label htmlFor={field.name}>{t("auth.register.email")}</Label>
                <Input
                  id={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  placeholder="votre@email.com"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
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
                <Label htmlFor={field.name}>{t("auth.register.password")}</Label>
                <Input
                  id={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                )}
                <p className="text-xs text-muted-foreground">
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
                <Label htmlFor={field.name}>{t("auth.register.confirmPassword")}</Label>
                <Input
                  id={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("auth.register.loading") : t("auth.register.submit")}
          </Button>

          {onLoginClick && (
            <div className="text-center text-sm text-muted-foreground">
              {t("auth.register.hasAccount")}{" "}
              <Button
                type="button"
                variant="link"
                onClick={onLoginClick}
                className="px-0"
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
