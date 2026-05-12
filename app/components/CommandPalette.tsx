"use client";

import { useState, useEffect, useRef } from "react";
import { searchProjects } from "@/app/utils/searchProjects";
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

  // Use controlled or uncontrolled state
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
  const setIsOpen = (open: boolean) => {
    if (controlledIsOpen === undefined) {
      setUncontrolledIsOpen(open);
    }
    onOpenChange?.(open);
  };

  const results = searchProjects(query);

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
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter" && results[selectedIndex]) {
        const project = results[selectedIndex];
        navigateToProject(project);
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
  }, [isOpen, selectedIndex, results]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const navigateToProject = (project: Project) => {
    const href = project.url ?? `/projects/${project.id}`;
    if (project.url?.startsWith("http")) {
      window.open(href, "_blank");
    } else {
      window.location.href = href;
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="command-palette-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* Dialog */}
      <div className={`command-palette ${isOpen ? "open" : ""}`}>
        <div className="command-palette-content">
          {/* Search input */}
          <div className="command-palette-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search projects by name, type, tags..."
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
          <div className="command-palette-results">
            {results.length === 0 ? (
              <div className="command-palette-no-results">No projects found</div>
            ) : (
              <ul role="listbox">
                {results.map((project, index) => (
                  <li
                    key={project.id}
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
                    {project.tags && project.tags.length > 0 && (
                      <div className="result-tags">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="tag">
                            {tag}
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
