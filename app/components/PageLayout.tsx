"use client";

import { ArrowUpRightIcon } from "@/app/components/SfSymbols";
import { SiteHeader } from "@/app/components/SiteHeader";
import siteConfig from "@/app/data/site-config.json";

type PageLayoutProps = {
  children: React.ReactNode;
  hideFooter?: boolean;
};

export function PageLayout({ children, hideFooter = false }: PageLayoutProps) {
  return (
    <div className="site-shell min-h-screen">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="site-main" tabIndex={-1}>
        {children}
      </main>
      {!hideFooter && (
        <footer className="site-footer">
          <p>Designed and engineered by Archangel Laboratories.</p>
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          <a href="https://x.com/ArchangelLabs" target="_blank" rel="noopener noreferrer">
            <span>{siteConfig.twitterHandle ?? "@ArchangelLabs"}</span>
            <ArrowUpRightIcon size="0.9em" className="inline-symbol" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </footer>
      )}
    </div>
  );
}
