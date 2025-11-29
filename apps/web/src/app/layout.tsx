import "@repo/ui/src/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/navigation";
import { getUserFromCookies } from "./_auth/actions";

export const metadata: Metadata = {
  title: "InkerClub - Partagez vos critiques littéraires",
  description: "Réseau social de critiques de livres",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromCookies();

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Providers initialUser={user}>
            <Navigation />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
