import { useForm } from "@tanstack/react-form";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card";
import { getEmailSchema, type ResetPasswordRequestFormValues } from "../schemas/auth.schema";
import { useTranslation } from "react-i18next";

interface ResetPasswordRequestFormProps {
  onSubmit: (values: ResetPasswordRequestFormValues) => void | Promise<void>;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
  onBackToLoginClick?: () => void;
}

export function ResetPasswordRequestForm({
  onSubmit,
  isLoading = false,
  error,
  success = false,
  onBackToLoginClick,
}: ResetPasswordRequestFormProps) {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("auth.resetPassword.requestTitle")}</CardTitle>
        <CardDescription>
          {t("auth.resetPassword.requestDescription")}
        </CardDescription>
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

          {success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
              {t("auth.resetPassword.success")}
            </div>
          )}

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
                <Label htmlFor={field.name}>{t("auth.resetPassword.email")}</Label>
                <Input
                  id={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading || success}
                  placeholder="votre@email.com"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading || success}>
            {isLoading ? t("auth.resetPassword.loading") : t("auth.resetPassword.submit")}
          </Button>

          {onBackToLoginClick && (
            <Button
              type="button"
              variant="link"
              onClick={onBackToLoginClick}
              className="w-full"
              disabled={isLoading}
            >
              {t("auth.resetPassword.backToLogin")}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
