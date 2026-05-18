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
    const { r, g, b } = hexToRgb(explicitHex);
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

export function getPhraseChipStyle(text: string, explicitHex?: string): React.CSSProperties {
  if (explicitHex) {
    const { r, g, b } = hexToRgb(explicitHex);
    return {
      color: `rgb(${r} ${g} ${b})`,
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.13)`,
      borderColor: `rgba(${r}, ${g}, ${b}, 0.28)`,
    };
  }

  const hue = hashPhrase(text) % 360;
  return {
    color: `hsl(${hue} 62% 26%)`,
    backgroundColor: `hsl(${hue} 70% 48% / 0.13)`,
    borderColor: `hsl(${hue} 64% 42% / 0.28)`,
  };
}
