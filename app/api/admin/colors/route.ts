import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const CSS_PATH = path.join(process.cwd(), "app/globals.css");

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
  "--white",
];

function parseColors(css: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const varName of COLOR_VARS) {
    const match = css.match(new RegExp(`${varName}:\\s*(#[0-9a-fA-F]{3,8}|[^;\\n]+)\\s*;`));
    if (match) result[varName] = match[1].trim();
  }
  return result;
}

export async function GET() {
  const css = readFileSync(CSS_PATH, "utf-8");
  return NextResponse.json(parseColors(css));
}

export async function POST(req: Request) {
  const updates: Record<string, string> = await req.json();
  let css = readFileSync(CSS_PATH, "utf-8");

  for (const [varName, value] of Object.entries(updates)) {
    if (!COLOR_VARS.includes(varName)) continue;
    css = css.replace(
      new RegExp(`(${varName}:\\s*)([^;\\n]+)(;)`),
      `$1${value}$3`
    );
  }

  writeFileSync(CSS_PATH, css, "utf-8");
  return NextResponse.json({ ok: true });
}
