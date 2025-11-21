import { useForm } from "@tanstack/react-form";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card";
import { getLoginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { useTranslation } from "react-i18next";

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
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("auth.login.title")}</CardTitle>
        <CardDescription>{t("auth.login.description")}</CardDescription>
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
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = getLoginSchema().shape.email.safeParse(value);
                return result.success ? undefined : result.error.errors[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{t("auth.login.email")}</Label>
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
                const result = getLoginSchema().shape.password.safeParse(value);
                return result.success ? undefined : result.error.errors[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{t("auth.login.password")}</Label>
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

          {onForgotPasswordClick && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                onClick={onForgotPasswordClick}
                className="px-0 text-sm"
                disabled={isLoading}
              >
                {t("auth.login.forgotPassword")}
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("auth.login.loading") : t("auth.login.submit")}
          </Button>

          {onRegisterClick && (
            <div className="text-center text-sm text-muted-foreground">
              {t("auth.login.noAccount")}{" "}
              <Button
                type="button"
                variant="link"
                onClick={onRegisterClick}
                className="px-0"
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
