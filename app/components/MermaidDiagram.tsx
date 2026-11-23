"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";

type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, definition: string) => Promise<{ svg: string }>;
};

const MERMAID_CDN_URL: string =
  "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

let mermaidPromise: Promise<MermaidApi> | null = null;

function loadMermaid(): Promise<MermaidApi> {
  if (!mermaidPromise) {
    mermaidPromise = import(
      /* webpackIgnore: true */
      /* @vite-ignore */
      MERMAID_CDN_URL
    ).then((mod) => (mod.default ?? mod) as MermaidApi);
  }
  return mermaidPromise;
}

function getIsDarkTheme(): boolean {
  if (typeof document === "undefined") return false;
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "dark") return true;
  if (explicit === "light") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function subscribeTheme(onStoreChange: () => void): () => void {
  if (typeof document === "undefined") return () => {};

  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
  mql?.addEventListener?.("change", onStoreChange);

  return () => {
    observer.disconnect();
    mql?.removeEventListener?.("change", onStoreChange);
  };
}

type Props = {
  chart: string;
};

export function MermaidDiagram({ chart }: Props) {
  const rawId = useId();
  const safeId = `mermaid-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const dark = useSyncExternalStore(subscribeTheme, getIsDarkTheme, () => false);

  useEffect(() => {
    let active = true;

    loadMermaid()
      .then(async (mermaid) => {
        const styles = getComputedStyle(document.documentElement);
        const token = (name: string, fallback: string) =>
          styles.getPropertyValue(name).trim() || fallback;

        const paper = token("--paper", dark ? "#171817" : "#f7f4ec");
        const paperWarm = token("--paper-warm", dark ? "#2b2a25" : "#d9cfae");
        const ink = token("--ink", dark ? "#f4f0e6" : "#101010");
        const muted = token("--muted", dark ? "#b8b0a2" : "#4a3a2c");
        const hairline = token("--hairline", dark ? "#5d594f" : "#c2b49a");
        const blue = token("--blue", dark ? "#78b4e5" : "#005ea8");
        const fontSans = token(
          "--font-sans",
          '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif'
        );

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "base",
          themeVariables: {
            darkMode: dark,
            background: paper,
            fontFamily: fontSans,
            primaryColor: paperWarm,
            primaryTextColor: ink,
            primaryBorderColor: hairline,
            secondaryColor: paper,
            secondaryTextColor: ink,
            secondaryBorderColor: blue,
            tertiaryColor: paperWarm,
            tertiaryTextColor: ink,
            tertiaryBorderColor: hairline,
            lineColor: muted,
            textColor: ink,
            mainBkg: paperWarm,
            nodeBorder: hairline,
            clusterBkg: paper,
            clusterBorder: hairline,
            edgeLabelBackground: paper,
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: "basis",
          },
        });
        const renderId = `${safeId}-${dark ? "d" : "l"}-${Date.now()}`;
        const result = await mermaid.render(renderId, chart);
        if (active) {
          setSvg(result.svg);
          setFailed(false);
        }
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [chart, dark, safeId]);

  if (svg) {
    return (
      <figure className="case-study-diagram" aria-label="Architecture diagram">
        <div
          className="case-study-diagram-svg"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </figure>
    );
  }

  return (
    <figure className="case-study-diagram" aria-label="Architecture diagram">
      <pre className="case-study-code">
        <code>{chart}</code>
      </pre>
      {failed && (
        <figcaption className="case-study-diagram-note">
          Diagram source shown (Mermaid renderer unavailable offline).
        </figcaption>
      )}
    </figure>
  );
}
