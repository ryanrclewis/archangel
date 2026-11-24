"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import {
  ChevronRightIcon,
  LineHorizontal3Icon,
  MagnifyingGlassIcon,
  XmarkIcon,
} from "@/app/components/SfSymbols";
import { projects, type ProjectSection } from "@/app/data/projects";

const navigationSections: Array<{ key: ProjectSection; label: string; emoji: string }> = [
  { key: "bespoke", label: "Bespoke", emoji: "🧵" },
  { key: "government", label: "Government", emoji: "🏛️" },
  { key: "industry", label: "Industry", emoji: "🏭" },
  { key: "research", label: "Research", emoji: "📚" },
];

const CLOSE_DELAY_MS = 180;

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function subscribeNoop(): () => void {
  return () => {};
}

function getIsApplePlatform(): boolean {
  if (typeof navigator === "undefined") return true;
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform ??
    navigator.userAgent;
  return /(Mac|iPhone|iPad|iPod)/i.test(platform);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedDrawerSection, setExpandedDrawerSection] = useState<ProjectSection | null>(null);
  const [openSection, setOpenSection] = useState<ProjectSection | null>(null);
  const [displaySection, setDisplaySection] = useState<ProjectSection | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isApplePlatform = useSyncExternalStore(subscribeNoop, getIsApplePlatform, () => true);

  const closeTimerRef = useRef<number | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerCloseBtnRef = useRef<HTMLButtonElement>(null);
  const navToggleBtnRef = useRef<HTMLButtonElement>(null);
  const prevDrawerOpenRef = useRef(false);

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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 4);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

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
        setDrawerOpen(false);
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
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("command-palette-state", onPaletteState);
      window.removeEventListener("command-palette-hover-enter", onPaletteHoverEnter);
      window.removeEventListener("command-palette-hover-leave", onPaletteHoverLeave);
    };
  }, [clearCloseTimer, scheduleClose]);

  // Modal focus management and scroll lock for mobile drawer
  useEffect(() => {
    if (drawerOpen) {
      prevDrawerOpenRef.current = true;
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => drawerCloseBtnRef.current?.focus());

      const handleTrap = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;
        const focusables = getFocusableElements(drawerRef.current);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };

      window.addEventListener("keydown", handleTrap);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener("keydown", handleTrap);
      };
    }

    if (prevDrawerOpenRef.current) {
      prevDrawerOpenRef.current = false;
      navToggleBtnRef.current?.focus();
    }
  }, [drawerOpen]);

  const isExpanded = Boolean(openSection || searchOpen);
  const activeSectionProjects = displaySection
    ? projects.filter((project) => project.section === displaySection && !project.archived)
    : [];

  const shortcutLabel = isApplePlatform ? "⌘K" : "Ctrl K";
  const shortcutAria = isApplePlatform ? "Command K" : "Control K";

  return (
    <>
      <header
        className={`site-header ${isScrolled ? "is-scrolled" : ""} ${isExpanded ? "nav-expanded" : ""}`.trim()}
        aria-label="Site header"
        onMouseEnter={clearCloseTimer}
        onMouseLeave={(event) => {
          const nextTarget = event.relatedTarget;
          if (
            nextTarget instanceof Element &&
            (nextTarget.closest(".command-palette") || nextTarget.closest(".site-nav-dropdown"))
          ) {
            return;
          }
          scheduleClose();
        }}
      >
        <Link className="site-mark" href="/" onClick={closeMenu}>
          <Image src="/icon.svg" alt="" width={32} height={32} priority />
          <span>Archangel Laboratories</span>
        </Link>

        <button
          ref={navToggleBtnRef}
          type="button"
          className="nav-toggle"
          aria-label="Open navigation menu"
          aria-controls="mobile-drawer"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          <LineHorizontal3Icon size="1.35rem" />
        </button>

        <nav
          className={`site-nav ${isExpanded ? "has-active" : ""}`}
          aria-label="Primary navigation"
        >
          {navigationSections.map(({ key, label, emoji }) => {
            const isCurrent = pathname === `/categories/${key}`;
            return (
              <div
                className={`site-nav-menu ${openSection === key ? "is-open" : ""}`}
                key={key}
                onMouseEnter={() => openMenu(key)}
              >
                <Link
                  href={`/categories/${key}`}
                  aria-current={isCurrent ? "page" : undefined}
                  aria-expanded={openSection === key}
                  onClick={closeMenu}
                >
                  <span className="nav-emoji" aria-hidden="true">
                    {emoji}
                  </span>
                  <span className="nav-label">{label}</span>
                </Link>
              </div>
            );
          })}
          <button
            type="button"
            className={`command-palette-trigger ${searchOpen ? "is-open" : ""}`}
            onClick={handleOpenSearchClick}
            onMouseEnter={handleOpenSearchHover}
            aria-label={`Search projects (${shortcutAria})`}
            aria-expanded={searchOpen}
            aria-controls="command-palette-dialog"
            title={`Search projects (${shortcutLabel})`}
          >
            <span className="nav-emoji" aria-hidden="true">
              🔍
            </span>
            <span className="nav-label">Search</span>
            <kbd className="search-hint" aria-hidden="true">
              {shortcutLabel}
            </kbd>
          </button>
        </nav>
      </header>

      <div
        className={`site-nav-dropdown ${openSection ? "is-open" : ""}`}
        aria-hidden={!openSection}
        inert={!openSection}
        onMouseEnter={clearCloseTimer}
        onMouseLeave={(event) => {
          const nextTarget = event.relatedTarget;
          if (nextTarget instanceof Element && nextTarget.closest(".site-header")) {
            return;
          }
          scheduleClose();
        }}
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

      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
        className={`mobile-drawer ${drawerOpen ? "open" : ""}`}
      >
        <div className="drawer-inner">
          <div className="drawer-header">
            <span className="drawer-title">Menu</span>
            <button
              ref={drawerCloseBtnRef}
              type="button"
              className="drawer-close"
              aria-label="Close Navigation Menu"
              onClick={() => setDrawerOpen(false)}
            >
              <XmarkIcon size="1.25rem" />
            </button>
          </div>
          <nav className="drawer-nav" aria-label="Mobile navigation">
            {navigationSections.map(({ key, label, emoji }) => {
              const isCurrent = pathname === `/categories/${key}`;
              const isSubOpen = expandedDrawerSection === key;
              const sectionProjects = projects.filter(
                (project) => project.section === key && !project.archived,
              );
              return (
                <div className="drawer-nav-group" key={key}>
                  <div className="drawer-nav-row">
                    <Link
                      href={`/categories/${key}`}
                      aria-current={isCurrent ? "page" : undefined}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <span aria-hidden="true">{emoji}</span>
                      <span>{label}</span>
                    </Link>
                    {sectionProjects.length > 0 && (
                      <button
                        type="button"
                        className="drawer-expand-btn"
                        aria-expanded={isSubOpen}
                        aria-label={`${isSubOpen ? "Collapse" : "Expand"} ${label} projects`}
                        onClick={() =>
                          setExpandedDrawerSection((prev) => (prev === key ? null : key))
                        }
                      >
                        <ChevronRightIcon size="1.05rem" />
                      </button>
                    )}
                  </div>
                  {isSubOpen && sectionProjects.length > 0 && (
                    <div className="drawer-sublist">
                      {sectionProjects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/projects/${project.id}`}
                          onClick={() => setDrawerOpen(false)}
                        >
                          {project.emoji && <span aria-hidden="true">{project.emoji}</span>}
                          <span>{project.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              className="drawer-action-btn"
              onClick={() => {
                setDrawerOpen(false);
                handleOpenSearchClick();
              }}
            >
              <MagnifyingGlassIcon size="1.05rem" className="inline-symbol" />
              <span>Search projects</span>
            </button>
          </nav>
        </div>
      </div>

      <div
        className={`drawer-overlay ${drawerOpen ? "open" : ""}`}
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
      />

      <div
        className={`site-nav-backdrop ${openSection ? "open" : ""}`}
        aria-hidden="true"
        onClick={closeMenu}
      />
    </>
  );
}
