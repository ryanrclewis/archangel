"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleOpenCommandPalette = () => {
    window.dispatchEvent(new Event("command-palette-open"));
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="site-header" aria-label="Site header">
      <Link className="site-mark" href="/">
        <Image src="/icon.svg" alt="" width={32} height={32} priority />
        <span>Archangel Laboratories</span>
      </Link>

      {isMobile && (
        <button
          className="nav-toggle"
          aria-label="Open navigation"
          aria-controls="mobile-drawer"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          <span className="hamburger" aria-hidden />
        </button>
      )}

      {!isMobile && (
        <nav className="site-nav" aria-label="Primary navigation">
          <Link href="/#principles">Principles</Link>
          <Link href="/#bespoke">Bespoke</Link>
          <Link href="/#government">Government</Link>
          <Link href="/#industry">Industry</Link>
          <Link href="/#research">Research</Link>
          <a href="mailto:contact@archangel-labs.com">Contact</a>
          <button
            onClick={handleOpenCommandPalette}
            className="command-palette-trigger"
            aria-label="Search projects (Cmd+K)"
            title="Press Cmd+K to search projects"
          >
            <kbd>⌘K</kbd>
          </button>
        </nav>
      )}

      {isMobile && drawerOpen && (
        <>
          <div
            id="mobile-drawer"
            className="mobile-drawer open"
            aria-hidden={false}
          >
            <div className="drawer-inner">
              <button
                className="drawer-close"
                aria-label="Close navigation"
                onClick={() => setDrawerOpen(false)}
              >
                ×
              </button>
              <nav className="drawer-nav" aria-label="Mobile navigation">
                <Link href="/#principles" onClick={() => setDrawerOpen(false)}>
                  Principles
                </Link>
                <Link href="/#bespoke" onClick={() => setDrawerOpen(false)}>
                  Bespoke
                </Link>
                <Link href="/#government" onClick={() => setDrawerOpen(false)}>
                  Government
                </Link>
                <Link href="/#industry" onClick={() => setDrawerOpen(false)}>
                  Industry
                </Link>
                <Link href="/#research" onClick={() => setDrawerOpen(false)}>
                  Research
                </Link>
                <a href="mailto:contact@archangel-labs.com" onClick={() => setDrawerOpen(false)}>
                  Contact
                </a>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    handleOpenCommandPalette();
                  }}
                  className="command-palette-trigger"
                >
                  <kbd>⌘K</kbd>
                </button>
              </nav>
            </div>
          </div>
          <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
        </>
      )}
    </header>
  );
}
