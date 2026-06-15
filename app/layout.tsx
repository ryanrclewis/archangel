import type { Metadata } from "next";
import "./globals.css";
import { CommandPalette } from "@/app/components/CommandPalette";
import siteConfig from "./data/site-config.json";

export const metadata: Metadata = {
  title: "Archangel Laboratories",
  description: "A civic-minded design and engineering studio building durable digital tools.",
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
      </body>
    </html>
  );
}
