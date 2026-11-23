"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SECTION_OPTIONS,
  STATUS_OPTIONS,
  TONE_OPTIONS,
  slugify,
  type Project,
  type ProjectClient,
  type ProjectClientTone,
  type ProjectEmbed,
  type ProjectLink,
  type ProjectStatus,
} from "./types";

type Props = {
  project: Project;
  isNew: boolean;
  existingIds: string[];
  valueColors: Record<string, string>;
  onSave: (project: Project, originalId: string) => void;
  onCancel: () => void;
};

export function ProjectEditor({
  project,
  isNew,
  existingIds,
  valueColors,
  onSave,
  onCancel,
}: Props) {
  const [p, setP] = useState<Project>({ ...project });
  const [slugTouched, setSlugTouched] = useState(!isNew && Boolean(project.id));
  const [error, setError] = useState<string | null>(null);

  const originalId = project.id;

  const isDirty = useMemo(
    () => JSON.stringify(p) !== JSON.stringify(project),
    [p, project]
  );

  const set = <K extends keyof Project>(key: K, val: Project[K]) => {
    setError(null);
    setP((prev) => ({ ...prev, [key]: val }));
  };

  const handleNameChange = (name: string) => {
    setError(null);
    setP((prev) => ({
      ...prev,
      name,
      id: !slugTouched && isNew ? slugify(name) : prev.id,
    }));
  };

  const handleSubmit = () => {
    const cleanId = slugify(p.id);
    if (!cleanId) {
      setError("Please enter a URL-safe project ID (slug).");
      return;
    }
    if (!p.name.trim()) {
      setError("Please enter a project name.");
      return;
    }
    const idCollision = existingIds.some(
      (existing) => existing === cleanId && (isNew || existing !== originalId)
    );
    if (idCollision) {
      setError(`Another project already uses the ID "${cleanId}".`);
      return;
    }

    const cleanedEmbed = p.embed?.src?.trim() ? p.embed : undefined;
    const cleanedLinks = (p.externalLinks ?? []).filter(
      (link) => link.label.trim() && link.href.trim()
    );
    const cleanedFeatures = (p.features ?? []).filter((f) => f.trim());
    const cleanedClients = (p.clients ?? []).filter((c) => c.name.trim());
    const cleanedValues = (p.values ?? []).filter((v) => v.text.trim());
    const cleanedSuggestions = (p.portfolioSuggestions ?? []).filter((s) => s.trim());

    onSave(
      {
        ...p,
        id: cleanId,
        name: p.name.trim(),
        emoji: p.emoji?.trim() ? p.emoji.trim() : undefined,
        tagline: p.tagline?.trim() ? p.tagline.trim() : undefined,
        url: p.url?.trim() ? p.url.trim() : undefined,
        embed: cleanedEmbed,
        externalLinks: cleanedLinks.length ? cleanedLinks : undefined,
        features: cleanedFeatures.length ? cleanedFeatures : undefined,
        clients: cleanedClients.length ? cleanedClients : undefined,
        values: cleanedValues.length ? cleanedValues : undefined,
        caseStudy: p.caseStudy?.trim() ? p.caseStudy : undefined,
        needsWork: p.needsWork || undefined,
        portfolioSuggestions: cleanedSuggestions.length ? cleanedSuggestions : undefined,
      },
      originalId
    );
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // Clients helpers
  const setClient = (i: number, key: keyof ProjectClient, val: string) =>
    setP((prev) => {
      const clients = [...(prev.clients ?? [])];
      clients[i] = { ...clients[i], [key]: val };
      return { ...prev, clients };
    });
  const addClient = () =>
    setP((prev) => ({
      ...prev,
      clients: [...(prev.clients ?? []), { name: "", tone: "muted" }],
    }));
  const removeClient = (i: number) =>
    setP((prev) => ({
      ...prev,
      clients: (prev.clients ?? []).filter((_, idx) => idx !== i),
    }));

  // Values helpers
  const setValueText = (i: number, val: string) =>
    setP((prev) => {
      const values = [...(prev.values ?? [])];
      values[i] = { ...values[i], text: val };
      return { ...prev, values };
    });
  const addValue = (text = "") =>
    setP((prev) => {
      if (text && (prev.values ?? []).some((v) => v.text === text)) return prev;
      return { ...prev, values: [...(prev.values ?? []), { text }] };
    });
  const removeValue = (i: number) =>
    setP((prev) => ({
      ...prev,
      values: (prev.values ?? []).filter((_, idx) => idx !== i),
    }));

  // Features helpers
  const setFeature = (i: number, val: string) =>
    setP((prev) => {
      const features = [...(prev.features ?? [])];
      features[i] = val;
      return { ...prev, features };
    });
  const addFeature = () =>
    setP((prev) => ({ ...prev, features: [...(prev.features ?? []), ""] }));
  const removeFeature = (i: number) =>
    setP((prev) => ({
      ...prev,
      features: (prev.features ?? []).filter((_, idx) => idx !== i),
    }));

  // External links helpers
  const setExternalLink = (i: number, key: keyof ProjectLink, val: string) =>
    setP((prev) => {
      const externalLinks = [...(prev.externalLinks ?? [])];
      externalLinks[i] = { ...externalLinks[i], [key]: val };
      return { ...prev, externalLinks };
    });
  const addExternalLink = () =>
    setP((prev) => ({
      ...prev,
      externalLinks: [...(prev.externalLinks ?? []), { label: "", href: "" }],
    }));
  const removeExternalLink = (i: number) =>
    setP((prev) => ({
      ...prev,
      externalLinks: (prev.externalLinks ?? []).filter((_, idx) => idx !== i),
    }));

  // Embed helpers
  const setEmbed = (key: keyof ProjectEmbed, val: string | number | undefined) =>
    setP((prev) => ({
      ...prev,
      embed: { ...(prev.embed ?? { src: "" }), [key]: val },
    }));

  // Portfolio suggestions helpers
  const setSuggestion = (i: number, val: string) =>
    setP((prev) => {
      const portfolioSuggestions = [...(prev.portfolioSuggestions ?? [])];
      portfolioSuggestions[i] = val;
      return { ...prev, portfolioSuggestions };
    });
  const addSuggestion = () =>
    setP((prev) => ({
      ...prev,
      needsWork: true,
      portfolioSuggestions: [...(prev.portfolioSuggestions ?? []), ""],
    }));
  const removeSuggestion = (i: number) =>
    setP((prev) => ({
      ...prev,
      portfolioSuggestions: (prev.portfolioSuggestions ?? []).filter((_, idx) => idx !== i),
    }));
  const markPortfolioReady = () =>
    setP((prev) => ({
      ...prev,
      needsWork: false,
      portfolioSuggestions: [],
    }));

  const previewTone = p.clients?.[0]?.tone ?? "muted";
  const availableValueNames = Object.keys(valueColors);

  return (
    <div>
      <div className="admin-editor-bar">
        <div className="admin-editor-bar-left">
          <button
            type="button"
            className="admin-btn admin-btn--ghost admin-btn--sm"
            onClick={onCancel}
          >
            ← Back
          </button>
          <h2>{p.name || "New Project"}</h2>
          {isDirty && <span className="admin-badge admin-badge--amber">Unsaved</span>}
        </div>
        <div className="admin-panel-actions">
          {!isNew && !p.hidden && p.id && (
            <a
              href={`/projects/${p.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn--ghost admin-btn--sm"
            >
              View live ↗
            </a>
          )}
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleSubmit}
          >
            Save Project
          </button>
        </div>
      </div>

      {error && (
        <div
          className="admin-notice"
          style={{ borderColor: "var(--red)", color: "var(--red)" }}
          role="alert"
        >
          <span>{error}</span>
        </div>
      )}

      <div className="admin-editor-layout">
        <div>
          <div className="admin-field-grid">
            <div className="admin-field">
              <label className="admin-label" htmlFor="proj-name">
                Name
              </label>
              <input
                id="proj-name"
                className="admin-input"
                value={p.name}
                placeholder="e.g. SaintsTombs"
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="proj-id">
                <span>ID (slug)</span>
                <span className="admin-label-hint">/projects/{p.id || "slug"}</span>
              </label>
              <input
                id="proj-id"
                className="admin-input admin-input--mono"
                value={p.id}
                placeholder="url-safe-slug"
                onChange={(e) => {
                  setSlugTouched(true);
                  set("id", e.target.value);
                }}
              />
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="proj-section">
                Section
              </label>
              <select
                id="proj-section"
                className="admin-select"
                value={p.section ?? ""}
                onChange={(e) => set("section", e.target.value || undefined)}
              >
                <option value="">(None)</option>
                {SECTION_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="proj-status">
                Status
              </label>
              <select
                id="proj-status"
                className="admin-select"
                value={p.status}
                onChange={(e) => set("status", e.target.value as ProjectStatus)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="proj-type">
                Type
              </label>
              <input
                id="proj-type"
                className="admin-input"
                value={p.type}
                placeholder="e.g. Web Application, iOS App"
                onChange={(e) => set("type", e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="proj-launch">
                <span>Launch Date</span>
                <span className="admin-label-hint">e.g. May 2026</span>
              </label>
              <input
                id="proj-launch"
                className="admin-input"
                value={p.launchDate ?? ""}
                placeholder="Month YYYY"
                onChange={(e) => set("launchDate", e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="proj-url">
                Primary URL
              </label>
              <input
                id="proj-url"
                className="admin-input admin-input--mono"
                value={p.url ?? ""}
                placeholder="https://..."
                onChange={(e) => set("url", e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="proj-version">
                Version (optional)
              </label>
              <input
                id="proj-version"
                className="admin-input admin-input--mono"
                value={p.version ?? ""}
                placeholder="e.g. v1.2"
                onChange={(e) => set("version", e.target.value || undefined)}
              />
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="proj-emoji">
                <span>Emoji</span>
                <span className="admin-label-hint">Shown on nav hover &amp; cards</span>
              </label>
              <input
                id="proj-emoji"
                className="admin-input"
                value={p.emoji ?? ""}
                placeholder="e.g. ⛪"
                onChange={(e) => set("emoji", e.target.value || undefined)}
              />
            </div>

            <div className="admin-field admin-field--full">
              <label className="admin-label" htmlFor="proj-tagline">
                <span>Card Tagline</span>
                <span className="admin-label-hint">Short 1-sentence pitch shown on cards</span>
              </label>
              <input
                id="proj-tagline"
                className="admin-input"
                value={p.tagline ?? ""}
                placeholder="e.g. A digital keepsake for your family's history."
                onChange={(e) => set("tagline", e.target.value || undefined)}
              />
            </div>

            <div className="admin-field admin-field--full">
              <label className="admin-label" htmlFor="proj-desc">
                <span>Full Description</span>
                <span className="admin-label-hint">Shown on the project detail page</span>
              </label>
              <textarea
                id="proj-desc"
                className="admin-textarea"
                value={p.description}
                placeholder="Concise summary of the project and its purpose…"
                onChange={(e) => set("description", e.target.value)}
              />
            </div>

            <div className="admin-field admin-field--full">
              <label className="admin-label" htmlFor="proj-case-study">
                <span>Full Case Study (Markdown, optional)</span>
                <span className="admin-label-hint">Supports tables, alerts, images &amp; Mermaid</span>
              </label>
              <textarea
                id="proj-case-study"
                className="admin-textarea admin-input--mono"
                style={{ minHeight: "11rem" }}
                value={p.caseStudy ?? ""}
                placeholder="Paste a long-form Markdown case study to render on /projects/slug…"
                onChange={(e) => set("caseStudy", e.target.value || undefined)}
              />
            </div>
          </div>

          <div className="admin-toggle-row">
            <label className="admin-check-pill">
              <input
                type="checkbox"
                checked={!!p.hidden}
                onChange={(e) => set("hidden", e.target.checked)}
              />
              <span>Hidden from public</span>
            </label>

            <label className="admin-check-pill">
              <input
                type="checkbox"
                checked={!!p.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              <span>Featured on homepage</span>
            </label>

            <label className="admin-check-pill">
              <input
                type="checkbox"
                checked={!!p.archived}
                onChange={(e) => set("archived", e.target.checked)}
              />
              <span>Archived</span>
            </label>

            <label className="admin-check-pill">
              <input
                type="checkbox"
                checked={!!p.needsWork}
                onChange={(e) => set("needsWork", e.target.checked)}
              />
              <span>Needs portfolio work</span>
            </label>
          </div>

          {p.featured && (
            <div className="admin-field-grid">
              <div className="admin-field">
                <label className="admin-label" htmlFor="proj-featured-order">
                  Featured Order
                </label>
                <input
                  id="proj-featured-order"
                  type="number"
                  className="admin-input admin-input--mono"
                  value={p.featuredOrder ?? 0}
                  onChange={(e) => set("featuredOrder", Number(e.target.value))}
                />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="proj-proves">
                  What It Proves
                </label>
                <input
                  id="proj-proves"
                  className="admin-input"
                  value={p.whatItProves ?? ""}
                  placeholder="Short proof statement for featured card"
                  onChange={(e) => set("whatItProves", e.target.value || undefined)}
                />
              </div>
            </div>
          )}

          {/* Clients */}
          <div className="admin-section">
            <div className="admin-section-header">
              <h3 className="admin-section-title">Clients & Card Tone</h3>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={addClient}
              >
                + Add Client
              </button>
            </div>
            <div className="admin-repeater">
              {(p.clients ?? []).map((c, i) => (
                <div key={i} className="admin-repeater-row">
                  <input
                    className="admin-input"
                    placeholder="Client or organization name"
                    value={c.name}
                    onChange={(e) => setClient(i, "name", e.target.value)}
                  />
                  <select
                    className="admin-select"
                    style={{ width: "8.5rem", flexShrink: 0 }}
                    value={c.tone ?? "muted"}
                    onChange={(e) => setClient(i, "tone", e.target.value as ProjectClientTone)}
                    aria-label="Client tone"
                  >
                    {TONE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="admin-icon-btn"
                    onClick={() => removeClient(i)}
                    title="Remove client"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="admin-section">
            <div className="admin-section-header">
              <h3 className="admin-section-title">Values / Phrases</h3>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => addValue("")}
              >
                + Add Value
              </button>
            </div>
            <div className="admin-repeater">
              {(p.values ?? []).map((v, i) => (
                <div key={i} className="admin-repeater-row">
                  <span
                    className="admin-swatch-dot"
                    style={{
                      background: v.color ?? valueColors[v.text] ?? "var(--muted)",
                      width: "0.9rem",
                      height: "0.9rem",
                    }}
                  />
                  <input
                    className="admin-input"
                    list="admin-value-suggestions"
                    placeholder="Value phrase (e.g. dignity)"
                    value={v.text}
                    onChange={(e) => setValueText(i, e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-icon-btn"
                    onClick={() => removeValue(i)}
                    title="Remove value"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <datalist id="admin-value-suggestions">
              {availableValueNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            {availableValueNames.length > 0 && (
              <div className="admin-quick-chips">
                {availableValueNames.slice(0, 14).map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="admin-quick-chip"
                    onClick={() => addValue(name)}
                    title={`Add "${name}"`}
                  >
                    <span
                      className="admin-swatch-dot"
                      style={{ background: valueColors[name] }}
                    />
                    + {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="admin-section">
            <div className="admin-section-header">
              <h3 className="admin-section-title">Key Features</h3>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={addFeature}
              >
                + Add Feature
              </button>
            </div>
            <div className="admin-repeater">
              {(p.features ?? []).map((f, i) => (
                <div key={i} className="admin-repeater-row">
                  <input
                    className="admin-input"
                    placeholder="Feature or capability…"
                    value={f}
                    onChange={(e) => setFeature(i, e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-icon-btn"
                    onClick={() => removeFeature(i)}
                    title="Remove feature"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="admin-section">
            <div className="admin-section-header">
              <h3 className="admin-section-title">External Links (optional)</h3>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={addExternalLink}
              >
                + Add Link
              </button>
            </div>
            <div className="admin-repeater">
              {(p.externalLinks ?? []).map((link, i) => (
                <div key={i} className="admin-repeater-row">
                  <input
                    className="admin-input"
                    style={{ maxWidth: "13rem" }}
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => setExternalLink(i, "label", e.target.value)}
                  />
                  <input
                    className="admin-input admin-input--mono"
                    placeholder="https://..."
                    value={link.href}
                    onChange={(e) => setExternalLink(i, "href", e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-icon-btn"
                    onClick={() => removeExternalLink(i)}
                    title="Remove link"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Embed & Degree */}
          <div className="admin-section">
            <div className="admin-section-header">
              <h3 className="admin-section-title">Embed & Research Metadata (optional)</h3>
            </div>
            <div className="admin-field-grid">
              <div className="admin-field">
                <label className="admin-label" htmlFor="proj-embed-src">
                  Embed Src URL
                </label>
                <input
                  id="proj-embed-src"
                  className="admin-input admin-input--mono"
                  value={p.embed?.src ?? ""}
                  placeholder="https://..."
                  onChange={(e) => setEmbed("src", e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="proj-embed-title">
                  Embed Title
                </label>
                <input
                  id="proj-embed-title"
                  className="admin-input"
                  value={p.embed?.title ?? ""}
                  onChange={(e) => setEmbed("title", e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="proj-embed-w">
                  Embed Width
                </label>
                <input
                  id="proj-embed-w"
                  type="number"
                  className="admin-input admin-input--mono"
                  value={p.embed?.width ?? ""}
                  onChange={(e) =>
                    setEmbed("width", e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="proj-embed-h">
                  Embed Height
                </label>
                <input
                  id="proj-embed-h"
                  type="number"
                  className="admin-input admin-input--mono"
                  value={p.embed?.height ?? ""}
                  onChange={(e) =>
                    setEmbed("height", e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
              <div className="admin-field admin-field--full">
                <label className="admin-label" htmlFor="proj-degree">
                  Academic Degree (research projects)
                </label>
                <input
                  id="proj-degree"
                  className="admin-input"
                  value={p.degree ?? ""}
                  placeholder="Optional degree attribution"
                  onChange={(e) => set("degree", e.target.value || undefined)}
                />
              </div>
            </div>
          </div>

          {/* Portfolio Suggestions (Admin Only) */}
          <div className="admin-section">
            <div className="admin-section-header">
              <h3 className="admin-section-title">Portfolio Suggestions (Admin Only)</h3>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {(p.needsWork || (p.portfolioSuggestions ?? []).length > 0) && (
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost admin-btn--sm"
                    onClick={markPortfolioReady}
                  >
                    ✓ Mark Ready
                  </button>
                )}
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost admin-btn--sm"
                  onClick={addSuggestion}
                >
                  + Add Suggestion
                </button>
              </div>
            </div>
            <div className="admin-repeater">
              {(p.portfolioSuggestions ?? []).map((s, i) => (
                <div key={i} className="admin-repeater-row" style={{ alignItems: "flex-start" }}>
                  <textarea
                    className="admin-textarea"
                    style={{ minHeight: "3.75rem", fontSize: "0.84rem" }}
                    placeholder="Suggestion for strengthening this portfolio piece…"
                    value={s}
                    onChange={(e) => setSuggestion(i, e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-icon-btn"
                    onClick={() => removeSuggestion(i)}
                    title="Dismiss / remove suggestion"
                    aria-label="Remove suggestion"
                    style={{ marginTop: "0.35rem" }}
                  >
                    ✓
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Front-End Preview Sidebar */}
        <aside className="admin-preview-aside" aria-label="Live card preview and coaching notes">
          {(p.needsWork || (p.portfolioSuggestions ?? []).filter((s) => s.trim()).length > 0) && (
            <div className="admin-coach-box">
              <div className="admin-coach-header">
                <p className="admin-preview-label" style={{ margin: 0, color: "var(--amber)" }}>
                  Needs Work · Coaching
                </p>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost admin-btn--sm"
                  onClick={markPortfolioReady}
                  title="Clear suggestions and mark project portfolio-ready"
                >
                  ✓ Ready
                </button>
              </div>
              {(p.portfolioSuggestions ?? []).filter((s) => s.trim()).length > 0 ? (
                <ul className="admin-coach-list">
                  {(p.portfolioSuggestions ?? []).map((tip, i) =>
                    tip.trim() ? (
                      <li key={i} className="admin-coach-item">
                        <button
                          type="button"
                          className="admin-suggestion-check"
                          onClick={() => removeSuggestion(i)}
                          title="Mark suggestion complete"
                          aria-label={`Mark suggestion complete: ${tip}`}
                        >
                          ✓
                        </button>
                        <span>{tip}</span>
                      </li>
                    ) : null
                  )}
                </ul>
              ) : (
                <p className="admin-stat-meta" style={{ margin: "0.5rem 0 0" }}>
                  All checklist items cleared — click Ready and save.
                </p>
              )}
            </div>
          )}

          <div className="admin-preview-box">
            <p className="admin-preview-label">Live Card Preview</p>
            <div className="admin-preview-art" data-tone={previewTone}>
              <span className="admin-preview-art-section">{p.section ? p.section.toUpperCase() : "PROJECT"}</span>
              <div className="admin-preview-art-bottom">
                <strong>{(p.name || "A").slice(0, 1).toUpperCase()}</strong>
                {p.emoji && (
                  <span className="admin-preview-art-emoji" aria-hidden="true">
                    {p.emoji}
                  </span>
                )}
              </div>
            </div>
            <div className="category-project-meta" style={{ marginBottom: "0.45rem" }}>
              <span>{p.type || "Project Type"}</span>
              <span className="status-text">{p.status}</span>
            </div>
            <h3 style={{ margin: "0 0 0.4rem", fontSize: "1.15rem", fontWeight: 600 }}>
              {p.name || "Untitled Project"}
            </h3>
            <p
              style={{
                margin: "0 0 0.85rem",
                color: "var(--muted)",
                fontSize: "0.85rem",
                lineHeight: 1.45,
              }}
            >
              {p.tagline || p.description || "Card tagline preview will appear here as you type."}
            </p>
            {(p.values ?? []).filter((v) => v.text.trim()).length > 0 && (
              <div className="admin-quick-chips" style={{ marginTop: 0, marginBottom: "0.85rem" }}>
                {(p.values ?? [])
                  .filter((v) => v.text.trim())
                  .map((v, i) => (
                    <span key={i} className="admin-badge">
                      <span
                        className="admin-swatch-dot"
                        style={{ background: v.color ?? valueColors[v.text] ?? "var(--muted)" }}
                      />
                      {v.text}
                    </span>
                  ))}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="category-project-link">View project ↗</span>
              {p.hidden && <span className="admin-badge admin-badge--amber">Hidden</span>}
            </div>
          </div>
          <p className="admin-stat-meta" style={{ marginTop: "0.65rem", paddingLeft: "0.25rem" }}>
            Tip: Press ⌘S / Ctrl+S anytime to save.
          </p>
        </aside>
      </div>
    </div>
  );
}
