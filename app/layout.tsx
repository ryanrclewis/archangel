import type { Metadata } from "next";
import "./globals.css";
import { CommandPalette } from "@/app/components/CommandPalette";
import siteConfig from "./data/site-config.json";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: "Archangel Laboratories",
  description: "A civic-minded design and engineering studio building durable digital tools.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Archangel Laboratories",
    description: "A civic-minded design and engineering studio building durable digital tools.",
    url: siteConfig.siteUrl,
    siteName: "Archangel Laboratories",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Archangel Laboratories",
    description: "A civic-minded design and engineering studio building durable digital tools.",
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
        <a className="skip-link" href="#main-content">Skip to content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Archangel Laboratories",
                url: siteConfig.siteUrl,
                email: siteConfig.contactEmail,
              },
              {
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Ryan Lewis",
                url: siteConfig.siteUrl,
                worksFor: { "@type": "Organization", name: "Archangel Laboratories" },
              },
            ]),
          }}
        />
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
