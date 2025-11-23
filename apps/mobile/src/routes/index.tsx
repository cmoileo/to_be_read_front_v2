import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@repo/ui";
import { useAuthModel } from "../models/hooks/use-auth-model";
import { MobileStorage } from "../services/mobile-storage.service";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: Index,
});

function Index() {
  const { user, clearUser } = useAuthModel();

  const handleLogout = () => {
    clearUser();
  };

  return (
    <div className="flex min-h-screen flex-col p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">To Be Read</h1>
        <Button variant="ghost" onClick={handleLogout}>
          Déconnexion
        </Button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">
              Bienvenue {user?.userName || "Lecteur"} !
            </h2>
            <p className="text-muted-foreground">
              Votre bibliothèque littéraire personnelle
            </p>
          </div>

          <div className="grid gap-4 pt-8">
            <Button size="lg" className="w-full">
              📚 Ma bibliothèque
            </Button>
            <Button variant="outline" size="lg" className="w-full">
              🔍 Découvrir
            </Button>
            <Button variant="outline" size="lg" className="w-full">
              ✍️ Écrire une critique
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
