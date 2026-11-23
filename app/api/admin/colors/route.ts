import { NextResponse } from "next/server";

const COLOR_VARS = [
  "--paper",
  "--paper-warm",
  "--ink",
  "--muted",
  "--hairline",
  "--blue",
  "--blue-dark",
  "--red",
  "--green",
  "--amber",
  "--purple",
  "--white",
];

function hexToRgbTriplet(hex: string): string | null {
  const clean = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function parseColors(css: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const varName of COLOR_VARS) {
    const match = css.match(new RegExp(`${varName}:\\s*(#[0-9a-fA-F]{3,8}|[^;\\n]+)\\s*;`));
    if (match) result[varName] = match[1].trim();
  }
  return result;
}

export async function GET() {
  const { readFileSync } = await import("fs");
  const { join } = await import("path");
  const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf-8");
  return NextResponse.json(parseColors(css));
}

export async function POST(req: Request) {
  const { readFileSync, writeFileSync } = await import("fs");
  const { join } = await import("path");
  const cssPath = join(process.cwd(), "app/globals.css");
  const updates: Record<string, string> = await req.json();
  let css = readFileSync(cssPath, "utf-8");

  for (const [varName, value] of Object.entries(updates)) {
    if (!COLOR_VARS.includes(varName)) continue;
    css = css.replace(
      new RegExp(`(${varName}:\\s*)([^;\\n]+)(;)`),
      `$1${value}$3`
    );
  }

  // Keep light-mode translucent paper layers synchronized when --paper changes
  if (typeof updates["--paper"] === "string") {
    const triplet = hexToRgbTriplet(updates["--paper"]);
    if (triplet) {
      for (const layerVar of ["--shell-background", "--header-background", "--backdrop-background"]) {
        css = css.replace(
          new RegExp(`(${layerVar}:\\s*rgba\\()\\d+,\\s*\\d+,\\s*\\d+(,\\s*[0-9.]+\\)\\s*;)`),
          `$1${triplet}$2`
        );
      }
    }
  }

  writeFileSync(cssPath, css, "utf-8");
  return NextResponse.json({ ok: true });
}
