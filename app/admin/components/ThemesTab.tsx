"use client";

import { useMemo, useState } from "react";
import { slugify, type Theme, type TypewriterPhrase } from "./types";

type Props = {
  themes: Theme[];
  activeThemeId: string | null;
  allPhrases: TypewriterPhrase[];
  valueColors: Record<string, string>;
  images: string[];
  onApply: (id: string) => Promise<void>;
  onSaveTheme: (theme: Theme) => Promise<void>;
  onDeleteTheme: (id: string) => Promise<void>;
};

export function ThemesTab({
  themes,
  activeThemeId,
  allPhrases,
  valueColors,
  images,
  onApply,
  onSaveTheme,
  onDeleteTheme,
}: Props) {
  const [editing, setEditing] = useState<Theme | null>(null);
  const [newName, setNewName] = useState("");
  const [phraseSearch, setPhraseSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const uniquePhraseTexts = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const p of allPhrases) {
      if (p.text && !seen.has(p.text)) {
        seen.add(p.text);
        list.push(p.text);
      }
    }
    return list;
  }, [allPhrases]);

  const filteredPhrases = useMemo(() => {
    const q = phraseSearch.trim().toLowerCase();
    if (!q) return uniquePhraseTexts;
    return uniquePhraseTexts.filter((text) => text.toLowerCase().includes(q));
  }, [uniquePhraseTexts, phraseSearch]);

  const createNew = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    const id = slugify(trimmed);
    if (!id) return;
    setEditing({
      id,
      name: trimmed,
      backgroundImage: images[0] ?? "",
      enabledPhrases: [],
    });
    setNewName("");
  };

  const duplicateTheme = (theme: Theme) => {
    const copyName = `${theme.name} Copy`;
    setEditing({
      ...theme,
      id: slugify(`${theme.id}-copy-${Date.now().toString().slice(-3)}`),
      name: copyName,
      enabledPhrases: [...theme.enabledPhrases],
    });
  };

  if (editing) {
    return (
      <div>
        <div className="admin-editor-bar">
          <div className="admin-editor-bar-left">
            <button
              type="button"
              className="admin-btn admin-btn--ghost admin-btn--sm"
              onClick={() => setEditing(null)}
            >
              ← Back
            </button>
            <h2>Editing: {editing.name || "Untitled Theme"}</h2>
          </div>
          <div className="admin-panel-actions">
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={async () => {
                await onSaveTheme(editing);
                setEditing(null);
              }}
            >
              Save Theme
            </button>
          </div>
        </div>

        <div className="admin-field-grid">
          <div className="admin-field">
            <label className="admin-label" htmlFor="theme-name">
              Theme Name
            </label>
            <input
              id="theme-name"
              className="admin-input"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="theme-id">
              Theme ID
            </label>
            <input
              id="theme-id"
              className="admin-input admin-input--mono"
              value={editing.id}
              onChange={(e) => setEditing({ ...editing, id: slugify(e.target.value) })}
            />
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h3 className="admin-section-title">Background Artwork</h3>
            <span className="admin-stat-meta">Selected: {editing.backgroundImage || "None"}</span>
          </div>
          <div className="admin-image-grid">
            {images.map((img) => {
              const active = img === editing.backgroundImage;
              return (
                <button
                  key={img}
                  type="button"
                  className={`admin-image-card ${active ? "is-active" : ""}`}
                  onClick={() => setEditing({ ...editing, backgroundImage: img })}
                >
                  <img src={`/${img}`} alt={img} />
                  <span className="admin-image-caption">
                    {active ? "✓ " : ""}
                    {img}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <div>
              <h3 className="admin-section-title">
                Included Typewriter Phrases ({editing.enabledPhrases.length} of {uniquePhraseTexts.length})
              </h3>
            </div>
            <div className="admin-panel-actions">
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => setEditing({ ...editing, enabledPhrases: [...uniquePhraseTexts] })}
              >
                Select all
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => setEditing({ ...editing, enabledPhrases: [] })}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="admin-toolbar">
            <div className="admin-search-wrap">
              <input
                type="search"
                className="admin-search"
                placeholder="Filter phrases…"
                value={phraseSearch}
                onChange={(e) => setPhraseSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-phrase-picker">
            {filteredPhrases.map((text) => {
              const on = editing.enabledPhrases.includes(text);
              const lookupKey = text.replace(/[.,!?;:]+$/, "");
              const dotColor = valueColors[lookupKey] ?? "var(--muted)";
              return (
                <label
                  key={text}
                  className="admin-check-pill"
                  style={{
                    justifyContent: "flex-start",
                    opacity: on ? 1 : 0.65,
                    borderColor: on ? "var(--ink)" : "var(--hairline)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        enabledPhrases: e.target.checked
                          ? [...editing.enabledPhrases, text]
                          : editing.enabledPhrases.filter((x) => x !== text),
                      })
                    }
                  />
                  <span className="admin-swatch-dot" style={{ background: dotColor }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{text}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-panel-header">
        <div>
          <h2>Seasonal & Editorial Themes</h2>
          <p>
            Bundle a background painting and curated set of typewriter phrases so you can switch the site&apos;s look in one click.
          </p>
        </div>
      </div>

      <div className="admin-theme-grid">
        {themes.map((t) => {
          const isActive = t.id === activeThemeId;
          const isConfirming = confirmDeleteId === t.id;
          return (
            <div key={t.id} className={`admin-theme-card ${isActive ? "is-active" : ""}`}>
              <div className="admin-theme-thumb">
                {t.backgroundImage && <img src={`/${t.backgroundImage}`} alt={t.name} />}
                {isActive && <span className="admin-theme-thumb-badge">✓ Active Theme</span>}
              </div>
              <div className="admin-theme-body">
                <div>
                  <h3>{t.name}</h3>
                  <p className="admin-theme-meta">
                    {t.enabledPhrases.length} phrases · {t.backgroundImage || "no image"}
                  </p>
                </div>

                {t.enabledPhrases.length > 0 && (
                  <div className="admin-quick-chips" style={{ marginTop: 0 }}>
                    {t.enabledPhrases.slice(0, 6).map((phrase) => {
                      const key = phrase.replace(/[.,!?;:]+$/, "");
                      return (
                        <span key={phrase} className="admin-badge">
                          <span
                            className="admin-swatch-dot"
                            style={{ background: valueColors[key] ?? "var(--muted)" }}
                          />
                          {phrase}
                        </span>
                      );
                    })}
                    {t.enabledPhrases.length > 6 && (
                      <span className="admin-badge">+{t.enabledPhrases.length - 6} more</span>
                    )}
                  </div>
                )}

                <div className="admin-theme-footer">
                  {!isActive ? (
                    <button
                      type="button"
                      className="admin-btn admin-btn--primary admin-btn--sm"
                      onClick={() => onApply(t.id)}
                    >
                      Apply Theme
                    </button>
                  ) : (
                    <span className="admin-badge admin-badge--green">Live on site</span>
                  )}

                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost admin-btn--sm"
                    onClick={() => setEditing(t)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost admin-btn--sm"
                    onClick={() => duplicateTheme(t)}
                  >
                    Copy
                  </button>

                  {isConfirming ? (
                    <>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger admin-btn--sm"
                        onClick={async () => {
                          setConfirmDeleteId(null);
                          await onDeleteTheme(t.id);
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
                      onClick={() => setConfirmDeleteId(t.id)}
                      style={{ marginLeft: "auto" }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form className="admin-inline-add" onSubmit={createNew}>
        <input
          className="admin-input"
          style={{ maxWidth: "18rem" }}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New theme name (e.g. Advent)…"
        />
        <button
          type="submit"
          className="admin-btn admin-btn--primary admin-btn--sm"
          disabled={!newName.trim()}
        >
          + Create Theme
        </button>
      </form>
    </div>
  );
}
