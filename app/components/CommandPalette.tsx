"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { type Project } from "@/app/data/projects";
import { searchProjects } from "@/app/utils/searchProjects";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchProjects(query);

  const navigateToProject = (project: Project) => {
    const href = project.url ?? `/projects/${project.id}`;
    if (project.url?.startsWith("http")) {
      window.open(href, "_blank");
    } else {
      window.location.href = href;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const open = () => {
      setIsOpen(true);
      setQuery("");
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    };
    const close = () => setIsOpen(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      } else if (event.key === "Escape" && isOpen) {
        event.preventDefault();
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
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

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
      <div className={`command-palette-backdrop ${isOpen ? "open" : ""}`} aria-hidden="true" />
      <div
        className={`command-palette ${isOpen ? "open" : ""} ${query.trim() ? "has-query" : ""}`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={(event) => {
          const nextTarget = event.relatedTarget;
          if (!(nextTarget instanceof Element && nextTarget.closest(".command-palette-trigger"))) {
            setIsOpen(false);
          }
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
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="command-palette-input"
            aria-label="Search projects"
            autoComplete="off"
          />
        </div>

        <div className="command-palette-results">
          <div className={query.trim() ? "command-palette-suggested-searches" : "command-palette-quick-links"}>
            <p>{query.trim() ? "Suggested Searches" : "Quick Links"}</p>
            {!query.trim() ? (
              <Link href="/categories/bespoke" onClick={() => setIsOpen(false)}>Bespoke</Link>
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
                <Link href="/categories/government" onClick={() => setIsOpen(false)}>Government</Link>
                <Link href="/categories/industry" onClick={() => setIsOpen(false)}>Industry</Link>
                <Link href="/categories/research" onClick={() => setIsOpen(false)}>Research</Link>
                <Link href="/archive" onClick={() => setIsOpen(false)}>Project Archive</Link>
              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
