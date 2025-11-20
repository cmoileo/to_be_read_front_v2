import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@repo/ui";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold">To Be Read</h1>
        <p className="text-muted-foreground">
          Application mobile - Partagez vos critiques littéraires
        </p>
        <div className="flex flex-col gap-4 pt-8">
          <Button size="lg">Se connecter</Button>
          <Button variant="outline" size="lg">
            S&apos;inscrire
          </Button>
        </div>
      </div>
    </div>
  );
}
