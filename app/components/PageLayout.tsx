"use client";

import { SiteHeader } from "@/app/components/SiteHeader";

type PageLayoutProps = {
  children: React.ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="site-shell min-h-screen">
      <SiteHeader />
      <div className="site-nav-backdrop" aria-hidden="true" />
      {children}
    </main>
  );
}
