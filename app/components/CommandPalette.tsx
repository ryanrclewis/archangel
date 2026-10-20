"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { searchProjects } from "@/app/utils/searchProjects";
import { getPhraseChipStyle } from "@/app/utils/phraseStyles";
import { type Project } from "@/app/data/projects";

type CommandPaletteProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function CommandPalette({ isOpen: controlledIsOpen, onOpenChange }: CommandPaletteProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Use controlled or uncontrolled state
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
  const setIsOpen = useCallback((open: boolean) => {
    if (controlledIsOpen === undefined) {
      setUncontrolledIsOpen(open);
    }
    onOpenChange?.(open);
  }, [controlledIsOpen, onOpenChange]);

  const results = searchProjects(query);
  const navigateToProject = useCallback((project: Project) => {
    const href = project.url ?? `/projects/${project.id}`;
    setIsOpen(false);
    if (project.url?.startsWith("http")) window.open(href, "_blank", "noopener,noreferrer");
    else window.location.href = href;
  }, [setIsOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setQuery("");
        setSelectedIndex(0);
      }

      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }

      // Navigation with arrow keys
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (results.length) setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (results.length) setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter" && results[selectedIndex]) {
        const project = results[selectedIndex];
        navigateToProject(project);
      } else if (e.key === "Tab") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    const handleOpenCommand = () => {
      setIsOpen(true);
      setQuery("");
      setSelectedIndex(0);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("command-palette-open", handleOpenCommand);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("command-palette-open", handleOpenCommand);
    };
  }, [isOpen, selectedIndex, results, navigateToProject, setIsOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      inputRef.current.focus();
    } else if (!isOpen && triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="command-palette-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* Dialog */}
      <div className={`command-palette ${isOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="command-palette-title" hidden={!isOpen}>
        <div className="command-palette-content">
          <h2 id="command-palette-title" className="sr-only">Search projects</h2>
          {/* Search input */}
          <div className="command-palette-input-wrapper">
            <input
              ref={inputRef}
              id="command-palette-input"
              aria-label="Search projects"
              aria-controls="command-palette-results"
              aria-activedescendant={results[selectedIndex] ? `result-${results[selectedIndex].id}` : undefined}
              type="text"
              placeholder="Search projects by name, type, phrases..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              className="command-palette-input"
              autoComplete="off"
            />
          </div>

          {/* Results list */}
          <div className="command-palette-results" id="command-palette-results" role="region" aria-live="polite" aria-label="Search results">
            {results.length === 0 ? (
              <div className="command-palette-no-results">No projects found</div>
            ) : (
              <ul role="listbox">
                {results.map((project, index) => (
                  <li
                    key={project.id}
                    id={`result-${project.id}`}
                    role="option"
                    aria-selected={index === selectedIndex}
                    className={`command-palette-result ${
                      index === selectedIndex ? "selected" : ""
                    }`}
                    onClick={() => navigateToProject(project)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="result-name">{project.name}</div>
                    <div className="result-type">{project.type}</div>
                    {project.values && project.values.length > 0 && (
                      <div className="result-tags">
                        {project.values.slice(0, 2).map((val) => (
                          <span key={val.text} className="tag" style={getPhraseChipStyle(val.text, val.color)}>
                            {val.text}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer hint */}
          <div className="command-palette-footer">
            <span className="hint">
              {results.length > 0 ? (
                <>
                  <kbd>↑↓</kbd> to navigate • <kbd>Enter</kbd> to select • <kbd>Esc</kbd> to close
                </>
              ) : (
                <>
                  <kbd>Esc</kbd> to close
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
