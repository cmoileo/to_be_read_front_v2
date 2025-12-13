import "@repo/ui/src/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/navigation";
import { getUserFromCookies } from "./_auth/actions";

export const metadata: Metadata = {
  title: "Inkgora - Partagez vos critiques littéraires",
  description: "Réseau social de critiques de livres",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Inkgora",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Script to prevent flash of unstyled content for theme
const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('to_be_read_theme');
      var theme = stored === 'light' || stored === 'dark' ? stored : 
        (stored === 'system' || !stored) ? 
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
          'light';
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromCookies();

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
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
