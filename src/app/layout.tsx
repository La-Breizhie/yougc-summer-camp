import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouGC Summer Camp",
  description: "Cahier de vacances interactif pour les élèves YouGC Academy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
