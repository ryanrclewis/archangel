"use client";

import { useMemo, useState } from "react";
import { SECTION_OPTIONS, type Project } from "./types";

type Props = {
  projects: Project[];
  onSelect: (project: Project) => void;
  onNew: (defaultSection?: string) => void;
  onDuplicate: (project: Project) => void;
  onToggleHidden: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (updated: Project[]) => void;
};

type VisibilityFilter = "all" | "visible" | "hidden" | "featured" | "archived";

export function ProjectsTab({
  projects,
  onSelect,
  onNew,
  onDuplicate,
  onToggleHidden,
  onDelete,
  onReorder,
}: Props) {
  const [section, setSection] = useState<string>("all");
  const [visibility, setVisibility] = useState<VisibilityFilter>("all");
  const [query, setQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const sectionCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    for (const opt of SECTION_OPTIONS) {
      counts[opt.id] = projects.filter((p) => p.section === opt.id).length;
    }
    return counts;
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (section !== "all" && p.section !== section) return false;
      if (visibility === "visible" && (p.hidden || p.archived)) return false;
      if (visibility === "hidden" && !p.hidden) return false;
      if (visibility === "featured" && !p.featured) return false;
      if (visibility === "archived" && !p.archived) return false;
      if (!q) return true;
      const haystack = [
        p.name,
        p.id,
        p.type,
        p.status,
        p.section,
        p.description,
        ...(p.clients ?? []).map((c) => c.name),
        ...(p.values ?? []).map((v) => v.text),
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
            Edit portfolio entries, toggle public visibility, or filter by section to reorder how cards appear.
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
            placeholder="Search projects, clients, values…"
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

        <div className="admin-filter-pills" role="group" aria-label="Filter by visibility">
          {(
            [
              ["all", "All"],
              ["visible", "Public"],
              ["featured", "Featured"],
              ["hidden", "Hidden"],
              ["archived", "Archived"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`admin-pill ${visibility === id ? "is-active" : ""}`}
              onClick={() => setVisibility(id)}
            >
              {label}
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

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <p>No projects match the current filters.</p>
          <button
            type="button"
            className="admin-btn admin-btn--ghost admin-btn--sm"
            onClick={() => {
              setQuery("");
              setSection("all");
              setVisibility("all");
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
            return (
              <div
                key={p.id || `proj-${index}`}
                className={`admin-project-row ${p.hidden ? "is-hidden" : ""}`}
              >
                <div
                  className="admin-project-monogram"
                  data-tone={tone}
                  aria-hidden="true"
                  onClick={() => onSelect(p)}
                  style={{ cursor: "pointer" }}
                >
                  {(p.name || "?").slice(0, 1).toUpperCase()}
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
                    {p.section && <span className="admin-badge admin-badge--blue">{p.section}</span>}
                    {p.featured && <span className="admin-badge admin-badge--ink">Featured</span>}
                    {p.hidden && <span className="admin-badge admin-badge--amber">Hidden</span>}
                    {p.archived && <span className="admin-badge">Archived</span>}
                    {p.type && <span className="admin-stat-meta">{p.type}</span>}
                  </div>
                  <p className="admin-project-desc">
                    {p.description || "No description yet — click to edit."}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
