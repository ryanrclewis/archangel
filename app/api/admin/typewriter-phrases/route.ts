import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const JSON_PATH = path.join(process.cwd(), "app/data/typewriter-phrases.json");

export async function GET() {
  const data = readFileSync(JSON_PATH, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function POST(req: Request) {
  const phrases = await req.json();
  writeFileSync(JSON_PATH, JSON.stringify(phrases, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
