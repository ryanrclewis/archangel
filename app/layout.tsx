import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CommandPalette } from "@/app/components/CommandPalette";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import siteConfig from "./data/site-config.json";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ec" },
    { media: "(prefers-color-scheme: dark)", color: "#171817" },
  ],
};

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
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
};

const themeInitScript = `
(function() {
  try {
    var mode = localStorage.getItem("archangel-theme");
    if (mode === "light" || mode === "dark") {
      document.documentElement.dataset.theme = mode;
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const backgroundImage = siteConfig.backgroundImage ?? "background.jpeg";
  const bodyStyle = { "--bg-image": `url("/${backgroundImage}")` } as React.CSSProperties;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased" style={bodyStyle}>
        {children}
        <CommandPalette />
        <ThemeToggle />
      </body>
    </html>
  );
}
