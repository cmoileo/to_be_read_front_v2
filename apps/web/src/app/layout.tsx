import "@repo/ui/src/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { getUserFromCookies } from "./_auth/actions";

export const metadata: Metadata = {
  title: "To Be Read - Partagez vos critiques littéraires",
  description: "Réseau social de critiques de livres",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromCookies();

  return (
    <html lang="fr">
      <body className="antialiased">
        <Providers initialUser={user}>{children}</Providers>
      </body>
    </html>
  );
}
