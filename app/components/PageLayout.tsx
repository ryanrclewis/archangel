"use client";

import { SiteHeader } from "@/app/components/SiteHeader";
import siteConfig from "@/app/data/site-config.json";

type PageLayoutProps = {
  children: React.ReactNode;
  hideFooter?: boolean;
};

export function PageLayout({ children, hideFooter = false }: PageLayoutProps) {
  return (
    <div className="site-shell min-h-screen">
      <SiteHeader />
      <main className="site-main">{children}</main>
      {!hideFooter && (
        <footer className="site-footer">
          <p>Designed and engineered by Archangel Laboratories.</p>
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          <a href="https://x.com/ArchangelLabs" target="_blank" rel="noopener noreferrer">
            {siteConfig.twitterHandle ?? "@ArchangelLabs"}
          </a>
        </footer>
      )}
    </div>
  );
}
