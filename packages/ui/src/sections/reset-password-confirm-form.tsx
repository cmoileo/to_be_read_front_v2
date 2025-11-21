import { useForm } from "@tanstack/react-form";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card";
import { getPasswordSchema, type ResetPasswordConfirmFormValues } from "../schemas/auth.schema";
import { useTranslation } from "react-i18next";

interface ResetPasswordConfirmFormProps {
  onSubmit: (values: ResetPasswordConfirmFormValues) => void | Promise<void>;
  isLoading?: boolean;
  error?: string;
  token: string;
}

export function ResetPasswordConfirmForm({
  onSubmit,
  isLoading = false,
  error,
  token,
}: ResetPasswordConfirmFormProps) {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      token,
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
        <CardTitle>{t("auth.resetPassword.confirmTitle")}</CardTitle>
        <CardDescription>{t("auth.resetPassword.confirmDescription")}</CardDescription>
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
                <Label htmlFor={field.name}>{t("auth.resetPassword.password")}</Label>
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
                  {t("auth.resetPassword.passwordHint")}
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
                <Label htmlFor={field.name}>{t("auth.resetPassword.confirmPassword")}</Label>
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

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("auth.resetPassword.confirmLoading") : t("auth.resetPassword.confirmSubmit")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
