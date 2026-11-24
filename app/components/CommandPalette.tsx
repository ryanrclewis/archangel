"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XmarkCircleFillIcon,
} from "@/app/components/SfSymbols";
import { formatTagTitle, getAllProjectTags, type Project } from "@/app/data/projects";
import siteConfig from "@/app/data/site-config.json";
import { getPhraseChipStyle } from "@/app/utils/phraseStyles";
import { searchProjects } from "@/app/utils/searchProjects";

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const isOpenRef = useRef(false);
  const pinnedRef = useRef(false);
  const queryRef = useRef("");

  const results = useMemo(() => searchProjects(query), [query]);
  const allTags = useMemo(() => getAllProjectTags(), []);
  const trimmedQuery = query.trim();
  const activeOptionId =
    trimmedQuery && results[selectedIndex]
      ? `command-palette-option-${results[selectedIndex].id}`
      : undefined;

  const closePalette = useCallback(() => {
    pinnedRef.current = false;
    setIsPinned(false);
    setIsOpen(false);
  }, []);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  useEffect(() => {
    isOpenRef.current = isOpen;
    window.dispatchEvent(new CustomEvent("command-palette-state", { detail: { open: isOpen } }));

    if (!isOpen) {
      pinnedRef.current = false;
      if (previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
        previouslyFocusedRef.current = null;
      }
    }
  }, [isOpen]);

  // Apply modal focus trap & scroll lock when intentionally pinned (click / Cmd+K / typing)
  useEffect(() => {
    if (!isOpen || !isPinned) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleFocusTrap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusables = getFocusableElements(dialogRef.current);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleFocusTrap);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleFocusTrap);
    };
  }, [isOpen, isPinned]);

  // Keep keyboard-selected result scrolled into view
  useEffect(() => {
    if (!isOpen || !trimmedQuery) return;
    optionRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }, [isOpen, trimmedQuery, selectedIndex]);

  const navigateToProject = useCallback(
    (project: Project) => {
      const href = project.url ?? `/projects/${project.id}`;
      closePalette();
      if (project.url?.startsWith("http")) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        router.push(href);
      }
    },
    [closePalette, router],
  );

  useEffect(() => {
    const open = (event?: Event) => {
      const trigger = (event as CustomEvent<{ trigger?: string }> | undefined)?.detail?.trigger;
      const isHoverTrigger = trigger === "hover";

      if (isHoverTrigger) {
        if (!isOpenRef.current) {
          pinnedRef.current = false;
          setIsPinned(false);
          setQuery("");
          setSelectedIndex(0);
          setIsOpen(true);
        }
        return;
      }

      // Clicking Search while already pinned toggles it closed
      if (trigger === "click" && isOpenRef.current && pinnedRef.current) {
        pinnedRef.current = false;
        setIsPinned(false);
        setIsOpen(false);
        return;
      }

      if (!isOpenRef.current && document.activeElement instanceof HTMLElement) {
        previouslyFocusedRef.current = document.activeElement;
      }
      pinnedRef.current = true;
      setIsPinned(true);
      setQuery("");
      setSelectedIndex(0);
      setIsOpen(true);
      requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    };

    const close = (event?: Event) => {
      const reason = (event as CustomEvent<{ reason?: string }> | undefined)?.detail?.reason;
      if (reason === "hover-leave" && (pinnedRef.current || queryRef.current.trim().length > 0)) {
        return;
      }
      pinnedRef.current = false;
      setIsPinned(false);
      setIsOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isOpenRef.current) {
          pinnedRef.current = false;
          setIsPinned(false);
          setIsOpen(false);
        } else {
          open();
        }
      } else if (event.key === "Escape" && isOpenRef.current) {
        event.preventDefault();
        pinnedRef.current = false;
        setIsPinned(false);
        setIsOpen(false);
      }
    };

    window.addEventListener("command-palette-open", open);
    window.addEventListener("command-palette-close", close);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("command-palette-open", open);
      window.removeEventListener("command-palette-close", close);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && trimmedQuery && results.length > 0) {
      event.preventDefault();
      setSelectedIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp" && trimmedQuery && results.length > 0) {
      event.preventDefault();
      setSelectedIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && trimmedQuery && results[selectedIndex]) {
      event.preventDefault();
      navigateToProject(results[selectedIndex]);
    }
  };

  const liveAnnouncement = !trimmedQuery
    ? ""
    : results.length === 0
      ? "No projects found"
      : `${results.length} ${results.length === 1 ? "project" : "projects"} found`;

  return (
    <>
      <div
        className={`command-palette-backdrop ${isOpen ? "open" : ""}`}
        aria-hidden="true"
        onClick={closePalette}
      />
      <div
        id="command-palette-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal={isPinned}
        aria-label="Search Archangel Laboratories"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`command-palette ${isOpen ? "open" : ""} ${trimmedQuery ? "has-query" : ""}`}
        onMouseEnter={() => window.dispatchEvent(new Event("command-palette-hover-enter"))}
        onMouseLeave={(event) => {
          const nextTarget = event.relatedTarget;
          if (nextTarget instanceof Element && nextTarget.closest(".site-header")) {
            return;
          }
          window.dispatchEvent(new Event("command-palette-hover-leave"));
        }}
      >
        <div className="command-palette-content">
          <div className="command-palette-input-wrapper">
            <span className="command-palette-search-icon" aria-hidden="true">
              <MagnifyingGlassIcon size="1.25rem" />
            </span>
            <input
              ref={inputRef}
              type="search"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={Boolean(trimmedQuery && results.length > 0)}
              aria-controls="command-palette-listbox"
              aria-activedescendant={activeOptionId}
              placeholder="Search Archangel"
              value={query}
              onFocus={() => {
                pinnedRef.current = true;
                setIsPinned(true);
              }}
              onChange={(event) => {
                const nextQuery = event.target.value;
                if (nextQuery.trim().length > 0) {
                  pinnedRef.current = true;
                  setIsPinned(true);
                }
                setQuery(nextQuery);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="command-palette-input"
              aria-label="Search projects"
              autoComplete="off"
            />
            {query.length > 0 && (
              <button
                type="button"
                className="command-palette-clear"
                aria-label="Clear Search"
                onClick={() => {
                  setQuery("");
                  setSelectedIndex(0);
                  inputRef.current?.focus();
                }}
              >
                <XmarkCircleFillIcon size="1.2rem" />
              </button>
            )}
          </div>

          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {liveAnnouncement}
          </div>

          <div className="command-palette-results">
            {!trimmedQuery && allTags.length > 0 && (
              <div className="command-palette-tags">
                <div
                  className="command-palette-tags-track"
                  role="region"
                  aria-label="Project values"
                >
                  {allTags.map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/tags/${tag.slug}`}
                      onClick={closePalette}
                      className="client-chip client-chip-link command-palette-tag-chip"
                      style={getPhraseChipStyle(tag.name, tag.color)}
                    >
                      <span>{formatTagTitle(tag.name)}</span>
                      <span className="command-palette-tag-count">{tag.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className={trimmedQuery ? "command-palette-suggested-searches" : "command-palette-quick-links"}>
              <p>{trimmedQuery ? "Projects" : "Quick Links"}</p>
              {!trimmedQuery ? (
                <>
                  <Link href="/categories/bespoke" onClick={closePalette}>
                    <ArrowRightIcon size="0.9rem" className="inline-symbol" />
                    <span>Bespoke</span>
                  </Link>
                  <Link href="/categories/government" onClick={closePalette}>
                    <ArrowRightIcon size="0.9rem" className="inline-symbol" />
                    <span>Government</span>
                  </Link>
                  <Link href="/categories/industry" onClick={closePalette}>
                    <ArrowRightIcon size="0.9rem" className="inline-symbol" />
                    <span>Industry</span>
                  </Link>
                  <Link href="/categories/research" onClick={closePalette}>
                    <ArrowRightIcon size="0.9rem" className="inline-symbol" />
                    <span>Research</span>
                  </Link>
                  <Link href="/archive" onClick={closePalette}>
                    <ArrowRightIcon size="0.9rem" className="inline-symbol" />
                    <span>Project Archive</span>
                  </Link>
                  <a href={`mailto:${siteConfig.contactEmail}`} onClick={closePalette}>
                    <ArrowRightIcon size="0.9rem" className="inline-symbol" />
                    <span>Contact</span>
                  </a>
                </>
              ) : results.length > 0 ? (
                <ul id="command-palette-listbox" role="listbox" aria-label="Search results">
                  {results.map((project, index) => (
                    <li
                      key={project.id}
                      id={`command-palette-option-${project.id}`}
                      ref={(el) => {
                        optionRefs.current[index] = el;
                      }}
                      role="option"
                      aria-selected={index === selectedIndex}
                      className={`command-palette-result ${index === selectedIndex ? "selected" : ""}`}
                      onClick={() => navigateToProject(project)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <span className="command-palette-result-main">
                        <span className="command-palette-result-icon" aria-hidden="true">
                          {project.emoji ? project.emoji : <MagnifyingGlassIcon size="0.95rem" />}
                        </span>
                        <span>{project.name}</span>
                      </span>
                      <span className="command-palette-result-meta">{project.type}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="command-palette-no-results">No projects found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
