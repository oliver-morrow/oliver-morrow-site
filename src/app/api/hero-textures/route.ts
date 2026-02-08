import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  const dir = path.join(process.cwd(), "public/images/hero");

  try {
    const entries = await fs.readdir(dir);
    const files = entries
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .map((f) => ({
        id: f.replace(/\.[^.]+$/, ""),
        src: `/images/hero/${f}`,
        invert: true,
        label: `SYSTEM::${f.replace(/\.[^.]+$/, "").replace(/-/g, "_").toUpperCase()}`,
      }));

    return NextResponse.json(files, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return NextResponse.json([]);
  }
}
