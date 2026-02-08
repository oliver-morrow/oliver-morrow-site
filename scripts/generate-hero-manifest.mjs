import { readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const heroDir = join(__dirname, "..", "public", "images", "hero");
const outPath = join(__dirname, "..", "src", "data", "hero-textures.json");

const entries = readdirSync(heroDir);
const textures = entries
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .map((f) => ({
    id: f.replace(/\.[^.]+$/, ""),
    src: `/images/hero/${f}`,
    invert: true,
    label: `SYSTEM::${f.replace(/\.[^.]+$/, "").replace(/-/g, "_").toUpperCase()}`,
  }));

writeFileSync(outPath, JSON.stringify(textures, null, 2) + "\n");
console.log(`Generated hero-textures.json (${textures.length} textures)`);
