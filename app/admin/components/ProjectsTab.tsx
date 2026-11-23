"use client";

import { useMemo, useState } from "react";
import { SECTION_OPTIONS, type Project } from "./types";

export type VisibilityFilter =
  | "all"
  | "visible"
  | "featured"
  | "needs-work"
  | "hidden"
  | "archived";

type Props = {
  projects: Project[];
  visibility: VisibilityFilter;
  onVisibilityChange: (next: VisibilityFilter) => void;
  onSelect: (project: Project) => void;
  onNew: (defaultSection?: string) => void;
  onDuplicate: (project: Project) => void;
  onToggleHidden: (id: string) => void;
  onToggleNeedsWork: (id: string) => void;
  onDismissSuggestion: (id: string, index: number) => void;
  onDelete: (id: string) => void;
  onReorder: (updated: Project[]) => void;
};

function getMissingSignals(p: Project): string[] {
  const gaps: string[] = [];
  const words = (p.description ?? "").trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) {
    gaps.push("No description");
  } else if (words < 40) {
    gaps.push(`Short description (${words} words)`);
  }
  if (!p.features?.length) {
    gaps.push("No key features");
  }
  const hasArtifact =
    Boolean(p.url?.trim()) ||
    Boolean(p.externalLinks?.length) ||
    Boolean(p.embed?.src?.trim());
  if (!hasArtifact) {
    gaps.push("No link or embed");
  }
  if (!p.launchDate?.trim()) {
    gaps.push("No launch date");
  }
  if (!p.section) {
    gaps.push("No section");
  }
  return gaps;
}

