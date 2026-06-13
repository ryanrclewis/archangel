import type { Metadata } from "next";
import { readFileSync } from "fs";
import { join } from "path";
import "./globals.css";
import { CommandPalette } from "@/app/components/CommandPalette";

export const metadata: Metadata = {
  title: "Archangel Laboratories",
  description: "A civic-minded design and engineering studio building durable digital tools.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

function getSiteConfig() {
  try {
    const raw = readFileSync(join(process.cwd(), "app/data/site-config.json"), "utf-8");
    return JSON.parse(raw) as { backgroundImage?: string };
  } catch {
    return { backgroundImage: "background.jpeg" };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { backgroundImage } = getSiteConfig();
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
