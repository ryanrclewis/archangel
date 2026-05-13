"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenCommandPalette = () => {
    window.dispatchEvent(new Event("command-palette-open"));
    setIsMobileMenuOpen(false);
  };

  const handleNavItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="site-header" aria-label="Site header">
      <Link className="site-mark" href="/">
        <Image src="/icon.svg" alt="" width={32} height={32} priority />
        <span>Archangel Laboratories</span>
      </Link>
      <button
        className="site-nav-toggle"
        type="button"
        aria-expanded={isMobileMenuOpen}
        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-controls="site-nav"
        onClick={() => setIsMobileMenuOpen((open) => !open)}
      >
        Menu
      </button>
      <nav
        id="site-nav"
        className={`site-nav${isMobileMenuOpen ? " is-open" : ""}`}
        aria-label="Primary navigation"
      >
        <Link href="/#principles" onClick={handleNavItemClick}>
          Principles
        </Link>
        <Link href="/#bespoke" onClick={handleNavItemClick}>
          Bespoke
        </Link>
        <Link href="/#government" onClick={handleNavItemClick}>
          Government
        </Link>
        <Link href="/#industry" onClick={handleNavItemClick}>
          Industry
        </Link>
        <Link href="/#research" onClick={handleNavItemClick}>
          Research
        </Link>
        <a href="mailto:contact@archangel-labs.com" onClick={handleNavItemClick}>
          Contact
        </a>
        <button
          onClick={handleOpenCommandPalette}
          className="command-palette-trigger"
          aria-label="Search projects (Cmd+K)"
          title="Press Cmd+K to search projects"
        >
          <kbd>⌘K</kbd>
        </button>
      </nav>
    </header>
  );
}
