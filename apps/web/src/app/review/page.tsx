import { redirect } from "next/navigation";
import { getUserFromCookies } from "../_auth/actions";

export default async function ReviewPage() {
  const user = await getUserFromCookies();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Créer une critique</h1>
      </header>

      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="max-w-md w-full text-center space-y-4">
          <p className="text-6xl">✍️</p>
          <p className="text-muted-foreground text-lg">Page de création de critique à venir</p>
        </div>
      </div>
    </div>
  );
}
