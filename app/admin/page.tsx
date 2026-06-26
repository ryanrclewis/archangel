"use client";

import { useEffect, useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

type TypewriterPhrase = { text: string; link?: string; enabled?: boolean };

type ProjectStatus = "LIVE" | "IN PROGRESS" | "COMPLETED";
type ProjectClientTone = "ink" | "muted" | "blue" | "green" | "amber" | "red" | "purple";

type ProjectClient = { name: string; tone?: ProjectClientTone };
type ProjectValue = { text: string; color?: string; tone?: ProjectClientTone };
type ProjectEmbed = { src: string; title?: string; width?: number; height?: number };

type Project = {
  id: string;
  name: string;
  type: string;
  status: ProjectStatus;
  description: string;
  url?: string;
  clients?: ProjectClient[];
  values?: ProjectValue[];
  features?: string[];
  launchDate?: string;
  embed?: ProjectEmbed;
};

// ── Color labels ───────────────────────────────────────────────────────────

const COLOR_LABELS: Record<string, string> = {
  "--paper": "Paper",
  "--paper-warm": "Paper Warm",
  "--ink": "Ink",
  "--muted": "Muted",
  "--hairline": "Hairline",
  "--blue": "Blue",
  "--blue-dark": "Blue Dark",
  "--red": "Red",
  "--green": "Green",
  "--amber": "Amber",
  "--white": "White",
};

const STATUS_OPTIONS: ProjectStatus[] = ["LIVE", "IN PROGRESS", "COMPLETED"];
const TONE_OPTIONS: ProjectClientTone[] = ["ink", "muted", "blue", "green", "amber", "red", "purple"];

// ── Helpers ────────────────────────────────────────────────────────────────

function makeEmptyProject(): Project {
  return {
    id: "",
    name: "",
    type: "",
    status: "IN PROGRESS",
    description: "",
    url: "",
    clients: [],
    values: [],
    features: [],
    launchDate: "",
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SaveBanner({ saved }: { saved: boolean }) {
  if (!saved) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        background: "var(--ink)",
        color: "var(--paper)",
        padding: "8px 16px",
        fontSize: 13,
        fontFamily: "var(--font-mono)",
        zIndex: 9999,
        borderRadius: 4,
      }}
    >
      Saved
    </div>
  );
}

function ColorSwatch({
  label,
  sublabel,
  value,
  onChange,
}: {
  label: string;
  sublabel?: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          color: "var(--muted)",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
        {sublabel && <span style={{ display: "block", opacity: 0.6, fontSize: 10 }}>{sublabel}</span>}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="color"
          value={value.startsWith("#") ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 44, height: 44, border: "1px solid var(--hairline)", cursor: "pointer", borderRadius: 4 }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      </div>
    </div>
  );
}

function ColorEditor({
  colors,
  onChange,
  onSave,
  valueColors,
  onValueColorChange,
  onValueColorAdd,
  onValueColorRemove,
}: {
  colors: Record<string, string>;
  onChange: (key: string, val: string) => void;
  onSave: () => void;
  valueColors: Record<string, string>;
  onValueColorChange: (key: string, val: string) => void;
  onValueColorAdd: () => void;
  onValueColorRemove: (key: string) => void;
}) {
  return (
    <div>
      {/* Site palette */}
      <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
        Site Palette
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}
      >
        {Object.entries(COLOR_LABELS).map(([varName, label]) => (
          <ColorSwatch
            key={varName}
            label={label}
            sublabel={varName}
            value={colors[varName] ?? ""}
            onChange={(val) => onChange(varName, val)}
          />
        ))}
      </div>

      {/* Value colors */}
      <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 28, marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
          Value Colors
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
            marginBottom: 16,
          }}
        >
          {Object.entries(valueColors).map(([name, hex]) => (
            <div key={name} style={{ position: "relative" }}>
              <button
                onClick={() => onValueColorRemove(name)}
                title="Remove"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted)",
                  fontSize: 14,
                  lineHeight: 1,
                  padding: "0 2px",
                }}
              >
                ×
              </button>
              <ColorSwatch
                label={name}
                value={hex}
                onChange={(val) => onValueColorChange(name, val)}
              />
            </div>
          ))}
        </div>
        <button onClick={onValueColorAdd} style={{ ...addBtnStyle, marginBottom: 0 }}>+ New Value</button>
      </div>

      <button onClick={onSave} style={btnStyle}>Save Colors</button>
    </div>
  );
}

