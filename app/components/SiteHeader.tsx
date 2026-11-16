"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { homepageExampleIds, projects, type ProjectSection } from "@/app/data/projects";

const navigationSections: Array<{ key: ProjectSection; label: string; emoji: string }> = [
  { key: "bespoke", label: "Bespoke", emoji: "🧵" },
  { key: "government", label: "Government", emoji: "🏛️" },
  { key: "industry", label: "Industry", emoji: "🏭" },
  { key: "research", label: "Research", emoji: "📚" },
];

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const handleOpenSearch = () => window.dispatchEvent(new Event("command-palette-open"));

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
          {navigationSections.map(({ key, label, emoji }) => {
            const sectionProjects = projects.filter(
              (project) => project.section === key && !project.archived && !homepageExampleIds.has(project.id),
            );

            return (
              <div
                className="site-nav-menu"
                key={key}
              >
                <Link href={`/categories/${key}`} aria-haspopup="true">
                  <span className="nav-emoji">{emoji}</span>
                  {label}
                </Link>
                <div className="site-nav-dropdown">
                  <div className="site-nav-dropdown-inner">
                    <div className="site-nav-dropdown-heading">
                      <Link href={`/categories/${key}`}>View all {label}</Link>
                    </div>
                    <div className="site-nav-project-list">
                      {sectionProjects.map((project) => (
                        <Link href={`/projects/${project.id}`} key={project.id}>
                          {project.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <button
            className="command-palette-trigger"
            onClick={handleOpenSearch}
            onMouseEnter={handleOpenSearch}
            onMouseLeave={(event) => {
              const nextTarget = event.relatedTarget;
              if (!(nextTarget instanceof Element && nextTarget.closest(".command-palette"))) {
                window.dispatchEvent(new Event("command-palette-close"));
              }
            }}
            aria-label="Search projects (Cmd+K)"
            title="Press Cmd+K to search projects"
          >
            <span className="nav-emoji">🔍</span>Search<kbd className="search-hint">⌘K</kbd>
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
                <Link href="/categories/bespoke" onClick={() => setDrawerOpen(false)}>
                  Bespoke
                </Link>
                <Link href="/categories/government" onClick={() => setDrawerOpen(false)}>
                  Government
                </Link>
                <Link href="/categories/industry" onClick={() => setDrawerOpen(false)}>
                  Industry
                </Link>
                <Link href="/categories/research" onClick={() => setDrawerOpen(false)}>
                  Research
                </Link>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    handleOpenSearch();
                  }}
                  className="command-palette-trigger"
                >
                  <span className="nav-emoji">🔍</span>Search
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
