import type React from "react";

export function hashPhrase(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

type Rgb = { r: number; g: number; b: number };
type Hsl = { h: number; s: number; l: number };

// Worst-case & standard surfaces in both themes:
// Light: --paper (#f7f4ec), --white (#ffffff), --paper-warm (#d9cfae, featured cards)
const LIGHT_PAPER: Rgb = { r: 247, g: 244, b: 236 };
const LIGHT_WHITE: Rgb = { r: 255, g: 255, b: 255 };
const LIGHT_WARM: Rgb = { r: 217, g: 207, b: 174 };
const LIGHT_SURFACES: Rgb[] = [LIGHT_PAPER, LIGHT_WHITE, LIGHT_WARM];

// Dark: --paper (#171817), card (#222322), --paper-warm (#2b2a25), card hover (#2f302f)
const DARK_PAPER: Rgb = { r: 23, g: 24, b: 23 };
const DARK_WARM: Rgb = { r: 43, g: 42, b: 37 };
const DARK_HOVER: Rgb = { r: 47, g: 48, b: 47 };
const DARK_SURFACES: Rgb[] = [DARK_PAPER, DARK_WARM, DARK_HOVER];

// Exceed WCAG 2.1 AA (4.5:1) with comfortable headroom across every surface.
const MIN_LIGHT_CONTRAST = 5.2;
const MIN_DARK_CONTRAST = 5.5;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function hexToRgb(hex: string): Rgb | null {
  const clean = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const bigint = parseInt(clean, 16);
  if (clean.length === 3) {
    const r = (bigint >> 8) & 0xf;
    const g = (bigint >> 4) & 0xf;
    const b = bigint & 0xf;
    return { r: r * 17, g: g * 17, b: b * 17 };
  }
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function srgbChannel(c: number) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance({ r, g, b }: Rgb) {
  return 0.2126 * srgbChannel(r) + 0.7152 * srgbChannel(g) + 0.0722 * srgbChannel(b);
}

function contrastRatio(a: Rgb, b: Rgb) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

function compositeOver(fg: Rgb, alpha: number, bg: Rgb): Rgb {
  return {
    r: Math.round(fg.r * alpha + bg.r * (1 - alpha)),
    g: Math.round(fg.g * alpha + bg.g * (1 - alpha)),
    b: Math.round(fg.b * alpha + bg.b * (1 - alpha)),
  };
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h /= 6;
  }
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

function resolveBaseHsl(text: string, explicitHex?: string): Hsl {
  const parsed = explicitHex ? hexToRgb(explicitHex) : null;
  if (parsed) {
    const hsl = rgbToHsl(parsed);
    // Guard against near-white inputs (e.g. #ffffff) losing hue/visibility
    if (hsl.s < 0.06 && hsl.l > 0.85) {
      return { h: (hashPhrase(text) % 360) / 360, s: 0.48, l: 0.36 };
    }
    return hsl;
  }
  return { h: (hashPhrase(text) % 360) / 360, s: 0.58, l: 0.34 };
}

function findReadableForeground(
  h: number,
  s: number,
  startL: number,
  backgrounds: Rgb[],
  minContrast: number,
  direction: "darken" | "lighten"
): Rgb {
  const step = direction === "darken" ? -0.015 : 0.015;
  let l = startL;
  let best = hslToRgb(h, s, l);

  for (let i = 0; i < 80; i += 1) {
    const candidate = hslToRgb(h, s, clamp(l, 0.04, 0.96));
    best = candidate;
    const minRatio = Math.min(...backgrounds.map((bg) => contrastRatio(candidate, bg)));
    if (minRatio >= minContrast) return candidate;
    l += step;
    if (l <= 0.04 || l >= 0.96) break;
  }
  return best;
}

function rgbStr({ r, g, b }: Rgb) {
  return `rgb(${r} ${g} ${b})`;
}

function rgbaStr({ r, g, b }: Rgb, alpha: number) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const ON_DARK_FILL: Rgb = { r: 255, g: 255, b: 255 };
const ON_LIGHT_FILL: Rgb = { r: 17, g: 17, b: 17 };

function pickOnFill(bg: Rgb): string {
  return contrastRatio(ON_DARK_FILL, bg) >= contrastRatio(ON_LIGHT_FILL, bg)
    ? "#ffffff"
    : "#111111";
}

export function getPhraseThemePalette(text: string, explicitHex?: string) {
  const { h, s, l } = resolveBaseHsl(text, explicitHex);
  const isNeutral = s < 0.1;

  // Light mode: rich tinted pill & crisp border on cream/warm parchment
  const lightSat = isNeutral ? s : clamp(s, 0.36, 0.78);
  const lightTint = hslToRgb(h, lightSat, clamp(l, 0.34, 0.48));
  const lightBorder = hslToRgb(h, lightSat, clamp(l, 0.28, 0.42));
  const lightBgAlpha = 0.13;
  const lightBorderAlpha = 0.4;
  const lightChipSurfaces = LIGHT_SURFACES.map((surface) =>
    compositeOver(lightTint, lightBgAlpha, surface)
  );
  const lightFg = findReadableForeground(
    h,
    isNeutral ? s : clamp(s, 0.42, 0.82),
    clamp(l, 0.24, 0.4),
    lightChipSurfaces,
    MIN_LIGHT_CONTRAST,
    "darken"
  );

  // Dark mode: luminous tinted pill & crisp border on charcoal surfaces
  const darkSat = isNeutral ? s : clamp(s * 1.05, 0.42, 0.78);
  const darkTint = hslToRgb(h, darkSat, clamp(l + 0.22, 0.56, 0.68));
  const darkBorder = hslToRgb(h, darkSat, clamp(l + 0.26, 0.6, 0.74));
  const darkBgAlpha = 0.2;
  const darkBorderAlpha = 0.46;
  const darkChipSurfaces = DARK_SURFACES.map((surface) =>
    compositeOver(darkTint, darkBgAlpha, surface)
  );
  const darkFg = findReadableForeground(
    h,
    isNeutral ? s : clamp(s * 1.05, 0.46, 0.84),
    clamp(l + 0.34, 0.72, 0.82),
    darkChipSurfaces,
    MIN_DARK_CONTRAST,
    "lighten"
  );

  // Standalone text colors for typewriter & project card hover titles
  const lightText = findReadableForeground(
    h,
    isNeutral ? s : clamp(s, 0.42, 0.82),
    clamp(l, 0.26, 0.42),
    LIGHT_SURFACES,
    MIN_LIGHT_CONTRAST,
    "darken"
  );
  const darkText = findReadableForeground(
    h,
    isNeutral ? s : clamp(s * 1.05, 0.46, 0.84),
    clamp(l + 0.34, 0.7, 0.82),
    DARK_SURFACES,
    MIN_DARK_CONTRAST,
    "lighten"
  );

  return {
    light: {
      fg: rgbStr(lightFg),
      bg: rgbaStr(lightTint, lightBgAlpha),
      border: rgbaStr(lightBorder, lightBorderAlpha),
      text: rgbStr(lightText),
      onText: pickOnFill(lightText),
    },
    dark: {
      fg: rgbStr(darkFg),
      bg: rgbaStr(darkTint, darkBgAlpha),
      border: rgbaStr(darkBorder, darkBorderAlpha),
      text: rgbStr(darkText),
      onText: pickOnFill(darkText),
    },
  };
}

export function getPhraseChipColor(text: string, explicitHex?: string) {
  return getPhraseThemePalette(text, explicitHex).light.text;
}

export function getPhraseChipStyle(text: string, explicitHex?: string): React.CSSProperties {
  const palette = getPhraseThemePalette(text, explicitHex);
  return {
    "--chip-fg-light": palette.light.fg,
    "--chip-bg-light": palette.light.bg,
    "--chip-border-light": palette.light.border,
    "--chip-fg-dark": palette.dark.fg,
    "--chip-bg-dark": palette.dark.bg,
    "--chip-border-dark": palette.dark.border,
  } as React.CSSProperties;
}

export function getPhraseAccentVars(text: string, explicitHex?: string): React.CSSProperties {
  const palette = getPhraseThemePalette(text, explicitHex);
  return {
    "--phrase-fg-light": palette.light.text,
    "--phrase-fg-dark": palette.dark.text,
  } as React.CSSProperties;
}

export function getValueHoverVars(text: string, explicitHex?: string): React.CSSProperties {
  const palette = getPhraseThemePalette(text, explicitHex);
  return {
    "--value-hover-color-light": palette.light.text,
    "--value-hover-color-dark": palette.dark.text,
    "--value-hover-on-light": palette.light.onText,
    "--value-hover-on-dark": palette.dark.onText,
  } as React.CSSProperties;
}
