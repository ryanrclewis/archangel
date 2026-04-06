"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { projects, type Project } from "../data/projects";
import styles from "./IdeWorkbench.module.css";

const ourWork = projects.filter((project) => project.folder === "Our Work");
const pastWork = projects.filter((project) => project.folder === "Past Work");

function statusClass(status: Project["status"]) {
  if (status === "LIVE" || status === "ONLINE") return styles.statusLive;
  if (status === "IN PROGRESS") return styles.statusProgress;
  return styles.statusDone;
}

function dotClass(status: Project["status"]) {
  if (status === "LIVE" || status === "ONLINE") return styles.dotLive;
  if (status === "IN PROGRESS") return styles.dotProgress;
  return styles.dotDone;
}

function projectIcon(type: string) {
  const value = type.toLowerCase();
  if (value.includes("ios")) return "IOS";
  if (value.includes("docker")) return "DKR";
  if (value.includes("game")) return "GM";
  if (value.includes("visualization")) return "VIZ";
  if (value.includes("product")) return "PRD";
  if (value.includes("interface")) return "UI";
  if (value.includes("portfolio")) return "WEB";
  if (value.includes("info")) return "MSG";
  return "APP";
}

function buildEditorLines(project: Project) {
  const tags = project.tags?.length ? `[${project.tags.map((tag) => `\"${tag}\"`).join(", ")}]` : "null";
  const features = project.features?.length
    ? `[${project.features.map((feature) => `\"${feature}\"`).join(", ")}]`
    : "null";

  return [
    { kind: "comment", text: "// ARCHANGEL PROJECT RECORD" },
    { kind: "pair", key: "id", value: `\"${project.id}\"` },
    { kind: "pair", key: "name", value: `\"${project.name}\"` },
    { kind: "pair", key: "folder", value: `\"${project.folder}\"` },
    { kind: "pair", key: "type", value: `\"${project.type}\"` },
    { kind: "pair", key: "status", value: `\"${project.status}\"` },
    { kind: "pair", key: "description", value: `\"${project.description}\"` },
    { kind: "pair", key: "tags", value: tags },
    { kind: "pair", key: "features", value: features },
    { kind: "pair", key: "route", value: `\"/projects/${project.id}\"` },
  ] as const;
}

