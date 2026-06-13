import { NextResponse } from "next/server";

export async function GET() {
  const { readFileSync } = await import("fs");
  const { join } = await import("path");
  const data = readFileSync(join(process.cwd(), "app/data/site-config.json"), "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function POST(req: Request) {
  const { writeFileSync } = await import("fs");
  const { join } = await import("path");
  const config = await req.json();
  writeFileSync(join(process.cwd(), "app/data/site-config.json"), JSON.stringify(config, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
