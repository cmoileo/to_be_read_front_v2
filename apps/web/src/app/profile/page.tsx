"use client";

import { useAuthContext } from "@/models/hooks/use-auth-context";
import { Button } from "@repo/ui";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { user, clearUser } = useAuthContext();

  if (!user) {
    redirect("/login");
  }

  const handleLogout = async () => {
    await clearUser();
  };

  return (
    <div className="container py-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profil</h1>
      </header>

      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <p className="text-6xl">👤</p>
          <h2 className="text-3xl font-bold">{user.userName}</h2>
          <p className="text-muted-foreground text-lg">Page de profil à venir</p>
        </div>
      </div>
    </div>
  );
}
