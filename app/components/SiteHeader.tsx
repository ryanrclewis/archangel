"use client";

import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  const handleOpenCommandPalette = () => {
    window.dispatchEvent(new Event("command-palette-open"));
  };

  return (
    <header className="site-header" aria-label="Site header">
      <Link className="site-mark" href="/">
        <Image src="/icon.svg" alt="" width={32} height={32} priority />
        <span>Archangel Laboratories</span>
      </Link>
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
    </header>
  );
}