export function ProjectsTab({
  projects,
  visibility,
  onVisibilityChange,
  onSelect,
  onNew,
  onDuplicate,
  onToggleHidden,
  onToggleNeedsWork,
  onDismissSuggestion,
  onDelete,
  onReorder,
}: Props) {
  const [section, setSection] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [expandedSuggestions, setExpandedSuggestions] = useState<Record<string, boolean>>({});

  const needsWorkCount = useMemo(
    () => projects.filter((p) => p.needsWork).length,
    [projects]
  );

  const sectionCounts = useMemo(() => {
    const base =
      visibility === "needs-work"
        ? projects.filter((p) => p.needsWork)
        : projects;
    const counts: Record<string, number> = { all: base.length };
    for (const opt of SECTION_OPTIONS) {
      counts[opt.id] = base.filter((p) => p.section === opt.id).length;
    }
    return counts;
  }, [projects, visibility]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (section !== "all" && p.section !== section) return false;
      if (visibility === "visible" && (p.hidden || p.archived)) return false;
      if (visibility === "hidden" && !p.hidden) return false;
      if (visibility === "featured" && !p.featured) return false;
      if (visibility === "archived" && !p.archived) return false;
      if (visibility === "needs-work" && !p.needsWork) return false;
      if (!q) return true;
      const haystack = [
        p.name,
        p.id,
        p.type,
        p.status,
        p.section,
        p.tagline,
        p.description,
        ...(p.clients ?? []).map((c) => c.name),
        ...(p.values ?? []).map((v) => v.text),
        ...(p.portfolioSuggestions ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, section, visibility, query]);

  const canReorder = section !== "all" && visibility === "all" && !query.trim();

  const moveInSection = (filteredIndex: number, direction: -1 | 1) => {
    const targetIndex = filteredIndex + direction;
    if (targetIndex < 0 || targetIndex >= filtered.length) return;

    const projA = filtered[filteredIndex];
    const projB = filtered[targetIndex];
    const idxA = projects.findIndex((p) => p.id === projA.id);
    const idxB = projects.findIndex((p) => p.id === projB.id);
    if (idxA === -1 || idxB === -1) return;

    const updated = [...projects];
    [updated[idxA], updated[idxB]] = [updated[idxB], updated[idxA]];
    onReorder(updated);
  };

  const toggleExpandSuggestions = (id: string) => {
    setExpandedSuggestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const statusTone = (status: Project["status"]) => {
    if (status === "LIVE") return "admin-badge--green";
    if (status === "IN PROGRESS" || status === "BETA") return "admin-badge--blue";
    if (status === "DEPRECATED" || status === "UNSUPPORTED") return "admin-badge--amber";
    return "";
  };

  return (
    <div>
      <div className="admin-panel-header">
        <div>
          <h2>Projects</h2>
          <p>
            Edit portfolio entries, review projects that need stronger case-study details, or filter by section to reorder cards.
          </p>
        </div>
        <div className="admin-panel-actions">
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={() => onNew(section)}
          >
            + New Project
          </button>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <input
            type="search"
            className="admin-search"
            placeholder="Search projects, clients, suggestions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search projects"
          />
          {query && (
            <button
              type="button"
              className="admin-search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="admin-filter-pills" role="group" aria-label="Filter by status or category">
          {(
            [
              ["all", "All"],
              ["visible", "Public"],
              ["featured", "Featured"],
              ["needs-work", "Needs Work"],
              ["hidden", "Hidden"],
              ["archived", "Archived"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`admin-pill ${id === "needs-work" ? "admin-pill--amber" : ""} ${visibility === id ? "is-active" : ""}`}
              onClick={() => onVisibilityChange(id)}
            >
              {id === "needs-work" && needsWorkCount > 0 && (
                <span className="admin-pill-dot" aria-hidden="true" />
              )}
              {label}
              {id === "needs-work" && <span>{needsWorkCount}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-toolbar" style={{ marginTop: "-0.35rem" }}>
        <div className="admin-filter-pills" role="group" aria-label="Filter by section">
          <button
            type="button"
            className={`admin-pill ${section === "all" ? "is-active" : ""}`}
            onClick={() => setSection("all")}
          >
            All Sections <span>{sectionCounts.all}</span>
          </button>
          {SECTION_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`admin-pill ${section === opt.id ? "is-active" : ""}`}
              onClick={() => setSection(opt.id)}
            >
              {opt.label} <span>{sectionCounts[opt.id] ?? 0}</span>
            </button>
          ))}
        </div>

        <span className="admin-stat-meta">
          Showing {filtered.length} of {projects.length}
          {canReorder ? " · Reorder enabled" : ""}
        </span>
      </div>

      {visibility === "needs-work" && (
        <div className="admin-notice admin-notice--amber" role="note">
          <div>
            <strong>Portfolio Readiness Queue ({needsWorkCount} projects)</strong>
            <p style={{ margin: "0.25rem 0 0", color: "var(--muted)", fontSize: "0.82rem" }}>
              Tailored suggestions to turn thin entries into compelling case studies for University and Big Tech (Google, Apple, Microsoft) roles. Check off items as you update each project, or click a project to edit it side-by-side.
            </p>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <p>
            {visibility === "needs-work" && !query.trim() && section === "all"
              ? "Every project is marked portfolio-ready!"
              : "No projects match the current filters."}
          </p>
          <button
            type="button"
            className="admin-btn admin-btn--ghost admin-btn--sm"
            onClick={() => {
              setQuery("");
              setSection("all");
              onVisibilityChange("all");
            }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="admin-project-list">
          {filtered.map((p, index) => {
            const tone = p.clients?.[0]?.tone ?? "muted";
            const isConfirming = confirmDeleteId === p.id;
            const suggestions = p.portfolioSuggestions ?? [];
            const missingSignals = p.needsWork ? getMissingSignals(p) : [];
            const showSuggestions =
              p.needsWork &&
              (visibility === "needs-work" || Boolean(expandedSuggestions[p.id]));

            return (
              <div
                key={p.id || `proj-${index}`}
                className={`admin-project-card ${p.hidden ? "is-hidden" : ""} ${p.needsWork && visibility === "needs-work" ? "is-needs-work" : ""}`}
              >
                <div className="admin-project-row">
                  <div
                    className="admin-project-monogram"
                    data-tone={tone}
                    aria-hidden="true"
                    onClick={() => onSelect(p)}
                    style={{ cursor: "pointer" }}
                  >
                    {p.emoji || (p.name || "?").slice(0, 1).toUpperCase()}
                  </div>

                  <div
                    className="admin-project-main"
                    onClick={() => onSelect(p)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(p);
                      }
                    }}
                  >
                    <div className="admin-project-title-row">
                      <span className="admin-project-name">{p.name || "(untitled)"}</span>
                      <span className={`admin-badge ${statusTone(p.status)}`}>{p.status}</span>
                      {p.section ? (
                        <span className="admin-badge admin-badge--blue">{p.section}</span>
                      ) : (
                        <span className="admin-badge admin-badge--red">No section</span>
                      )}
                      {p.featured && <span className="admin-badge admin-badge--ink">Featured</span>}
                      {p.needsWork && (
                        <span className="admin-badge admin-badge--amber">
                          Needs Work{suggestions.length ? ` · ${suggestions.length} tips` : ""}
                        </span>
                      )}
                      {p.hidden && <span className="admin-badge">Hidden</span>}
                      {p.archived && <span className="admin-badge">Archived</span>}
                      {p.type && <span className="admin-stat-meta">{p.type}</span>}
                    </div>
                    <p className="admin-project-desc">
                      {p.tagline || p.description || "No description yet — click to edit."}
                    </p>
                  </div>

                  <div className="admin-project-actions">
                    {canReorder && (
                      <>
                        <button
                          type="button"
                          className="admin-icon-btn"
                          disabled={index === 0}
                          onClick={() => moveInSection(index, -1)}
                          title="Move up"
                          aria-label={`Move ${p.name} up`}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn"
                          disabled={index === filtered.length - 1}
                          onClick={() => moveInSection(index, 1)}
                          title="Move down"
                          aria-label={`Move ${p.name} down`}
                        >
                          ↓
                        </button>
                      </>
                    )}

                    {p.needsWork && visibility !== "needs-work" && suggestions.length > 0 && (
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                        onClick={() => toggleExpandSuggestions(p.id)}
                        aria-expanded={showSuggestions}
                      >
                        {showSuggestions ? "Hide tips" : `Tips (${suggestions.length})`}
                      </button>
                    )}

                    {visibility === "needs-work" && (
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                        onClick={() => onToggleNeedsWork(p.id)}
                        title="Mark this project as portfolio-ready"
                      >
                        ✓ Mark Ready
                      </button>
                    )}

                    {!p.hidden && p.id && (
                      <a
                        href={`/projects/${p.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                        title="Open live project page"
                      >
                        View ↗
                      </a>
                    )}

                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => onToggleHidden(p.id)}
                      title={p.hidden ? "Make project public" : "Hide project from public"}
                    >
                      {p.hidden ? "Show" : "Hide"}
                    </button>

                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => onDuplicate(p)}
                      title="Duplicate project"
                    >
                      Copy
                    </button>

                    {isConfirming ? (
                      <>
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger admin-btn--sm"
                          onClick={() => {
                            setConfirmDeleteId(null);
                            onDelete(p.id);
                          }}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost admin-btn--sm"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger-ghost admin-btn--sm"
                        onClick={() => setConfirmDeleteId(p.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {showSuggestions && (
                  <div className="admin-suggestions-box">
                    <div className="admin-suggestions-header">
                      <span className="admin-suggestions-title">
                        Suggestions for University &amp; Big Tech Portfolios
                      </span>
                      {missingSignals.length > 0 && (
                        <div className="admin-missing-chips" aria-label="Missing fields">
                          {missingSignals.map((gap) => (
                            <span key={gap} className="admin-badge admin-badge--red">
                              {gap}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {suggestions.length > 0 ? (
                      <ul className="admin-suggestion-list">
                        {suggestions.map((tip, tipIndex) => (
                          <li key={tipIndex} className="admin-suggestion-item">
                            <button
                              type="button"
                              className="admin-suggestion-check"
                              onClick={() => onDismissSuggestion(p.id, tipIndex)}
                              title="Mark suggestion complete and remove"
                              aria-label={`Dismiss suggestion: ${tip}`}
                            >
                              ✓
                            </button>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="admin-stat-meta" style={{ margin: 0 }}>
                        All suggestions addressed — click &ldquo;Mark Ready&rdquo; when satisfied.
                      </p>
                    )}

                    <div className="admin-suggestions-footer">
                      <button
                        type="button"
                        className="admin-btn admin-btn--primary admin-btn--sm"
                        onClick={() => onSelect(p)}
                      >
                        Edit Project →
                      </button>
                      {visibility !== "needs-work" && (
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost admin-btn--sm"
                          onClick={() => onToggleNeedsWork(p.id)}
                        >
                          ✓ Mark Ready
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
