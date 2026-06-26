import { NextResponse } from "next/server";

export async function GET() {
  const { readFileSync } = await import("fs");
  const { join } = await import("path");
  const themes = JSON.parse(readFileSync(join(process.cwd(), "app/data/themes.json"), "utf-8"));
  const config = JSON.parse(readFileSync(join(process.cwd(), "app/data/site-config.json"), "utf-8"));
  return NextResponse.json({ themes, activeTheme: config.activeTheme ?? null });
}

export async function POST(req: Request) {
  const { readFileSync, writeFileSync } = await import("fs");
  const { join } = await import("path");
  const body = await req.json();

  const themesPath = join(process.cwd(), "app/data/themes.json");
  const configPath = join(process.cwd(), "app/data/site-config.json");

  if (body.action === "apply") {
    const themes = JSON.parse(readFileSync(themesPath, "utf-8"));
    const theme = themes.find((t: { id: string }) => t.id === body.id);
    if (!theme) return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    writeFileSync(configPath, JSON.stringify({ ...config, activeTheme: theme.id, backgroundImage: theme.backgroundImage }, null, 2));
    return NextResponse.json({ ok: true });
  }

  if (body.action === "save") {
    const themes = JSON.parse(readFileSync(themesPath, "utf-8"));
    const existing = themes.findIndex((t: { id: string }) => t.id === body.theme.id);
    if (existing >= 0) themes[existing] = body.theme;
    else themes.push(body.theme);
    writeFileSync(themesPath, JSON.stringify(themes, null, 2));
    return NextResponse.json({ ok: true });
  }

  if (body.action === "delete") {
    const themes = JSON.parse(readFileSync(themesPath, "utf-8"));
    writeFileSync(themesPath, JSON.stringify(themes.filter((t: { id: string }) => t.id !== body.id), null, 2));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
