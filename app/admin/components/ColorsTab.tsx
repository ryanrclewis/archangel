"use client";

import { useEffect, useMemo, useState } from "react";
import { COLOR_LABELS, HERITAGE_COLORS } from "./types";

type Props = {
  colors: Record<string, string>;
  valueColors: Record<string, string>;
  dirty: boolean;
  onChange: (key: string, val: string) => void;
  onValueColorChange: (key: string, val: string) => void;
  onValueColorAdd: (name: string, hex: string) => void;
  onValueColorRemove: (key: string) => void;
  onReset: () => void;
  onSave: () => void;
};

export function ColorsTab({
  colors,
  valueColors,
  dirty,
  onChange,
  onValueColorChange,
  onValueColorAdd,
  onValueColorRemove,
  onReset,
  onSave,
}: Props) {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [heritageQuery, setHeritageQuery] = useState("");
  const [newValueName, setNewValueName] = useState("");
  const [newValueHex, setNewValueHex] = useState("#005ea8");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onSave]);

  const activeLabel = useMemo(() => {
    if (!activeField) return null;
    const sep = activeField.indexOf(":");
    const kind = activeField.slice(0, sep);
    const key = activeField.slice(sep + 1);
    if (kind === "site") return `${COLOR_LABELS[key] ?? key} (${key})`;
    return `Value: ${key}`;
  }, [activeField]);

  const applyHeritage = (hex: string) => {
    if (!activeField) return;
    const sep = activeField.indexOf(":");
    const kind = activeField.slice(0, sep);
    const key = activeField.slice(sep + 1);
    if (kind === "site") onChange(key, hex);
    else if (kind === "value") onValueColorChange(key, hex);
  };

  const filteredHeritage = useMemo(() => {
    const q = heritageQuery.trim().toLowerCase();
    if (!q) return HERITAGE_COLORS;
    return HERITAGE_COLORS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.sw.toLowerCase().includes(q) ||
        c.hex.toLowerCase().includes(q)
    );
  }, [heritageQuery]);

  const handleAddValue = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newValueName.trim();
    if (!trimmed) return;
    onValueColorAdd(trimmed, newValueHex);
    setNewValueName("");
  };

  const previewStyle = {
    background: colors["--paper"] || "var(--paper)",
    color: colors["--ink"] || "var(--ink)",
    borderColor: colors["--hairline"] || "var(--hairline)",
  } as React.CSSProperties;

  return (
    <div>
      <div className="admin-panel-header">
        <div>
          <h2>Colors & Heritage Palette</h2>
          <p>
            Tune the core light-mode palette and value accent colors. Click any swatch card, then pick a Heritage color to apply it.
          </p>
        </div>
        <div className="admin-panel-actions">
          {dirty && (
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onReset}>
              Revert
            </button>
          )}
          <button type="button" className="admin-btn admin-btn--primary" onClick={onSave}>
            {dirty ? "Save Colors *" : "Save Colors"}
          </button>
        </div>
      </div>

      {/* Live Front-End Palette Preview */}
      <div className="admin-palette-preview" style={previewStyle}>
        <div>
          <p
            style={{
              margin: "0 0 0.35rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: colors["--muted"] || "var(--muted)",
            }}
          >
            Live Front-End Preview
          </p>
          <h3
            style={{
              margin: "0 0 0.45rem",
              fontFamily: "var(--font-serif)",
              fontSize: "1.65rem",
              fontWeight: 500,
              color: colors["--ink"] || "var(--ink)",
            }}
          >
            Technology in service of{" "}
            <span style={{ color: colors["--blue"] || "var(--blue)" }}>human flourishing.</span>
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "0.88rem",
              lineHeight: 1.45,
              color: colors["--muted"] || "var(--muted)",
            }}
          >
            Check contrast between Paper, Ink, Muted, Hairline, and accent tones before saving.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "0.75rem",
            padding: "0.95rem 1.05rem",
            borderRadius: "0.85rem",
            background: colors["--paper-warm"] || "var(--paper-warm)",
            border: `1px solid ${colors["--hairline"] || "var(--hairline)"}`,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            <span
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "999px",
                background: colors["--ink"] || "var(--ink)",
                color: colors["--paper"] || "var(--paper)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Primary
            </span>
            <span
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "999px",
                background: colors["--blue"] || "var(--blue)",
                color: colors["--white"] || "#fff",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Blue
            </span>
            <span
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "999px",
                background: colors["--red"] || "var(--red)",
                color: colors["--white"] || "#fff",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Red
            </span>
            <span
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "999px",
                background: colors["--green"] || "var(--green)",
                color: colors["--white"] || "#fff",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Green
            </span>
            <span
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "999px",
                background: colors["--amber"] || "var(--amber)",
                color: colors["--white"] || "#fff",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Amber
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: colors["--blue-dark"] || "var(--blue-dark)",
            }}
          >
            Paper Warm surface · Blue Dark link accent ↗
          </span>
        </div>
      </div>

      {/* Site Palette */}
      <div className="admin-section" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}>
        <div className="admin-section-header">
          <h3 className="admin-section-title">Site Palette (CSS Variables)</h3>
        </div>
        <div className="admin-swatch-grid">
          {Object.entries(COLOR_LABELS).map(([varName, label]) => {
            const val = colors[varName] ?? "";
            const key = `site:${varName}`;
            const isSelected = activeField === key;
            return (
              <div
                key={varName}
                className={`admin-swatch-card ${isSelected ? "is-active" : ""}`}
                onClick={() => setActiveField(key)}
              >
                <div className="admin-label">
                  <span>{label}</span>
                  <span className="admin-label-hint">{varName}</span>
                </div>
                <div className="admin-swatch-controls">
                  <input
                    type="color"
                    className="admin-color-picker"
                    value={val.startsWith("#") ? val : "#000000"}
                    onFocus={() => setActiveField(key)}
                    onChange={(e) => onChange(varName, e.target.value)}
                    aria-label={`${label} color picker`}
                  />
                  <input
                    type="text"
                    className="admin-input admin-input--mono"
                    value={val}
                    onFocus={() => setActiveField(key)}
                    onChange={(e) => onChange(varName, e.target.value)}
                    aria-label={`${label} hex value`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Value Colors */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h3 className="admin-section-title">
            Value & Phrase Colors ({Object.keys(valueColors).length})
          </h3>
        </div>
        <div className="admin-swatch-grid">
          {Object.entries(valueColors).map(([name, hex]) => {
            const key = `value:${name}`;
            const isSelected = activeField === key;
            return (
              <div
                key={name}
                className={`admin-swatch-card ${isSelected ? "is-active" : ""}`}
                onClick={() => setActiveField(key)}
              >
                <div className="admin-label">
                  <span style={{ color: "var(--ink)" }}>{name}</span>
                  <button
                    type="button"
                    className="admin-icon-btn"
                    style={{ width: 22, height: 22, fontSize: "0.72rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onValueColorRemove(name);
                    }}
                    title={`Remove ${name}`}
                    aria-label={`Remove ${name}`}
                  >
                    ×
                  </button>
                </div>
                <div className="admin-swatch-controls">
                  <input
                    type="color"
                    className="admin-color-picker"
                    value={hex.startsWith("#") ? hex : "#888888"}
                    onFocus={() => setActiveField(key)}
                    onChange={(e) => onValueColorChange(name, e.target.value)}
                    aria-label={`${name} color picker`}
                  />
                  <input
                    type="text"
                    className="admin-input admin-input--mono"
                    value={hex}
                    onFocus={() => setActiveField(key)}
                    onChange={(e) => onValueColorChange(name, e.target.value)}
                    aria-label={`${name} hex value`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <form className="admin-inline-add" onSubmit={handleAddValue}>
          <input
            type="color"
            className="admin-color-picker"
            style={{ width: "2.15rem", height: "2.15rem" }}
            value={newValueHex}
            onChange={(e) => setNewValueHex(e.target.value)}
            aria-label="New value color"
          />
          <input
            type="text"
            className="admin-input"
            style={{ maxWidth: "16rem" }}
            placeholder='Add value color (e.g. "justice")'
            value={newValueName}
            onChange={(e) => setNewValueName(e.target.value)}
          />
          <button
            type="submit"
            className="admin-btn admin-btn--ghost admin-btn--sm"
            disabled={!newValueName.trim()}
          >
            + Add Value Color
          </button>
        </form>
      </div>

      {/* Heritage Colors */}
      <div className="admin-section">
        <div className="admin-section-header">
          <div>
            <h3 className="admin-section-title">Heritage Colors · 1820–1920</h3>
            <p className="admin-stat-meta" style={{ margin: "0.25rem 0 0" }}>
              {activeLabel ? (
                <>
                  Applying clicks to <strong style={{ color: "var(--ink)" }}>{activeLabel}</strong>
                </>
              ) : (
                "Select any color card above first, then click a Heritage swatch to apply it."
              )}
            </p>
          </div>
          <div className="admin-search-wrap" style={{ maxWidth: "15rem" }}>
            <input
              type="search"
              className="admin-search"
              placeholder="Filter Heritage swatches…"
              value={heritageQuery}
              onChange={(e) => setHeritageQuery(e.target.value)}
              aria-label="Filter Heritage swatches"
            />
          </div>
        </div>

        <div className="admin-heritage-grid">
          {filteredHeritage.map((c) => (
            <button
              key={c.sw}
              type="button"
              className="admin-heritage-swatch"
              disabled={!activeField}
              onClick={() => applyHeritage(c.hex)}
              title={`${c.name} · SW ${c.sw} · ${c.hex}`}
            >
              <span className="admin-heritage-chip" style={{ background: c.hex }} />
              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {c.name}
                </span>
                <span className="admin-stat-meta">SW {c.sw}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
