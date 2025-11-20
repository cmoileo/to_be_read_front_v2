import { useForm } from "@tanstack/react-form";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";

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
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Connectez-vous à votre compte To Be Read</CardDescription>
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
                const result = loginSchema.shape.email.safeParse(value);
                return result.success ? undefined : result.error.errors[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
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
                const result = loginSchema.shape.password.safeParse(value);
                return result.success ? undefined : result.error.errors[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Mot de passe</Label>
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
                Mot de passe oublié ?
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>

          {onRegisterClick && (
            <div className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Button
                type="button"
                variant="link"
                onClick={onRegisterClick}
                className="px-0"
                disabled={isLoading}
              >
                S&apos;inscrire
              </Button>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
