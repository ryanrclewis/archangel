"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  CircleLeftHalfFilledIcon,
  MoonIcon,
  SunMaxIcon,
} from "@/app/components/SfSymbols";

type ThemePreference = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

const THEME_STORAGE_KEY = "archangel-theme";
const THEME_CHANGE_EVENT = "archangel-theme-change";

/**
 * Set to `true` to restore the Liquid Glass orb toggle styling.
 */
const USE_LIQUID_GLASS = false;

function getThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return "system";
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
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

const NEXT_PREFERENCE: Record<ThemePreference, ThemePreference> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const MODE_LABELS: Record<ThemePreference, string> = {
  system: "Automatic",
  light: "Light",
  dark: "Dark",
};

export function ThemeToggle() {
  const preference = useSyncExternalStore(
    subscribeTheme,
    getThemePreference,
    () => "system" as ThemePreference,
  );
  const systemTheme = useSyncExternalStore(
    subscribeTheme,
    getSystemTheme,
    () => "light" as ResolvedTheme,
  );

  const resolved: ResolvedTheme = preference === "system" ? systemTheme : preference;
  const isDark = resolved === "dark";

  useEffect(() => {
    if (preference === "light" || preference === "dark") {
      document.documentElement.dataset.theme = preference;
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [preference]);

  const cycleMode = () => {
    const next = NEXT_PREFERENCE[preference];
    if (next === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
      document.documentElement.removeAttribute("data-theme");
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
      document.documentElement.dataset.theme = next;
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  const nextMode = NEXT_PREFERENCE[preference];
  const actionLabel = `Appearance: ${MODE_LABELS[preference]}. Switch to ${MODE_LABELS[nextMode]}.`;
  const variantClass = USE_LIQUID_GLASS ? "theme-toggle--liquid-glass" : "";

  return (
    <button
      className={`theme-toggle ${variantClass} ${isDark ? "is-dark" : "is-light"}`.trim()}
      type="button"
      aria-label={actionLabel}
      title={actionLabel}
      onClick={cycleMode}
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
      {preference === "system" ? (
        <CircleLeftHalfFilledIcon className="theme-toggle-icon" />
      ) : preference === "light" ? (
        <SunMaxIcon className="theme-toggle-icon" />
      ) : (
        <MoonIcon className="theme-toggle-icon" />
      )}
    </button>
  );
}
