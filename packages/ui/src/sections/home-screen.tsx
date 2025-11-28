import { BookOpen, Search, PenSquare } from "lucide-react";
import { Button } from "../components/button";

interface HomeScreenProps {
  userName: string;
  onLogout: () => void;
}

export function HomeScreen({ userName, onLogout }: HomeScreenProps) {
  return (
    <div className="flex min-h-screen flex-col p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">To Be Read</h1>
        <Button variant="ghost" onClick={onLogout}>
          Déconnexion
        </Button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Bienvenue {userName} !</h2>
            <p className="text-muted-foreground">Votre bibliothèque littéraire personnelle</p>
          </div>

          <div className="grid gap-4 pt-8">
            <Button size="lg" className="w-full">
              <BookOpen className="w-5 h-5 mr-2" />
              Ma bibliothèque
            </Button>
            <Button variant="outline" size="lg" className="w-full">
              <Search className="w-5 h-5 mr-2" />
              Découvrir
            </Button>
            <Button variant="outline" size="lg" className="w-full">
              <PenSquare className="w-5 h-5 mr-2" />
              Écrire une critique
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
