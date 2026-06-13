import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { writeFileSync, readdirSync } = await import("fs");
  const { join, extname } = await import("path");

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = extname(file.name).toLowerCase();
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const publicDir = join(process.cwd(), "public");
  writeFileSync(join(publicDir, filename), buffer);

  const images = readdirSync(publicDir).filter((f) =>
    [".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(extname(f).toLowerCase())
  );

  return NextResponse.json({ ok: true, filename, images });
}

export async function GET() {
  const { readdirSync } = await import("fs");
  const { join, extname } = await import("path");
  const publicDir = join(process.cwd(), "public");
  const images = readdirSync(publicDir).filter((f) =>
    [".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(extname(f).toLowerCase())
  );
  return NextResponse.json({ images });
}
