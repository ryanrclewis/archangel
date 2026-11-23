import type { Metadata } from "next";
import "./globals.css";
import { CommandPalette } from "@/app/components/CommandPalette";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import siteConfig from "./data/site-config.json";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: "Archangel Laboratories",
  description: "A design and engineering studio building thoughtful, durable software for families, communities, and public institutions.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Archangel Laboratories",
    description: "A design and engineering studio building thoughtful, durable software for families, communities, and public institutions.",
    url: siteConfig.siteUrl,
    siteName: "Archangel Laboratories",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const backgroundImage = siteConfig.backgroundImage ?? "background.jpeg";
  const bodyStyle = { "--bg-image": `url("/${backgroundImage}")` } as React.CSSProperties;

  return (
    <html lang="en">
      <body className="antialiased" style={bodyStyle}>
        {children}
        <CommandPalette />
        <ThemeToggle />
      </body>
    </html>
  );
}
