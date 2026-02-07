import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const dir = path.join(process.cwd(), "public/images/hero");

  if (!fs.existsSync(dir)) {
    return NextResponse.json([]);
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .map((f) => ({
      id: f.replace(/\.[^.]+$/, ""),
      src: `/images/hero/${f}`,
      invert: true,
      label: `SYSTEM::${f.replace(/\.[^.]+$/, "").replace(/-/g, "_").toUpperCase()}`,
    }));

  return NextResponse.json(files);
}
