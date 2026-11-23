"use client";

import { useEffect, useSyncExternalStore } from "react";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "archangel-theme";
const THEME_CHANGE_EVENT = "archangel-theme-change";

/**
 * Set to `true` to restore the original Liquid Glass light-mode orb
 * and solid B&W dark-mode toggle styling.
 */
const USE_LIQUID_GLASS = false;

function getResolvedTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const savedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedMode === "dark" || savedMode === "light") return savedMode;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeTheme(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener?.("change", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    mql.removeEventListener?.("change", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribeTheme, getResolvedTheme, () => "light" as ThemeMode);

  useEffect(() => {
    const savedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedMode === "dark" || savedMode === "light") {
      document.documentElement.dataset.theme = savedMode;
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [mode]);

  const isDark = mode === "dark";
  const toggleMode = () => {
    const nextMode: ThemeMode = isDark ? "light" : "dark";
    window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    document.documentElement.dataset.theme = nextMode;
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  const variantClass = USE_LIQUID_GLASS ? "theme-toggle--liquid-glass" : "";

  return (
    <button
      className={`theme-toggle ${variantClass} ${isDark ? "is-dark" : "is-light"}`.trim()}
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleMode}
    >
      {USE_LIQUID_GLASS && !isDark && (
        <svg className="theme-toggle-rim" viewBox="0 0 52 52" aria-hidden="true">
          <defs>
            <linearGradient id="theme-toggle-rim-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.98} />
              <stop offset="18%" stopColor="#ffffff" stopOpacity={0.52} />
              <stop offset="50%" stopColor="#2d2a24" stopOpacity={0.58} />
              <stop offset="82%" stopColor="#ffffff" stopOpacity={0.52} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0.96} />
            </linearGradient>
          </defs>
          <circle
            cx="26"
            cy="26"
            r="25.5"
            fill="none"
            stroke="url(#theme-toggle-rim-gradient)"
            strokeWidth="1"
          />
        </svg>
      )}
      <svg
        className={`theme-toggle-icon ${isDark ? "is-dark" : "is-light"}`}
        viewBox="0 0 44 44"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M22 0a22 22 0 1 1 0 44a22 22 0 1 1 0-44ZM22 5a17 17 0 0 0 0 34V30a8 8 0 0 1 0-16ZM22 14a8 8 0 0 1 0 16Z"
        />
      </svg>
    </button>
  );
}
