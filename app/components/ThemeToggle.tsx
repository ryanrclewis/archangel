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
      {!isDark && (
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
