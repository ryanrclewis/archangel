import { NextResponse } from "next/server";

export async function GET() {
  const { readFileSync } = await import("fs");
  const { join } = await import("path");
  const data = readFileSync(join(process.cwd(), "app/data/projects-data.json"), "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function POST(req: Request) {
  const { writeFileSync } = await import("fs");
  const { join } = await import("path");
  const projects = await req.json();
  writeFileSync(join(process.cwd(), "app/data/projects-data.json"), JSON.stringify(projects, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
