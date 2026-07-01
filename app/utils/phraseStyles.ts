export function hashPhrase(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getPhraseChipColor(text: string, explicitHex?: string) {
  if (explicitHex) {
    const { r, g, b } = readableOnPaper(hexToRgb(explicitHex));
    return `rgb(${r} ${g} ${b})`;
  }

  const hue = hashPhrase(text) % 360;
  return `hsl(${hue} 62% 26%)`;
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  if (clean.length === 3) {
    const r = (bigint >> 8) & 0xf;
    const g = (bigint >> 4) & 0xf;
    const b = bigint & 0xf;
    return { r: r * 17, g: g * 17, b: b * 17 };
  }
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

type Rgb = { r: number; g: number; b: number };

// The paper the chips sit on (--paper). Text must stay legible against it.
const PAPER: Rgb = { r: 247, g: 244, b: 236 };
const MIN_CONTRAST = 4.5;

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

function rgbToHsl({ r, g, b }: Rgb) {
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

/**
 * Keep a value's hue but darken it just enough to stay readable as text on the
 * paper background. Pale picks (light golds, jade, an accidental white) become a
 * deeper shade of the same color rather than washing out.
 */
function readableOnPaper(rgb: Rgb): Rgb {
  if (contrastRatio(rgb, PAPER) >= MIN_CONTRAST) return rgb;
  const { h, s } = rgbToHsl(rgb);
  // Nudge saturation up a touch for near-grey inputs so the darkened text still
  // reads as a hue rather than flat charcoal.
  const sat = Math.max(s, 0.05);
  let l = rgbToHsl(rgb).l;
  let candidate = rgb;
  while (l > 0) {
    candidate = hslToRgb(h, sat, l);
    if (contrastRatio(candidate, PAPER) >= MIN_CONTRAST) break;
    l -= 0.02;
  }
  return candidate;
}

export function getPhraseChipStyle(text: string, explicitHex?: string): React.CSSProperties {
  if (explicitHex) {
    const base = hexToRgb(explicitHex);
    const { r, g, b } = base;
    const textColor = readableOnPaper(base);
    return {
      color: `rgb(${textColor.r} ${textColor.g} ${textColor.b})`,
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.13)`,
      borderColor: `rgba(${r}, ${g}, ${b}, 0.28)`,
    };
  }

  const hue = hashPhrase(text) % 360;
  return {
    color: `hsl(${hue} 62% 22%)`,
    backgroundColor: `hsl(${hue} 70% 44% / 0.13)`,
    borderColor: `hsl(${hue} 64% 36% / 0.28)`,
  };
}
