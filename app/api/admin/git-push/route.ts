import { NextResponse } from "next/server";

const MANAGED_FILES = [
  "app/data/projects-data.json",
  "app/data/value-colors.json",
  "app/data/typewriter-phrases.json",
  "app/data/site-config.json",
  "app/globals.css",
  "public",
];

export async function POST(req: Request) {
  const { execSync } = await import("child_process");
  const { message = "admin: update content" } = await req.json().catch(() => ({}));
  const ROOT = process.cwd();

  function run(cmd: string) {
    return execSync(cmd, { cwd: ROOT, encoding: "utf-8" }).trim();
  }

  try {
    run(`git add ${MANAGED_FILES.join(" ")}`);

    const status = run("git status --porcelain");
    if (!status) {
      return NextResponse.json({ ok: true, skipped: true, message: "Nothing to commit" });
    }

    run(`git commit -m "${message.replace(/"/g, '\\"')}"`);
    run("git push");

    const sha = run("git rev-parse --short HEAD");
    return NextResponse.json({ ok: true, sha });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
