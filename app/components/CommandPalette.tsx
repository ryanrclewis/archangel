"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getAllProjectTags, type Project } from "@/app/data/projects";
import { getPhraseChipStyle } from "@/app/utils/phraseStyles";
import { searchProjects } from "@/app/utils/searchProjects";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpenRef = useRef(false);
  const pinnedRef = useRef(false);
  const queryRef = useRef("");
  const results = searchProjects(query);
  const allTags = useMemo(() => getAllProjectTags(), []);

  useEffect(() => {
    isOpenRef.current = isOpen;
    window.dispatchEvent(new CustomEvent("command-palette-state", { detail: { open: isOpen } }));
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    } else {
      pinnedRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const closePalette = () => {
    pinnedRef.current = false;
    setIsOpen(false);
  };

  const navigateToProject = (project: Project) => {
    const href = project.url ?? `/projects/${project.id}`;
    if (project.url?.startsWith("http")) {
      window.open(href, "_blank");
    } else {
      window.location.href = href;
    }
    closePalette();
  };

  useEffect(() => {
    const open = (event?: Event) => {
      const trigger = (event as CustomEvent<{ trigger?: string }> | undefined)?.detail?.trigger;
      const isHoverTrigger = trigger === "hover";

      if (isHoverTrigger) {
        if (!isOpenRef.current) {
          pinnedRef.current = false;
          setQuery("");
          setSelectedIndex(0);
          setIsOpen(true);
        }
        return;
      }

      pinnedRef.current = true;
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
      setIsOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      } else if (event.key === "Escape" && isOpenRef.current) {
        event.preventDefault();
        pinnedRef.current = false;
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
    if (event.key === "ArrowDown" && results.length > 0) {
      event.preventDefault();
      setSelectedIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length > 0) {
      event.preventDefault();
      setSelectedIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && results[selectedIndex]) {
      event.preventDefault();
      navigateToProject(results[selectedIndex]);
    }
  };

  return (
    <>
      <div
        className={`command-palette-backdrop ${isOpen ? "open" : ""}`}
        aria-hidden="true"
        onClick={closePalette}
      />
      <div
        className={`command-palette ${isOpen ? "open" : ""} ${query.trim() ? "has-query" : ""}`}
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
            <span className="command-palette-search-icon" aria-hidden="true">⌕</span>
            <input
              ref={inputRef}
              type="search"
              placeholder="Search Archangel"
              value={query}
              onChange={(event) => {
                const nextQuery = event.target.value;
                if (nextQuery.trim().length > 0) {
                  pinnedRef.current = true;
                }
                setQuery(nextQuery);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="command-palette-input"
              aria-label="Search projects"
              autoComplete="off"
            />
          </div>

          <div className="command-palette-results">
            {!query.trim() && allTags.length > 0 && (
              <div className="command-palette-tags">
                <div
                  className="command-palette-tags-track"
                  role="region"
                  aria-label="Project tags"
                >
                  {allTags.map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/tags/${tag.slug}`}
                      onClick={closePalette}
                      className="client-chip command-palette-tag-chip"
                      style={getPhraseChipStyle(tag.name, tag.color)}
                    >
                      <span>{tag.name}</span>
                      <span className="command-palette-tag-count">{tag.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className={query.trim() ? "command-palette-suggested-searches" : "command-palette-quick-links"}>
              <p>{query.trim() ? "Suggested Searches" : "Quick Links"}</p>
              {!query.trim() ? (
                <Link href="/categories/bespoke" onClick={closePalette}>Bespoke</Link>
              ) : results.length > 0 ? (
                <ul role="listbox">
                  {results.map((project, index) => (
                    <li
                      key={project.id}
                      role="option"
                      aria-selected={index === selectedIndex}
                      className={`command-palette-result ${index === selectedIndex ? "selected" : ""}`}
                      onClick={() => navigateToProject(project)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      {project.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="command-palette-no-results">No projects found</div>
              )}
              {!query.trim() && (
                <>
                  <Link href="/categories/government" onClick={closePalette}>Government</Link>
                  <Link href="/categories/industry" onClick={closePalette}>Industry</Link>
                  <Link href="/categories/research" onClick={closePalette}>Research</Link>
                  <Link href="/archive" onClick={closePalette}>Project Archive</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
