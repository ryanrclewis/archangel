import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Archangel Laboratories",
  description: "Portfolio rebuilt on vinext with Tailwind and App Router.",
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
