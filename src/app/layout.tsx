import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlloSN - Annonces et Services au Sénégal",
  description: "Plateforme tout-en-un pour annonces, services, restauration et livraison au Sénégal. Immobilier, emploi, transport, vente et plus encore.",
  keywords: ["AlloSN", "Sénégal", "annonces", "services", "immobilier", "emploi", "Dakar"],
  authors: [{ name: "AlloSN" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "AlloSN - Votre plateforme au Sénégal",
    description: "Trouvez et publiez des annonces au Sénégal",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
