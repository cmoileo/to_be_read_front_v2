import { Button } from "@repo/ui";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">To Be Read</h1>
        <p className="text-center text-muted-foreground mb-8">
          Partagez vos critiques littéraires avec la communauté
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/login">Se connecter</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register">S&apos;inscrire</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
