"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { projects, type ProjectSection } from "@/app/data/projects";

const navigationSections: Array<{ key: ProjectSection; label: string; emoji: string }> = [
  { key: "bespoke", label: "Bespoke", emoji: "🧵" },
  { key: "government", label: "Government", emoji: "🏛️" },
  { key: "industry", label: "Industry", emoji: "🏭" },
  { key: "research", label: "Research", emoji: "📚" },
];

const CLOSE_DELAY_MS = 180;

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openSection, setOpenSection] = useState<ProjectSection | null>(null);
  const [displaySection, setDisplaySection] = useState<ProjectSection | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openMenu = useCallback(
    (section: ProjectSection) => {
      clearCloseTimer();
      window.dispatchEvent(
        new CustomEvent("command-palette-close", { detail: { reason: "nav-switch" } }),
      );
      setOpenSection(section);
      setDisplaySection(section);
    },
    [clearCloseTimer],
  );

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setOpenSection(null);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setOpenSection(null);
      window.dispatchEvent(
        new CustomEvent("command-palette-close", { detail: { reason: "hover-leave" } }),
      );
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  const handleOpenSearchHover = useCallback(() => {
    clearCloseTimer();
    setOpenSection(null);
    window.dispatchEvent(
      new CustomEvent("command-palette-open", { detail: { trigger: "hover" } }),
    );
  }, [clearCloseTimer]);

  const handleOpenSearchClick = useCallback(() => {
    clearCloseTimer();
    setOpenSection(null);
    window.dispatchEvent(
      new CustomEvent("command-palette-open", { detail: { trigger: "click" } }),
    );
  }, [clearCloseTimer]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setOpenSection(null);
      }
    };
    const onPaletteState = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      const isPaletteOpen = Boolean(detail?.open);
      setSearchOpen(isPaletteOpen);
      if (isPaletteOpen) {
        setOpenSection(null);
      }
    };
    const onPaletteHoverEnter = () => clearCloseTimer();
    const onPaletteHoverLeave = () => scheduleClose();

    window.addEventListener("keydown", onKey);
    window.addEventListener("command-palette-state", onPaletteState);
    window.addEventListener("command-palette-hover-enter", onPaletteHoverEnter);
    window.addEventListener("command-palette-hover-leave", onPaletteHoverLeave);

    return () => {
      clearCloseTimer();
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("command-palette-state", onPaletteState);
      window.removeEventListener("command-palette-hover-enter", onPaletteHoverEnter);
      window.removeEventListener("command-palette-hover-leave", onPaletteHoverLeave);
    };
  }, [clearCloseTimer, scheduleClose]);

  const isExpanded = Boolean(openSection || searchOpen);
  const activeSectionProjects = displaySection
    ? projects.filter(
        (project) =>
          project.section === displaySection &&
          !project.archived,
      )
    : [];

  return (
    <>
      <header
        className={`site-header ${isExpanded ? "nav-expanded" : ""}`}
        aria-label="Site header"
        onMouseEnter={clearCloseTimer}
        onMouseLeave={(event) => {
          const nextTarget = event.relatedTarget;
          if (nextTarget instanceof Element && nextTarget.closest(".command-palette")) {
            return;
          }
          scheduleClose();
        }}
        onBlur={(event) => {
          const nextTarget = event.relatedTarget;
          if (!(nextTarget instanceof Node && event.currentTarget.contains(nextTarget))) {
            setOpenSection(null);
          }
        }}
      >
        <Link className="site-mark" href="/" onClick={closeMenu}>
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
          <nav
            className={`site-nav ${isExpanded ? "has-active" : ""}`}
            aria-label="Primary navigation"
          >
            {navigationSections.map(({ key, label, emoji }) => (
              <div
                className={`site-nav-menu ${openSection === key ? "is-open" : ""}`}
                key={key}
                onMouseEnter={() => openMenu(key)}
              >
                <Link
                  href={`/categories/${key}`}
                  aria-haspopup="true"
                  aria-expanded={openSection === key}
                  onFocus={() => openMenu(key)}
                  onClick={closeMenu}
                >
                  <span className="nav-emoji" aria-hidden="true">
                    {emoji}
                  </span>
                  <span className="nav-label">{label}</span>
                </Link>
              </div>
            ))}
            <button
              type="button"
              className={`command-palette-trigger ${searchOpen ? "is-open" : ""}`}
              onClick={handleOpenSearchClick}
              onMouseEnter={handleOpenSearchHover}
              aria-label="Search projects (Cmd+K)"
              aria-expanded={searchOpen}
              title="Press Cmd+K to search projects"
            >
              <span className="nav-emoji" aria-hidden="true">
                🔍
              </span>
              <span className="nav-label">Search</span>
              <kbd className="search-hint">⌘K</kbd>
            </button>
          </nav>
        )}

        {!isMobile && (
          <div
            className={`site-nav-dropdown ${openSection ? "is-open" : ""}`}
            aria-hidden={!openSection}
          >
            {displaySection && (
              <div className="site-nav-dropdown-inner">
                <div
                  className={`site-nav-project-list ${
                    activeSectionProjects.length > 5 ? "is-multi-column" : ""
                  }`}
                >
                  {activeSectionProjects.map((project) => (
                    <Link
                      href={`/projects/${project.id}`}
                      key={project.id}
                      onClick={closeMenu}
                    >
                      {project.emoji && (
                        <span className="site-nav-project-emoji" aria-hidden="true">
                          {project.emoji}
                        </span>
                      )}
                      <span>{project.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </header>

      {isMobile && drawerOpen && (
        <>
          <div id="mobile-drawer" className="mobile-drawer open" aria-hidden={false}>
            <div className="drawer-inner">
              <button
                type="button"
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
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    handleOpenSearchClick();
                  }}
                  className="command-palette-trigger"
                >
                  <span className="nav-emoji" aria-hidden="true">
                    🔍
                  </span>
                  Search
                </button>
              </nav>
            </div>
          </div>
          <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
        </>
      )}

      <div
        className={`site-nav-backdrop ${openSection ? "open" : ""}`}
        aria-hidden="true"
        onClick={closeMenu}
      />
    </>
  );
}
