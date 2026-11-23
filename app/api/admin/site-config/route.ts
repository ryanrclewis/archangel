import { NextResponse } from "next/server";

export async function GET() {
  const { readFileSync } = await import("fs");
  const { join } = await import("path");
  const data = readFileSync(join(process.cwd(), "app/data/site-config.json"), "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function POST(req: Request) {
  const { readFileSync, writeFileSync } = await import("fs");
  const { join } = await import("path");
  const configPath = join(process.cwd(), "app/data/site-config.json");
  const existing = JSON.parse(readFileSync(configPath, "utf-8"));
  const updates = await req.json();
  const merged = { ...existing, ...updates };
  writeFileSync(configPath, JSON.stringify(merged, null, 2), "utf-8");
  return NextResponse.json({ ok: true, config: merged });
}
