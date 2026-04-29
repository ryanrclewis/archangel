import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Archangel Laboratories",
  description: "Technology in service of human dignity.",
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
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