function ProjectList({
  projects,
  onSelect,
  onNew,
  onDelete,
}: {
  projects: Project[];
  onSelect: (p: Project) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button onClick={onNew} style={btnStyle}>
          + New Project
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {projects.map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              border: "1px solid var(--hairline)",
              borderRadius: 4,
              cursor: "pointer",
              background: "var(--paper)",
            }}
          >
            <div
              style={{ flex: 1, cursor: "pointer" }}
              onClick={() => onSelect(p)}
            >
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600 }}>{p.name || "(untitled)"}</span>
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "var(--muted)",
                  textTransform: "uppercase",
                }}
              >
                {p.status}
              </span>
              <span style={{ marginLeft: 10, fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                {p.type}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete "${p.name}"?`)) onDelete(p.id);
              }}
              style={{ ...btnStyle, background: "none", color: "var(--muted)", border: "1px solid var(--hairline)", padding: "4px 10px", fontSize: 12 }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectEditor({
  project,
  onSave,
  onCancel,
}: {
  project: Project;
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const [p, setP] = useState<Project>({ ...project });

  const set = (key: keyof Project, val: unknown) =>
    setP((prev) => ({ ...prev, [key]: val }));

  // Clients helpers
  const setClient = (i: number, key: keyof ProjectClient, val: string) =>
    setP((prev) => {
      const clients = [...(prev.clients ?? [])];
      clients[i] = { ...clients[i], [key]: val };
      return { ...prev, clients };
    });
  const addClient = () => setP((prev) => ({ ...prev, clients: [...(prev.clients ?? []), { name: "", tone: "muted" }] }));
  const removeClient = (i: number) =>
    setP((prev) => ({ ...prev, clients: (prev.clients ?? []).filter((_, idx) => idx !== i) }));

  // Values helpers
  const setValueText = (i: number, val: string) =>
    setP((prev) => {
      const values = [...(prev.values ?? [])];
      values[i] = { ...values[i], text: val };
      return { ...prev, values };
    });
  const addValue = () => setP((prev) => ({ ...prev, values: [...(prev.values ?? []), { text: "" }] }));
  const removeValue = (i: number) =>
    setP((prev) => ({ ...prev, values: (prev.values ?? []).filter((_, idx) => idx !== i) }));

  // Features helpers
  const setFeature = (i: number, val: string) =>
    setP((prev) => {
      const features = [...(prev.features ?? [])];
      features[i] = val;
      return { ...prev, features };
    });
  const addFeature = () => setP((prev) => ({ ...prev, features: [...(prev.features ?? []), ""] }));
  const removeFeature = (i: number) =>
    setP((prev) => ({ ...prev, features: (prev.features ?? []).filter((_, idx) => idx !== i) }));

  // Embed helpers
  const setEmbed = (key: keyof ProjectEmbed, val: string | number) =>
    setP((prev) => ({ ...prev, embed: { ...(prev.embed ?? { src: "" }), [key]: val } }));

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center" }}>
        <button onClick={onCancel} style={{ ...btnStyle, background: "none", border: "1px solid var(--hairline)", color: "var(--ink)" }}>
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{p.name || "New Project"}</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Field label="ID (slug)" hint="url-safe, no spaces">
          <input style={inputStyle} value={p.id} onChange={(e) => set("id", e.target.value)} />
        </Field>
        <Field label="Name">
          <input style={inputStyle} value={p.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Type">
          <input style={inputStyle} value={p.type} onChange={(e) => set("type", e.target.value)} />
        </Field>
        <Field label="Status">
          <select style={inputStyle} value={p.status} onChange={(e) => set("status", e.target.value as ProjectStatus)}>
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="URL">
          <input style={inputStyle} value={p.url ?? ""} onChange={(e) => set("url", e.target.value)} />
        </Field>
        <Field label="Launch Date">
          <input style={inputStyle} value={p.launchDate ?? ""} onChange={(e) => set("launchDate", e.target.value)} />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
          value={p.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      {/* Clients */}
      <Section label="Clients">
        {(p.clients ?? []).map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="Name"
              value={c.name}
              onChange={(e) => setClient(i, "name", e.target.value)}
            />
            <select
              style={{ ...inputStyle, width: 110 }}
              value={c.tone ?? "muted"}
              onChange={(e) => setClient(i, "tone", e.target.value as ProjectClientTone)}
            >
              {TONE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
            </select>
            <button onClick={() => removeClient(i)} style={removeBtnStyle}>×</button>
          </div>
        ))}
        <button onClick={addClient} style={addBtnStyle}>+ Client</button>
      </Section>

      {/* Values */}
      <Section label="Values">
        {(p.values ?? []).map((v, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="Value text"
              value={v.text}
              onChange={(e) => setValueText(i, e.target.value)}
            />
            <button onClick={() => removeValue(i)} style={removeBtnStyle}>×</button>
          </div>
        ))}
        <button onClick={addValue} style={addBtnStyle}>+ Value</button>
      </Section>

      {/* Features */}
      <Section label="Features">
        {(p.features ?? []).map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={f}
              onChange={(e) => setFeature(i, e.target.value)}
            />
            <button onClick={() => removeFeature(i)} style={removeBtnStyle}>×</button>
          </div>
        ))}
        <button onClick={addFeature} style={addBtnStyle}>+ Feature</button>
      </Section>

      {/* Embed */}
      <Section label="Embed (optional)">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Field label="Src URL">
            <input style={inputStyle} value={p.embed?.src ?? ""} onChange={(e) => setEmbed("src", e.target.value)} />
          </Field>
          <Field label="Title">
            <input style={inputStyle} value={p.embed?.title ?? ""} onChange={(e) => setEmbed("title", e.target.value)} />
          </Field>
          <Field label="Width">
            <input
              style={inputStyle}
              type="number"
              value={p.embed?.width ?? ""}
              onChange={(e) => setEmbed("width", Number(e.target.value))}
            />
          </Field>
          <Field label="Height">
            <input
              style={inputStyle}
              type="number"
              value={p.embed?.height ?? ""}
              onChange={(e) => setEmbed("height", Number(e.target.value))}
            />
          </Field>
        </div>
      </Section>

      <div style={{ marginTop: 24 }}>
        <button onClick={() => onSave(p)} style={btnStyle}>
          Save Project
        </button>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
        {hint && <span style={{ opacity: 0.6, marginLeft: 6 }}>({hint})</span>}
      </label>
      {children}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          color: "var(--muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 8,
          paddingBottom: 4,
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function TypewriterEditor({
  phrases,
  valueColors,
  onChange,
  onValueColorChange,
  onSaveAll,
}: {
  phrases: TypewriterPhrase[];
  valueColors: Record<string, string>;
  onChange: (phrases: TypewriterPhrase[]) => void;
  onValueColorChange: (key: string, val: string) => void;
  onSaveAll: () => void;
}) {
  const setPhrase = (i: number, key: keyof TypewriterPhrase, val: string | boolean) => {
    const next = [...phrases];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };

  const addPhrase = () => onChange([...phrases, { text: "", link: "", enabled: true }]);
  const removePhrase = (i: number) => onChange(phrases.filter((_, idx) => idx !== i));
  const movePhrase = (i: number, dir: -1 | 1) => {
    const next = [...phrases];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "38px 1fr 1fr 32px auto auto auto",
          gap: 8,
          alignItems: "center",
          padding: "0 12px 8px",
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          color: "var(--muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        <div>Color</div>
        <div>Text</div>
        <div>Link</div>
        <div title="Show in typewriter">On</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
        {phrases.map((p, i) => {
          const lookupKey = p.text.replace(/[.,!?;:]+$/, "");
          const colorVal = valueColors[lookupKey] ?? "#888888";
          const isEnabled = p.enabled !== false;
          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "38px 1fr 1fr 32px auto auto auto",
                gap: 8,
                alignItems: "center",
                padding: "8px 12px",
                border: "1px solid var(--hairline)",
                borderRadius: 4,
                background: isEnabled ? "var(--paper)" : "var(--paper-warm)",
                opacity: isEnabled ? 1 : 0.6,
              }}
            >
              <input
                type="color"
                value={colorVal.startsWith("#") ? colorVal : "#888888"}
                title={`Color for "${lookupKey}"`}
                onChange={(e) => onValueColorChange(lookupKey, e.target.value)}
                style={{ width: 32, height: 32, border: "1px solid var(--hairline)", cursor: "pointer", borderRadius: 3, padding: 1 }}
              />
              <input
                style={inputStyle}
                placeholder="Text (e.g. faith.)"
                value={p.text}
                onChange={(e) => setPhrase(i, "text", e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Link URL (optional)"
                value={p.link ?? ""}
                onChange={(e) => setPhrase(i, "link", e.target.value)}
              />
              <input
                type="checkbox"
                checked={isEnabled}
                title={isEnabled ? "Remove from typewriter" : "Add to typewriter"}
                onChange={(e) => setPhrase(i, "enabled", e.target.checked)}
                style={{ width: 18, height: 18, cursor: "pointer", accentColor: "var(--ink)", justifySelf: "center" }}
              />
              <button onClick={() => movePhrase(i, -1)} style={iconBtnStyle} title="Move up">↑</button>
              <button onClick={() => movePhrase(i, 1)} style={iconBtnStyle} title="Move down">↓</button>
              <button onClick={() => removePhrase(i)} style={{ ...iconBtnStyle, color: "var(--muted)" }} title="Remove">×</button>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={addPhrase} style={addBtnStyle}>+ Phrase</button>
        <button onClick={onSaveAll} style={btnStyle}>Save All</button>
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  border: "1px solid var(--hairline)",
  borderRadius: 4,
  fontSize: 13,
  fontFamily: "var(--font-mono)",
  background: "var(--paper)",
  color: "var(--ink)",
  boxSizing: "border-box",
};

const btnStyle: React.CSSProperties = {
  padding: "8px 18px",
  background: "var(--ink)",
  color: "var(--paper)",
  border: "none",
  borderRadius: 4,
  fontSize: 13,
  fontFamily: "var(--font-mono)",
  cursor: "pointer",
};

const addBtnStyle: React.CSSProperties = {
  ...btnStyle,
  background: "none",
  color: "var(--blue)",
  border: "1px dashed var(--blue)",
  padding: "4px 12px",
  fontSize: 12,
};

const removeBtnStyle: React.CSSProperties = {
  padding: "6px 10px",
  background: "none",
  border: "1px solid var(--hairline)",
  borderRadius: 4,
  cursor: "pointer",
  color: "var(--muted)",
  fontSize: 14,
};

const iconBtnStyle: React.CSSProperties = {
  padding: "5px 9px",
  background: "none",
  border: "1px solid var(--hairline)",
  borderRadius: 4,
  cursor: "pointer",
  color: "var(--ink)",
  fontSize: 14,
  fontFamily: "var(--font-mono)",
};

// ── Themes Editor ─────────────────────────────────────────────────────────

type Theme = {
  id: string;
  name: string;
  backgroundImage: string;
  enabledPhrases: string[];
};

function ThemesEditor({ onSave }: { onSave: () => void }) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [allPhrases, setAllPhrases] = useState<TypewriterPhrase[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [editing, setEditing] = useState<Theme | null>(null);

  useEffect(() => {
    fetch("/api/admin/themes").then((r) => r.json()).then((d) => {
      setThemes(d.themes ?? []);
      setActiveTheme(d.activeTheme ?? null);
    });
    fetch("/api/admin/typewriter-phrases").then((r) => r.json()).then(setAllPhrases);
    fetch("/api/admin/upload-image").then((r) => r.json()).then((d) => setImages(d.images ?? []));
  }, []);

  const apply = async (id: string) => {
    await fetch("/api/admin/themes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "apply", id }) });
    setActiveTheme(id);
    onSave();
  };

  const saveTheme = async (theme: Theme) => {
    await fetch("/api/admin/themes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save", theme }) });
    setThemes((prev) => {
      const idx = prev.findIndex((t) => t.id === theme.id);
      return idx >= 0 ? prev.map((t) => t.id === theme.id ? theme : t) : [...prev, theme];
    });
    setEditing(null);
    onSave();
  };

  const deleteTheme = async (id: string) => {
    if (!confirm("Delete this theme?")) return;
    await fetch("/api/admin/themes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id }) });
    setThemes((prev) => prev.filter((t) => t.id !== id));
  };

  const createNew = () => {
    const id = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!id) return;
    setEditing({ id, name: newName, backgroundImage: images[0] ?? "", enabledPhrases: [] });
    setNewName("");
  };

  if (editing) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setEditing(null)} style={iconBtnStyle}>←</button>
          <h3 style={{ margin: 0, fontSize: 16 }}>Editing: {editing.name}</h3>
        </div>

        <p style={{ margin: "0 0 8px", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Background</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginBottom: 20 }}>
          {images.map((img) => (
            <button key={img} onClick={() => setEditing({ ...editing, backgroundImage: img })}
              style={{ padding: 0, border: img === editing.backgroundImage ? "3px solid var(--ink)" : "2px solid var(--hairline)", borderRadius: 6, cursor: "pointer", overflow: "hidden", background: "none" }}>
              <img src={`/${img}`} alt={img} style={{ width: "100%", height: 80, objectFit: "cover", display: "block" }} />
              <div style={{ padding: "3px 6px", fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--muted)", background: "var(--paper)", textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {img === editing.backgroundImage && "✓ "}{img}
              </div>
            </button>
          ))}
        </div>

        <p style={{ margin: "0 0 8px", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Typewriter phrases</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 20 }}>
          {allPhrases.map((p) => {
            const on = editing.enabledPhrases.includes(p.text);
            return (
              <label key={p.text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", border: "1px solid var(--hairline)", borderRadius: 4, cursor: "pointer", background: on ? "var(--paper)" : "var(--paper-warm)", opacity: on ? 1 : 0.6 }}>
                <input type="checkbox" checked={on} onChange={(e) => setEditing({
                  ...editing,
                  enabledPhrases: e.target.checked
                    ? [...editing.enabledPhrases, p.text]
                    : editing.enabledPhrases.filter((x) => x !== p.text),
                })} style={{ accentColor: "var(--ink)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{p.text}</span>
              </label>
            );
          })}
        </div>

        <button onClick={() => saveTheme(editing)} style={btnStyle}>Save theme</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {themes.map((t) => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", border: t.id === activeTheme ? "2px solid var(--ink)" : "1px solid var(--hairline)", borderRadius: 6, background: "var(--paper)" }}>
            <img src={`/${t.backgroundImage}`} alt="" style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 4, flexShrink: 0, border: "1px solid var(--hairline)" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)", marginTop: 2 }}>{t.enabledPhrases.length} phrases · {t.backgroundImage}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {t.id !== activeTheme && <button onClick={() => apply(t.id)} style={btnStyle}>Apply</button>}
              {t.id === activeTheme && <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)", padding: "8px 12px" }}>✓ Active</span>}
              <button onClick={() => setEditing(t)} style={addBtnStyle}>Edit</button>
              <button onClick={() => deleteTheme(t.id)} style={{ ...iconBtnStyle, color: "var(--muted)" }}>×</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New theme name…" style={{ ...inputStyle, width: 220 }} onKeyDown={(e) => e.key === "Enter" && createNew()} />
        <button onClick={createNew} style={addBtnStyle} disabled={!newName.trim()}>+ Create theme</button>
      </div>
    </div>
  );
}

// ── Background Editor ──────────────────────────────────────────────────────

function BackgroundEditor({ onSave }: { onSave: () => void }) {
  const [current, setCurrent] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site-config").then((r) => r.json()).then((d) => setCurrent(d.backgroundImage ?? ""));
    fetch("/api/admin/upload-image").then((r) => r.json()).then((d) => setImages(d.images ?? []));
  }, []);

  const select = async (filename: string) => {
    setCurrent(filename);
    await fetch("/api/admin/site-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ backgroundImage: filename }),
    });
    onSave();
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
    const data = await res.json();
    if (data.ok) {
      setImages(data.images ?? []);
      await select(data.filename);
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
          Active: <strong style={{ color: "var(--ink)" }}>{current || "—"}</strong>
        </p>
        <label
          style={{
            display: "inline-block",
            padding: "8px 18px",
            background: "var(--ink)",
            color: "var(--paper)",
            borderRadius: 4,
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.6 : 1,
          }}
        >
          {uploading ? "Uploading…" : "+ Upload image"}
          <input type="file" accept="image/*" onChange={upload} style={{ display: "none" }} disabled={uploading} />
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {images.map((img) => (
          <button
            key={img}
            onClick={() => select(img)}
            title={img}
            style={{
              padding: 0,
              border: img === current ? "3px solid var(--ink)" : "2px solid var(--hairline)",
              borderRadius: 6,
              cursor: "pointer",
              overflow: "hidden",
              background: "none",
              position: "relative",
            }}
          >
            <img
              src={`/${img}`}
              alt={img}
              style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }}
            />
            <div
              style={{
                padding: "4px 8px",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                color: "var(--muted)",
                textAlign: "left",
                background: "var(--paper)",
                borderTop: "1px solid var(--hairline)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {img === current && "✓ "}
              {img}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState<"colors" | "typewriter" | "projects" | "background" | "themes">("colors");
  const [colors, setColors] = useState<Record<string, string>>({});
  const [valueColors, setValueColors] = useState<Record<string, string>>({});
  const [typewriterPhrases, setTypewriterPhrases] = useState<TypewriterPhrase[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [saved, setSaved] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/colors").then((r) => r.json()).then(setColors);
    fetch("/api/admin/value-colors").then((r) => r.json()).then(setValueColors);
    fetch("/api/admin/typewriter-phrases").then((r) => r.json()).then(setTypewriterPhrases);
    fetch("/api/admin/projects").then((r) => r.json()).then(setProjects);
  }, []);

  const flashSaved = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const persistValueColors = useCallback((vc: Record<string, string>) =>
    fetch("/api/admin/value-colors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(vc) }),
  []);

  const saveColors = async () => {
    await Promise.all([
      fetch("/api/admin/colors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(colors) }),
      persistValueColors(valueColors),
    ]);
    flashSaved();
  };

  const addValueColor = () => {
    const name = prompt("Value name (e.g. \"justice\"):");
    if (!name?.trim()) return;
    setValueColors((prev) => ({ ...prev, [name.trim()]: "#888888" }));
  };

  const saveTypewriterPhrases = async () => {
    await Promise.all([
      fetch("/api/admin/typewriter-phrases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(typewriterPhrases) }),
      persistValueColors(valueColors),
    ]);
    flashSaved();
  };

  const publish = async () => {
    setPublishing(true);
    setPublishStatus(null);
    try {
      const res = await fetch("/api/admin/git-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "admin: update content" }),
      });
      const data = await res.json();
      if (data.ok) {
        setPublishStatus(data.skipped ? "Nothing to publish" : `Published (${data.sha})`);
      } else {
        setPublishStatus(`Error: ${data.error}`);
      }
    } catch {
      setPublishStatus("Network error");
    } finally {
      setPublishing(false);
      setTimeout(() => setPublishStatus(null), 4000);
    }
  };

  const removeValueColor = (key: string) => {
    setValueColors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const saveProject = async (p: Project) => {
    let updated: Project[];
    if (isNew) {
      updated = [...projects, p];
    } else {
      updated = projects.map((proj) => proj.id === p.id ? p : proj);
    }
    setProjects(updated);
    await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    flashSaved();
    setEditingProject(null);
    setIsNew(false);
  };

  const deleteProject = async (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    flashSaved();
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 20px",
    cursor: "pointer",
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    background: active ? "var(--ink)" : "none",
    color: active ? "var(--paper)" : "var(--muted)",
    border: "1px solid var(--hairline)",
    borderRadius: 4,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--paper-warm)",
        padding: 40,
        fontFamily: "var(--font-sans)",
        color: "var(--ink)",
      }}
    >
      <SaveBanner saved={saved} />

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0, marginBottom: 4 }}>Admin</h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
              Archangel Laboratories — site editor
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <button
              onClick={publish}
              disabled={publishing}
              style={{
                ...btnStyle,
                background: publishing ? "var(--muted)" : "var(--blue)",
                opacity: publishing ? 0.7 : 1,
                cursor: publishing ? "not-allowed" : "pointer",
                minWidth: 110,
              }}
            >
              {publishing ? "Publishing…" : "↑ Publish"}
            </button>
            {publishStatus && (
              <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: publishStatus.startsWith("Error") ? "var(--red)" : "var(--muted)" }}>
                {publishStatus}
              </span>
            )}
          </div>
        </div>

        {editingProject ? (
          <div style={{ background: "var(--paper)", border: "1px solid var(--hairline)", borderRadius: 6, padding: 28 }}>
            <ProjectEditor
              project={editingProject}
              onSave={saveProject}
              onCancel={() => { setEditingProject(null); setIsNew(false); }}
            />
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              <button style={tabStyle(tab === "colors")} onClick={() => setTab("colors")}>Colors</button>
              <button style={tabStyle(tab === "typewriter")} onClick={() => setTab("typewriter")}>Typewriter</button>
              <button style={tabStyle(tab === "projects")} onClick={() => setTab("projects")}>Projects</button>
              <button style={tabStyle(tab === "background")} onClick={() => setTab("background")}>Background</button>
              <button style={tabStyle(tab === "themes")} onClick={() => setTab("themes")}>Themes</button>
            </div>

            <div style={{ background: "var(--paper)", border: "1px solid var(--hairline)", borderRadius: 6, padding: 28 }}>
              {tab === "colors" && (
                <ColorEditor
                  colors={colors}
                  onChange={(key, val) => setColors((prev) => ({ ...prev, [key]: val }))}
                  onSave={saveColors}
                  valueColors={valueColors}
                  onValueColorChange={(key, val) => setValueColors((prev) => ({ ...prev, [key]: val }))}
                  onValueColorAdd={addValueColor}
                  onValueColorRemove={removeValueColor}
                />
              )}
              {tab === "typewriter" && (
                <TypewriterEditor
                  phrases={typewriterPhrases}
                  valueColors={valueColors}
                  onChange={setTypewriterPhrases}
                  onValueColorChange={(key, val) => setValueColors((prev) => ({ ...prev, [key]: val }))}
                  onSaveAll={saveTypewriterPhrases}
                />
              )}
              {tab === "projects" && (
                <ProjectList
                  projects={projects}
                  onSelect={(p) => { setEditingProject(p); setIsNew(false); }}
                  onNew={() => { setEditingProject(makeEmptyProject()); setIsNew(true); }}
                  onDelete={deleteProject}
                />
              )}
              {tab === "background" && (
                <BackgroundEditor onSave={flashSaved} />
              )}
              {tab === "themes" && (
                <ThemesEditor onSave={flashSaved} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
