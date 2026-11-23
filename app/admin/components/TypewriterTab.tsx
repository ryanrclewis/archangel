"use client";

import { useEffect, useMemo, useState } from "react";
import { getPhraseAccentVars } from "@/app/utils/phraseStyles";
import type { TypewriterPhrase } from "./types";

type Props = {
  phrases: TypewriterPhrase[];
  valueColors: Record<string, string>;
  activeThemeName: string | null;
  activeThemePhrases: string[] | null;
  dirty: boolean;
  onChange: (phrases: TypewriterPhrase[]) => void;
  onValueColorChange: (key: string, val: string) => void;
  onSaveAll: () => void;
  onReset: () => void;
  onOpenThemes: () => void;
};

export function TypewriterTab({
  phrases,
  valueColors,
  activeThemeName,
  activeThemePhrases,
  dirty,
  onChange,
  onValueColorChange,
  onSaveAll,
  onReset,
  onOpenThemes,
}: Props) {
  const [filter, setFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [query, setQuery] = useState("");
  const [previewIdx, setPreviewIdx] = useState(0);

  const enabledPhrases = useMemo(
    () => phrases.filter((p) => p.enabled !== false && p.text.trim()),
    [phrases]
  );

  const livePreviewList = useMemo(() => {
    if (activeThemePhrases && activeThemePhrases.length > 0) {
      return activeThemePhrases.map((text) => ({ text }));
    }
    return enabledPhrases;
  }, [activeThemePhrases, enabledPhrases]);

  useEffect(() => {
    if (livePreviewList.length <= 1) return;
    const timer = window.setInterval(() => {
      setPreviewIdx((i) => (i + 1) % livePreviewList.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, [livePreviewList.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSaveAll();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onSaveAll]);

  const setPhrase = (i: number, key: keyof TypewriterPhrase, val: string | boolean) => {
    const next = [...phrases];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };

  const addPhrase = () => onChange([...phrases, { text: "", link: "", enabled: true }]);
  const removePhrase = (i: number) => onChange(phrases.filter((_, idx) => idx !== i));
  const movePhrase = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= phrases.length) return;
    const next = [...phrases];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const indexed = useMemo(() => {
    const q = query.trim().toLowerCase();
    return phrases
      .map((phrase, idx) => ({ phrase, idx }))
      .filter(({ phrase }) => {
        const isEnabled = phrase.enabled !== false;
        if (filter === "enabled" && !isEnabled) return false;
        if (filter === "disabled" && isEnabled) return false;
        if (!q) return true;
        return (
          phrase.text.toLowerCase().includes(q) ||
          (phrase.link ?? "").toLowerCase().includes(q)
        );
      });
  }, [phrases, filter, query]);

  const activePreview =
    livePreviewList.length > 0
      ? livePreviewList[previewIdx % livePreviewList.length]
      : phrases[0];
  const previewText = activePreview?.text || "magnificent humanity.";
  const previewKey = previewText.replace(/[.,!?;:]+$/, "");
  const previewAccentVars = getPhraseAccentVars(previewText, valueColors[previewKey]);

  return (
    <div>
      <div className="admin-panel-header">
        <div>
          <h2>Typewriter Phrases</h2>
          <p>
            Manage the rotating hero headline phrases, their accent colors, and reference links.
          </p>
        </div>
        <div className="admin-panel-actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={addPhrase}>
            + Add Phrase
          </button>
          {dirty && (
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onReset}>
              Revert
            </button>
          )}
          <button type="button" className="admin-btn admin-btn--primary" onClick={onSaveAll}>
            {dirty ? "Save Phrases *" : "Save Phrases"}
          </button>
        </div>
      </div>

      {/* Live Headline Stage */}
      <div className="admin-typewriter-stage">
        <span className="admin-stat-label">
          Homepage Hero Preview ·{" "}
          {activeThemeName
            ? `${activeThemeName} theme (${livePreviewList.length} phrases)`
            : `${enabledPhrases.length} enabled`}
        </span>
        <p className="admin-typewriter-headline">
          Technology in service of{" "}
          <span className="typewriter-link" style={previewAccentVars}>
            {previewText}
          </span>
        </p>
      </div>

      {activeThemeName && (
        <div className="admin-notice">
          <span>
            Active theme <strong>{activeThemeName}</strong> controls which phrases cycle on the homepage.
          </span>
          <button
            type="button"
            className="admin-btn admin-btn--ghost admin-btn--sm"
            onClick={onOpenThemes}
          >
            Manage in Themes →
          </button>
        </div>
      )}

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <input
            type="search"
            className="admin-search"
            placeholder="Search phrases or links…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search typewriter phrases"
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

        <div className="admin-filter-pills">
          <button
            type="button"
            className={`admin-pill ${filter === "all" ? "is-active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({phrases.length})
          </button>
          <button
            type="button"
            className={`admin-pill ${filter === "enabled" ? "is-active" : ""}`}
            onClick={() => setFilter("enabled")}
          >
            Enabled ({enabledPhrases.length})
          </button>
          <button
            type="button"
            className={`admin-pill ${filter === "disabled" ? "is-active" : ""}`}
            onClick={() => setFilter("disabled")}
          >
            Disabled ({phrases.length - enabledPhrases.length})
          </button>
        </div>
      </div>

      <div className="admin-repeater">
        {indexed.map(({ phrase: p, idx }) => {
          const lookupKey = p.text.replace(/[.,!?;:]+$/, "");
          const colorVal = valueColors[lookupKey] ?? "#888888";
          const isEnabled = p.enabled !== false;
          const canReorder = filter === "all" && !query.trim();

          return (
            <div
              key={idx}
              className={`admin-phrase-row ${!isEnabled ? "is-disabled" : ""}`}
            >
              <input
                type="color"
                className="admin-color-picker"
                style={{ width: "2.2rem", height: "2.2rem" }}
                value={colorVal.startsWith("#") ? colorVal : "#888888"}
                title={`Color for "${lookupKey || "phrase"}"`}
                onChange={(e) => {
                  if (lookupKey) onValueColorChange(lookupKey, e.target.value);
                }}
              />
              <input
                className="admin-input"
                placeholder="Phrase text (e.g. faith.)"
                value={p.text}
                onChange={(e) => setPhrase(idx, "text", e.target.value)}
              />
              <input
                className="admin-input admin-input--mono"
                placeholder="Reference link URL (optional)"
                value={p.link ?? ""}
                onChange={(e) => setPhrase(idx, "link", e.target.value)}
              />
              <div className="admin-phrase-controls">
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-icon-btn"
                    title="Open reference link"
                  >
                    ↗
                  </a>
                )}
                <button
                  type="button"
                  className={`admin-pill ${isEnabled ? "is-active" : ""}`}
                  style={{ minHeight: 30, padding: "0.2rem 0.65rem" }}
                  onClick={() => setPhrase(idx, "enabled", !isEnabled)}
                  title={isEnabled ? "Disable phrase" : "Enable phrase"}
                >
                  {isEnabled ? "On" : "Off"}
                </button>
                {canReorder && (
                  <>
                    <button
                      type="button"
                      className="admin-icon-btn"
                      disabled={idx === 0}
                      onClick={() => movePhrase(idx, -1)}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn"
                      disabled={idx === phrases.length - 1}
                      onClick={() => movePhrase(idx, 1)}
                      title="Move down"
                    >
                      ↓
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="admin-icon-btn"
                  onClick={() => removePhrase(idx)}
                  title="Remove phrase"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
