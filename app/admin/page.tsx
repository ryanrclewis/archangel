"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { PageLayout } from "@/app/components/PageLayout";
import "./admin.css";
import { BackgroundTab } from "./components/BackgroundTab";
import { ColorsTab } from "./components/ColorsTab";
import { ProjectEditor } from "./components/ProjectEditor";
import { ProjectsTab } from "./components/ProjectsTab";
import { ThemesTab } from "./components/ThemesTab";
import { TypewriterTab } from "./components/TypewriterTab";
import {
  makeEmptyProject,
  slugify,
  type AdminTabId,
  type Project,
  type SiteConfig,
  type Theme,
  type ToastMessage,
  type TypewriterPhrase,
} from "./components/types";

const VALID_TABS: AdminTabId[] = ["projects", "themes", "typewriter", "background", "colors"];

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTabId>("projects");
  const [loading, setLoading] = useState(true);

  const [colors, setColors] = useState<Record<string, string>>({});
  const [savedColors, setSavedColors] = useState<Record<string, string>>({});
  const [valueColors, setValueColors] = useState<Record<string, string>>({});
  const [savedValueColors, setSavedValueColors] = useState<Record<string, string>>({});
  const [typewriterPhrases, setTypewriterPhrases] = useState<TypewriterPhrase[]>([]);
  const [savedPhrases, setSavedPhrases] = useState<TypewriterPhrase[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({});
  const [images, setImages] = useState<string[]>([]);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastTimer = useRef<number | null>(null);

  const [commitMessage, setCommitMessage] = useState("");
  const [publishing, setPublishing] = useState(false);

  const showToast = useCallback((text: string, tone: ToastMessage["tone"] = "success") => {
    setToast({ text, tone });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  // Sync tab with URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as AdminTabId;
    if (VALID_TABS.includes(hash)) setTab(hash);
  }, []);

  const switchTab = (next: AdminTabId) => {
    setTab(next);
    setEditingProject(null);
    setIsNewProject(false);
    window.history.replaceState(null, "", `#${next}`);
  };

  // Load all admin datasets in parallel
  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/admin/colors").then((r) => r.json()),
      fetch("/api/admin/value-colors").then((r) => r.json()),
      fetch("/api/admin/typewriter-phrases").then((r) => r.json()),
      fetch("/api/admin/projects").then((r) => r.json()),
      fetch("/api/admin/themes").then((r) => r.json()),
      fetch("/api/admin/site-config").then((r) => r.json()),
      fetch("/api/admin/upload-image").then((r) => r.json()),
    ])
      .then(([c, vc, tp, pr, th, sc, img]) => {
        if (!active) return;
        setColors(c ?? {});
        setSavedColors(c ?? {});
        setValueColors(vc ?? {});
        setSavedValueColors(vc ?? {});
        setTypewriterPhrases(Array.isArray(tp) ? tp : []);
        setSavedPhrases(Array.isArray(tp) ? tp : []);
        setProjects(Array.isArray(pr) ? pr : []);
        setThemes(th?.themes ?? []);
        setSiteConfig(sc ?? {});
        setImages(img?.images ?? []);
      })
      .catch(() => {
        if (active) showToast("Failed to load admin data", "error");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [showToast]);

  const colorsDirty = useMemo(
    () =>
      JSON.stringify(colors) !== JSON.stringify(savedColors) ||
      JSON.stringify(valueColors) !== JSON.stringify(savedValueColors),
    [colors, savedColors, valueColors, savedValueColors]
  );

  const phrasesDirty = useMemo(
    () =>
      JSON.stringify(typewriterPhrases) !== JSON.stringify(savedPhrases) ||
      JSON.stringify(valueColors) !== JSON.stringify(savedValueColors),
    [typewriterPhrases, savedPhrases, valueColors, savedValueColors]
  );

  // ── API persistence handlers ─────────────────────────────────────────────

  const persistProjects = useCallback(
    async (updated: Project[], message: string) => {
      setProjects(updated);
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) {
        showToast("Failed to save projects", "error");
        return;
      }
      showToast(message);
    },
    [showToast]
  );

  const saveProject = async (project: Project, originalId: string) => {
    const updated = isNewProject
      ? [...projects, project]
      : projects.map((item) => (item.id === originalId ? project : item));
    await persistProjects(updated, isNewProject ? `Created "${project.name}"` : `Saved "${project.name}"`);
    setEditingProject(null);
    setIsNewProject(false);
  };

  const deleteProject = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    await persistProjects(
      projects.filter((p) => p.id !== id),
      target ? `Deleted "${target.name}"` : "Project deleted"
    );
  };

  const toggleProjectHidden = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const nextHidden = !target.hidden;
    const updated = projects.map((p) => (p.id === id ? { ...p, hidden: nextHidden } : p));
    await persistProjects(
      updated,
      nextHidden ? `Hidden "${target.name}"` : `"${target.name}" is now public`
    );
  };

  const duplicateProject = (project: Project) => {
    const baseSlug = slugify(`${project.id}-copy`);
    let candidate = baseSlug;
    let suffix = 2;
    while (projects.some((p) => p.id === candidate)) {
      candidate = `${baseSlug}-${suffix++}`;
    }
    setEditingProject({
      ...project,
      id: candidate,
      name: `${project.name} (Copy)`,
      hidden: true,
    });
    setIsNewProject(true);
  };

  const reorderProjects = async (updated: Project[]) => {
    await persistProjects(updated, "Project order updated");
  };

  const saveColors = useCallback(async () => {
    const [r1, r2] = await Promise.all([
      fetch("/api/admin/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(colors),
      }),
      fetch("/api/admin/value-colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valueColors),
      }),
    ]);
    if (!r1.ok || !r2.ok) {
      showToast("Failed to save colors", "error");
      return;
    }
    setSavedColors(colors);
    setSavedValueColors(valueColors);
    showToast("Colors saved");
  }, [colors, valueColors, showToast]);

  const saveTypewriterPhrases = useCallback(async () => {
    const [r1, r2] = await Promise.all([
      fetch("/api/admin/typewriter-phrases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(typewriterPhrases),
      }),
      fetch("/api/admin/value-colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valueColors),
      }),
    ]);
    if (!r1.ok || !r2.ok) {
      showToast("Failed to save typewriter phrases", "error");
      return;
    }
    setSavedPhrases(typewriterPhrases);
    setSavedValueColors(valueColors);
    showToast("Typewriter phrases saved");
  }, [typewriterPhrases, valueColors, showToast]);

  const applyTheme = async (id: string) => {
    const res = await fetch("/api/admin/themes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "apply", id }),
    });
    if (!res.ok) {
      showToast("Failed to apply theme", "error");
      return;
    }
    const chosen = themes.find((t) => t.id === id);
    setSiteConfig((prev) => ({
      ...prev,
      activeTheme: id,
      backgroundImage: chosen?.backgroundImage ?? prev.backgroundImage,
    }));
    showToast(`Applied theme "${chosen?.name ?? id}"`);
  };

  const saveTheme = async (theme: Theme) => {
    const res = await fetch("/api/admin/themes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", theme }),
    });
    if (!res.ok) {
      showToast("Failed to save theme", "error");
      return;
    }
    setThemes((prev) => {
      const idx = prev.findIndex((t) => t.id === theme.id);
      return idx >= 0 ? prev.map((t) => (t.id === theme.id ? theme : t)) : [...prev, theme];
    });
    showToast(`Saved theme "${theme.name}"`);
  };

  const deleteTheme = async (id: string) => {
    const target = themes.find((t) => t.id === id);
    const res = await fetch("/api/admin/themes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    if (!res.ok) {
      showToast("Failed to delete theme", "error");
      return;
    }
    setThemes((prev) => prev.filter((t) => t.id !== id));
    showToast(target ? `Deleted theme "${target.name}"` : "Theme deleted");
  };

  const updateSiteConfig = async (updates: Partial<SiteConfig>, message: string) => {
    const res = await fetch("/api/admin/site-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      showToast("Failed to update site config", "error");
      return;
    }
    setSiteConfig((prev) => ({ ...prev, ...updates }));
    showToast(message);
  };

  const uploadBackgroundImage = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      showToast(data.error ?? "Upload failed", "error");
      return;
    }
    setImages(data.images ?? []);
    await updateSiteConfig(
      { backgroundImage: data.filename },
      `Uploaded & activated "${data.filename}"`
    );
  };

  const publish = async () => {
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/git-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: commitMessage.trim() || "admin: update content",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        if (data.skipped) {
          showToast("Everything is already published", "info");
        } else {
          setCommitMessage("");
          showToast(`Published to production (${data.sha})`, "success");
        }
      } else {
        showToast(`Publish error: ${data.error}`, "error");
      }
    } catch {
      showToast("Network error while publishing", "error");
    } finally {
      setPublishing(false);
    }
  };

  // ── Summary Metrics ──────────────────────────────────────────────────────

  const publicCount = projects.filter((p) => !p.hidden && !p.archived).length;
  const hiddenCount = projects.filter((p) => p.hidden).length;
  const activeTheme = themes.find((t) => t.id === siteConfig.activeTheme) ?? null;
  const activePhraseCount = activeTheme
    ? activeTheme.enabledPhrases.length
    : typewriterPhrases.filter((p) => p.enabled !== false).length;

  return (
    <PageLayout>
      {toast && (
        <div className="admin-toast" data-tone={toast.tone ?? "success"} role="status" aria-live="polite">
          <span className="admin-toast-dot" aria-hidden="true" />
          <span>{toast.text}</span>
        </div>
      )}

      <div className="admin-page">
        <div className="admin-container">
          <header className="admin-hero">
            <div>
              <p className="admin-kicker">Archangel Laboratories · Studio Admin</p>
              <h1>Site Editor</h1>
              <p className="admin-subtitle">
                Manage portfolio projects, seasonal themes, hero typewriter phrases, backdrop artwork, and palette tokens.
              </p>
            </div>

            <div className="admin-hero-actions">
              <Link href="/" className="admin-btn admin-btn--ghost">
                View live site ↗
              </Link>
              <div className="admin-publish-group">
                <input
                  type="text"
                  className="admin-publish-input"
                  placeholder="Commit message (optional)…"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  aria-label="Publish commit message"
                />
                <button
                  type="button"
                  className="admin-btn admin-btn--accent"
                  onClick={publish}
                  disabled={publishing}
                >
                  {publishing ? "Publishing…" : "↑ Publish"}
                </button>
              </div>
            </div>
          </header>

          {/* Summary overview strip */}
          <section className="admin-stats" aria-label="Site overview">
            <div className="admin-stat-card">
              <span className="admin-stat-label">Projects</span>
              <span className="admin-stat-value">{projects.length}</span>
              <span className="admin-stat-meta">
                {publicCount} public · {hiddenCount} hidden
              </span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Active Theme</span>
              <span className="admin-stat-value">{activeTheme?.name ?? "Custom"}</span>
              <span className="admin-stat-meta">{themes.length} saved themes</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Hero Phrases</span>
              <span className="admin-stat-value">{activePhraseCount}</span>
              <span className="admin-stat-meta">of {typewriterPhrases.length} total phrases</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Backdrop</span>
              <span className="admin-stat-value" title={siteConfig.backgroundImage}>
                {siteConfig.backgroundImage ?? "—"}
              </span>
              <span className="admin-stat-meta">{images.length} images in /public</span>
            </div>
          </section>

          {editingProject ? (
            <section className="admin-panel">
              <ProjectEditor
                project={editingProject}
                isNew={isNewProject}
                existingIds={projects.map((p) => p.id)}
                valueColors={valueColors}
                onSave={saveProject}
                onCancel={() => {
                  setEditingProject(null);
                  setIsNewProject(false);
                }}
              />
            </section>
          ) : (
            <>
              <nav className="admin-tabs" aria-label="Admin sections">
                <button
                  type="button"
                  className={`admin-tab ${tab === "projects" ? "is-active" : ""}`}
                  onClick={() => switchTab("projects")}
                >
                  Projects <span className="admin-tab-count">{projects.length}</span>
                </button>
                <button
                  type="button"
                  className={`admin-tab ${tab === "themes" ? "is-active" : ""}`}
                  onClick={() => switchTab("themes")}
                >
                  Themes <span className="admin-tab-count">{themes.length}</span>
                </button>
                <button
                  type="button"
                  className={`admin-tab ${tab === "typewriter" ? "is-active" : ""}`}
                  onClick={() => switchTab("typewriter")}
                >
                  Typewriter <span className="admin-tab-count">{typewriterPhrases.length}</span>
                  {phrasesDirty && <span className="admin-tab-dirty" title="Unsaved changes" />}
                </button>
                <button
                  type="button"
                  className={`admin-tab ${tab === "background" ? "is-active" : ""}`}
                  onClick={() => switchTab("background")}
                >
                  Background <span className="admin-tab-count">{images.length}</span>
                </button>
                <button
                  type="button"
                  className={`admin-tab ${tab === "colors" ? "is-active" : ""}`}
                  onClick={() => switchTab("colors")}
                >
                  Colors
                  {colorsDirty && <span className="admin-tab-dirty" title="Unsaved changes" />}
                </button>
              </nav>

              <section className="admin-panel">
                {loading ? (
                  <div className="admin-empty">
                    <p>Loading studio data…</p>
                  </div>
                ) : (
                  <>
                    {tab === "projects" && (
                      <ProjectsTab
                        projects={projects}
                        onSelect={(p) => {
                          setEditingProject(p);
                          setIsNewProject(false);
                        }}
                        onNew={(defaultSection) => {
                          setEditingProject(makeEmptyProject(defaultSection));
                          setIsNewProject(true);
                        }}
                        onDuplicate={duplicateProject}
                        onToggleHidden={toggleProjectHidden}
                        onDelete={deleteProject}
                        onReorder={reorderProjects}
                      />
                    )}

                    {tab === "themes" && (
                      <ThemesTab
                        themes={themes}
                        activeThemeId={siteConfig.activeTheme ?? null}
                        allPhrases={typewriterPhrases}
                        valueColors={valueColors}
                        images={images}
                        onApply={applyTheme}
                        onSaveTheme={saveTheme}
                        onDeleteTheme={deleteTheme}
                      />
                    )}

                    {tab === "typewriter" && (
                      <TypewriterTab
                        phrases={typewriterPhrases}
                        valueColors={valueColors}
                        activeThemeName={activeTheme?.name ?? null}
                        activeThemePhrases={activeTheme?.enabledPhrases ?? null}
                        dirty={phrasesDirty}
                        onChange={setTypewriterPhrases}
                        onValueColorChange={(key, val) =>
                          setValueColors((prev) => ({ ...prev, [key]: val }))
                        }
                        onSaveAll={saveTypewriterPhrases}
                        onReset={() => {
                          setTypewriterPhrases(savedPhrases);
                          setValueColors(savedValueColors);
                        }}
                        onOpenThemes={() => switchTab("themes")}
                      />
                    )}

                    {tab === "background" && (
                      <BackgroundTab
                        key={`${siteConfig.contactEmail ?? ""}-${siteConfig.twitterHandle ?? ""}`}
                        siteConfig={siteConfig}
                        images={images}
                        onSelectImage={(filename) =>
                          updateSiteConfig(
                            { backgroundImage: filename },
                            `Active backdrop set to "${filename}"`
                          )
                        }
                        onUploadImage={uploadBackgroundImage}
                        onSaveSiteDetails={(updates) =>
                          updateSiteConfig(updates, "Site contact details saved")
                        }
                      />
                    )}

                    {tab === "colors" && (
                      <ColorsTab
                        colors={colors}
                        valueColors={valueColors}
                        dirty={colorsDirty}
                        onChange={(key, val) =>
                          setColors((prev) => ({ ...prev, [key]: val }))
                        }
                        onValueColorChange={(key, val) =>
                          setValueColors((prev) => ({ ...prev, [key]: val }))
                        }
                        onValueColorAdd={(name, hex) =>
                          setValueColors((prev) => ({ ...prev, [name]: hex }))
                        }
                        onValueColorRemove={(key) =>
                          setValueColors((prev) => {
                            const next = { ...prev };
                            delete next[key];
                            return next;
                          })
                        }
                        onReset={() => {
                          setColors(savedColors);
                          setValueColors(savedValueColors);
                        }}
                        onSave={saveColors}
                      />
                    )}
                  </>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
