import "@repo/ui/src/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/navigation";
import { getUserFromCookies } from "./_auth/actions";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://inkgora.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Inkgora - Partagez vos critiques littéraires",
    template: "%s | Inkgora",
  },
  description: "Découvrez, partagez et discutez de vos lectures avec une communauté de passionnés. Créez des critiques, suivez des lecteurs et trouvez votre prochaine lecture.",
  keywords: ["livres", "critiques littéraires", "lecture", "réseau social", "avis livres", "communauté lecteurs", "bookstagram", "book reviews"],
  authors: [{ name: "Inkgora" }],
  creator: "Inkgora",
  publisher: "Inkgora",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Inkgora",
    title: "Inkgora - Partagez vos critiques littéraires",
    description: "Découvrez, partagez et discutez de vos lectures avec une communauté de passionnés.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Inkgora - Réseau social de critiques littéraires",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkgora - Partagez vos critiques littéraires",
    description: "Découvrez, partagez et discutez de vos lectures avec une communauté de passionnés.",
    images: ["/og-image.png"],
  },
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
  alternates: {
    canonical: siteUrl,
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
