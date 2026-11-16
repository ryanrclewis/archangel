"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "archangel-theme";

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode | null>(null);

  useEffect(() => {
    const savedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
    const systemMode: ThemeMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const nextMode = savedMode === "dark" || savedMode === "light" ? savedMode : systemMode;

    setMode(nextMode);
    if (savedMode === "dark" || savedMode === "light") {
      document.documentElement.dataset.theme = savedMode;
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  const isDark = mode === "dark";
  const toggleMode = () => {
    const nextMode: ThemeMode = isDark ? "light" : "dark";
    setMode(nextMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    document.documentElement.dataset.theme = nextMode;
  };

  return (
    <button
      className={`theme-toggle ${isDark ? "is-dark" : "is-light"}`}
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleMode}
    >
      <span className={`theme-toggle-icon ${isDark ? "is-dark" : "is-light"}`} aria-hidden="true">
        <span />
      </span>
    </button>
  );
}