export function IdeWorkbench() {
  const defaultProject = pastWork[0] ?? projects[0];

  const [activeId, setActiveId] = useState(defaultProject.id);
  const [history, setHistory] = useState<string[]>([defaultProject.id]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showOurWork, setShowOurWork] = useState(true);
  const [showPastWork, setShowPastWork] = useState(false);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeId) ?? defaultProject,
    [activeId, defaultProject],
  );

  const lines = buildEditorLines(activeProject);

  function openProject(id: string) {
    if (id === activeId) return;

    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(id);

    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setActiveId(id);
  }

  function goBack() {
    if (historyIndex === 0) return;

    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    setActiveId(history[nextIndex]);
  }

  function goForward() {
    if (historyIndex >= history.length - 1) return;

    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    setActiveId(history[nextIndex]);
  }

  return (
    <div className={styles.app}>
      <div className={styles.titlebar}>
        <div className={styles.buttons}>
          <span className={`${styles.button} ${styles.close}`} />
          <span className={`${styles.button} ${styles.min}`} />
          <span className={`${styles.button} ${styles.max}`} />
        </div>
        <div className={styles.title}>ARCHANGEL LABORATORIES - PROJECT SUITE</div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.navButtons}>
          <button className={styles.navButton} onClick={goBack} disabled={historyIndex === 0} aria-label="Back">
            {"<"}
          </button>
          <button
            className={styles.navButton}
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            aria-label="Forward"
          >
            {">"}
          </button>
        </div>
        <div className={styles.divider} />
        <div className={styles.breadcrumb}>
          Archangel / {activeProject.folder} / {activeProject.id}
        </div>
        <span className={styles.online}>ONLINE</span>
      </div>

      <div className={styles.workspace}>
        <aside className={styles.navigator}>
          <div className={styles.panelHeader}>Project Navigator</div>
          <div className={styles.projectTree}>
            <button className={styles.treeFolder} onClick={() => setShowOurWork((value) => !value)}>
              <span>{showOurWork ? "v" : ">"}</span>
              <span>Our Work</span>
            </button>
            {showOurWork
              ? ourWork.map((project) => (
                  <button
                    key={project.id}
                    className={`${styles.treeItem} ${activeProject.id === project.id ? styles.treeItemActive : ""}`}
                    onClick={() => openProject(project.id)}
                  >
                    <span className={`${styles.dot} ${dotClass(project.status)}`}>*</span>
                    <span>{project.id}</span>
                  </button>
                ))
              : null}

            <button className={styles.treeFolder} onClick={() => setShowPastWork((value) => !value)}>
              <span>{showPastWork ? "v" : ">"}</span>
              <span>Past Work</span>
            </button>
            {showPastWork
              ? pastWork.map((project) => (
                  <button
                    key={project.id}
                    className={`${styles.treeItem} ${activeProject.id === project.id ? styles.treeItemActive : ""}`}
                    onClick={() => openProject(project.id)}
                  >
                    <span className={`${styles.dot} ${dotClass(project.status)}`}>*</span>
                    <span>{project.id}</span>
                  </button>
                ))
              : null}
          </div>
        </aside>

        <section className={styles.editor}>
          <div className={styles.tabbar}>
            <div className={styles.tab}>
              <span className={styles.tabDot} />
              <span>{activeProject.id}.json</span>
            </div>
          </div>

          <div className={styles.editorBody}>
            <div className={styles.gutter}>
              {lines.map((_, index) => (
                <span key={`line-${index + 1}`}>{index + 1}</span>
              ))}
            </div>
            <div className={styles.codeScroll}>
              <pre className={styles.code}>
                {lines.map((line, index) => {
                  if (line.kind === "comment") {
                    return (
                      <div key={`row-${index}`}>
                        <span className={styles.comment}>{line.text}</span>
                      </div>
                    );
                  }

                  return (
                    <div key={`row-${index}`}>
                      <span className={styles.key}>{line.key}</span>: <span className={styles.value}>{line.value}</span>
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
        </section>

        <aside className={styles.preview}>
          <div className={styles.previewScroll}>
            <div className={styles.previewHero}>
              <div className={styles.previewIcon}>{projectIcon(activeProject.type)}</div>
              <div className={styles.previewName}>{activeProject.name}</div>
              <span className={`${styles.previewBadge} ${statusClass(activeProject.status)}`}>{activeProject.status}</span>
              <Link href={`/projects/${activeProject.id}`} className={styles.previewLink}>
                OPEN PROJECT ROUTE
              </Link>
            </div>

            <div className={styles.previewSection}>
              <div className={styles.previewLabel}>TYPE</div>
              <div className={styles.previewText}>{activeProject.type}</div>
            </div>

            <div className={styles.previewSection}>
              <div className={styles.previewLabel}>DESCRIPTION</div>
              <div className={styles.previewText}>{activeProject.description}</div>
            </div>

            {activeProject.tags?.length ? (
              <div className={styles.previewSection}>
                <div className={styles.previewLabel}>TAGS</div>
                <div className={styles.previewTags}>
                  {activeProject.tags.map((tag) => (
                    <span key={tag} className={styles.previewTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {activeProject.features?.length ? (
              <div className={styles.previewSection}>
                <div className={styles.previewLabel}>FEATURES</div>
                <div className={styles.previewText}>{activeProject.features.slice(0, 4).join(" | ")}</div>
              </div>
            ) : null}

            {activeProject.url ? (
              <div className={styles.previewSection}>
                <div className={styles.previewLabel}>EXTERNAL</div>
                <a className={styles.previewLink} href={activeProject.url} target="_blank" rel="noreferrer">
                  OPEN LIVE URL
                </a>
              </div>
            ) : null}
          </div>
        </aside>
      </div>

      <div className={styles.statusbar}>
        <span>Selected: {activeProject.id}</span>
        <div className={styles.statusbarRight}>
          <Link href="/" className={styles.previewText}>
            HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
