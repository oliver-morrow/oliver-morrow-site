"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/portfolio";
import { useSystemStats } from "@/hooks/useSystemStats";
import heroTextures from "@/data/hero-textures.json";

/* ── Constants ─────────────────────────────────────────────── */
const ACCENT = "#06b6d4";
const STABILITY_RATE = 0.02;
const STABILITY_THRESHOLD = 0.8;
const NOISE_TICK_FAST = 6; // normal: re-roll noise every 6 frames
const NOISE_TICK_SLOW = 10; // throttled: when delta > 32ms (below 30fps)
const SCRAMBLE_RADIUS_CSS = 50;
const HEAP_SPIKE_THRESHOLD = 5; // MB change that triggers a glitch
const HEAP_SPIKE_ENTROPY = 0.03; // fraction of pixels to destabilize on GC
const HEAP_SPIKE_COOLDOWN = 3000; // ms between heap-spike glitches

/* ── Hero texture rotation ────────────────────────────────── */
type HeroTexture = {
  id: string;
  src: string;
  invert: boolean;
  label: string;
};

// Fallback texture if API fails or directory is empty
const FALLBACK_TEXTURE: HeroTexture = {
  id: "fallback",
  src: "/images/hero/cpu-die-shot.jpeg",
  invert: true,
  label: "SYSTEM::FALLBACK_V1",
};

/* ── Pre-computed halftone LUT (brightness → pixel alpha) ─── */
const HALFTONE_LUT = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
  const b = i / 255;
  if (b < 0.1) continue; // noise gate — keep background pitch black
  const scale = Math.min(0.7, Math.pow(b, 1.2));
  HALFTONE_LUT[i] = Math.round(scale * 364); // 0.7 → 255
}

/* ── Framer variants ───────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const { profile } = siteConfig;
const heroLinks = [
  { label: "Work", href: "/work", external: false },
  { label: "About", href: "/about", external: false },
  { label: "Notes", href: profile.socials.blog, external: true },
] as const;

/* ── Heap memory helper ────────────────────────────────────── */
type PerfMemory = { usedJSHeapSize: number; jsHeapSizeLimit: number };
function getHeapMemory(): PerfMemory | null {
  const mem = (performance as unknown as { memory?: PerfMemory }).memory;
  return mem ?? null;
}

/* ── Component ─────────────────────────────────────────────── */
export default function HeroSection() {
  const stats = useSystemStats();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const [bootLines, setBootLines] = useState<string[]>([
    "DETECTING_CORES...",
  ]);
  const [showBoot, setShowBoot] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [activeTexture, setActiveTexture] = useState<HeroTexture>(FALLBACK_TEXTURE);
  const [textureReady, setTextureReady] = useState(false);

  // Select a random texture from the build-time manifest
  useEffect(() => {
    if (heroTextures.length > 0) {
      setActiveTexture(heroTextures[Math.floor(Math.random() * heroTextures.length)]);
    }
    setTextureReady(true);
  }, []);

  // Telemetry DOM refs (updated imperatively from rAF — zero re-renders)
  const heapRef = useRef<HTMLSpanElement>(null);
  const cycleRef = useRef<HTMLSpanElement>(null);
  const debugFrameRef = useRef<HTMLDivElement>(null);
  const imgDimRef = useRef("--x--");
  const debugRef = useRef(false);

  // Keep ref in sync so the rAF closure can read debug state
  useEffect(() => { debugRef.current = showDebug; }, [showDebug]);

  // Parse hardware stats (0 while still probing)
  const detected = stats.cpu !== "CALCULATING_CORES...";
  const cores = detected ? parseInt(stats.cpu) || 4 : 0;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const [gridSize, setGridSize] = useState(128);
  const gridTier = gridSize >= 256 ? "HIGH"
    : gridSize >= 128 ? "STANDARD"
    : "THERMAL_SAFE";
  const downgradedRef = useRef(false);

  // Progressive enhancement: upgrade resolution on capable desktops
  useEffect(() => {
    if (!isMobile && cores > 6 && !downgradedRef.current) {
      setGridSize(256);
    }
  }, [cores, isMobile]);

  /* ── Boot text sequencer ─────────────────────────────────── */
  useEffect(() => {
    if (!detected) return;
    setBootLines([
      `LOADING: ${activeTexture.label}`,
      `CORES: ${cores} → RES: ${gridSize}px`,
      `GRID: ${gridSize}×${gridSize}`,
      "BINDING_TELEMETRY...",
    ]);
    const timer = setTimeout(() => setShowBoot(false), 2500);
    return () => clearTimeout(timer);
  }, [detected, cores, gridSize, activeTexture]);

  /* ── Canvas render (starts once gridSize is known) ───────── */
  useEffect(() => {
    if (!textureReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const mobile = isMobile;
    const total = gridSize * gridSize;
    const stability = new Float32Array(total);
    const noise = new Float32Array(total);
    for (let i = 0; i < total; i++) noise[i] = Math.random();
    let brightness: Float32Array | null = null;
    let frame = 0;
    let lastTime = 0;
    let prevHeap = 0;
    let lastHeapSpike = 0;
    let smoothDelta = 16.67; // EMA for stable FPS readout
    let slowFrameStart = 0; // timestamp when slow frames began
    let lastTelemetry = 0; // throttle DOM writes to 2x/sec

    // Offscreen pixel buffer — replaces 65K fillRect with one putImageData + drawImage
    const blitCvs = document.createElement("canvas");
    blitCvs.width = gridSize;
    blitCvs.height = gridSize;
    const blitCtx = blitCvs.getContext("2d")!;
    const imgData = blitCtx.createImageData(gridSize, gridSize);
    const pixels32 = new Uint32Array(imgData.data.buffer);
    const CYAN32 = 0x00D4B606; // #06b6d4 as ABGR (little-endian, alpha=0)

    // Load image → grayscale → brightness map (invert depends on texture)
    const img = new Image();
    img.src = activeTexture.src;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = gridSize;
      off.height = gridSize;
      const offCtx = off.getContext("2d")!;

      // Center-crop (object-fit: cover)
      let sx = 0,
        sy = 0,
        sSize: number;
      if (img.width > img.height) {
        sSize = img.height;
        sx = (img.width - sSize) / 2;
      } else {
        sSize = img.width;
        sy = (img.height - sSize) / 2;
      }
      offCtx.drawImage(img, sx, sy, sSize, sSize, 0, 0, gridSize, gridSize);
      const { data } = offCtx.getImageData(0, 0, gridSize, gridSize);

      brightness = new Float32Array(total);
      for (let i = 0; i < total; i++) {
        const p = i * 4;
        const lum =
          (0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]) / 255;

        // Contrast boost
        const contrast = 1.8;
        const boosted = Math.min(
          1,
          Math.max(0, (lum - 0.5) * contrast + 0.5),
        );
        // invert: white-bg sources → dark lines become bright cyan
        brightness[i] = activeTexture.invert ? 1 - boosted : boosted;
      }
      imgDimRef.current = `${img.naturalWidth}x${img.naturalHeight}`;
    };

    // ── rAF render loop ─────────────────────────────────────
    let running = true;
    const render = (now: number) => {
      if (!running) return;
      if (!brightness) {
        requestAnimationFrame(render);
        return;
      }

      // Frame timing
      const delta = lastTime ? now - lastTime : 16.67;

      // Throttle high-refresh displays (120Hz+) without skipping 60Hz frames
      const minDelta = mobile ? 30 : 12;
      if (delta < minDelta && lastTime > 0) {
        requestAnimationFrame(render);
        return;
      }

      lastTime = now;
      frame++;

      // PERFORMANCE GUARD: auto-downgrade if consistently slow
      if (!downgradedRef.current) {
        if (smoothDelta > 20) {
          if (slowFrameStart === 0) slowFrameStart = now;
          else if (now - slowFrameStart > 3000) {
            const lower = gridSize >= 256 ? 128 : 96;
            downgradedRef.current = true;
            queueMicrotask(() => setGridSize(lower));
          }
        } else {
          slowFrameStart = 0;
        }
      }

      // BINDING: FPS → Animation Speed
      const noiseTick = delta > 32 ? NOISE_TICK_SLOW : NOISE_TICK_FAST;
      const rerollNoise = frame % noiseTick === 0;

      // BINDING: Memory → Entropy (heap spikes destabilize pixels)
      const mem = getHeapMemory();
      if (mem) {
        const heapMB = mem.usedJSHeapSize / 1048576;
        if (prevHeap > 0 && Math.abs(heapMB - prevHeap) > HEAP_SPIKE_THRESHOLD && now - lastHeapSpike > HEAP_SPIKE_COOLDOWN) {
          lastHeapSpike = now;
          for (let i = 0; i < total; i++) {
            if (Math.random() < HEAP_SPIKE_ENTROPY) stability[i] = 0;
          }
        }
        prevHeap = heapMB;
      }

      const w = canvas.width;
      const h = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      const cellW = w / gridSize;
      const cellH = h / gridSize;
      const scrambleR = SCRAMBLE_RADIUS_CSS * dpr;
      const scrambleR2 = scrambleR * scrambleR;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      const wireframe = debugRef.current;

      // Schematic mode: draw cell grid + brightness symbols
      if (wireframe) {
        // 1. Graph paper — single batched path
        ctx.strokeStyle = "rgba(6,182,212,0.1)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let i = 0; i <= gridSize; i++) {
          const px = i * cellW;
          const py = i * cellH;
          ctx.moveTo(px, 0); ctx.lineTo(px, h);
          ctx.moveTo(0, py); ctx.lineTo(w, py);
        }
        ctx.stroke();

        // 2. Symbol pass — batched path, single stroke
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 0.5;
        ctx.fillStyle = ACCENT;
        ctx.beginPath();

        for (let y = 0; y < gridSize; y++) {
          for (let x = 0; x < gridSize; x++) {
            const idx = y * gridSize + x;
            const originX = (x + 0.5) * cellW;
            const originY = (y + 0.5) * cellH;

            // Mouse scramble
            if (mouse) {
              const dx = originX - mouse.x;
              const dy = originY - mouse.y;
              if (dx * dx + dy * dy < scrambleR2) {
                stability[idx] = 0;
              }
            }

            // Advance stability
            if (stability[idx] < 1) {
              stability[idx] = Math.min(stability[idx] + STABILITY_RATE, 1);
            }

            let b: number;
            if (stability[idx] >= STABILITY_THRESHOLD) {
              b = brightness[idx];
            } else {
              if (rerollNoise) noise[idx] = Math.random();
              b = noise[idx];
            }

            if (b > 0.7) {
              // Boxed X — rect + diagonals (added to batched path)
              const sz = cellW * 0.8;
              const x0 = originX - sz / 2;
              const y0 = originY - sz / 2;
              ctx.rect(x0, y0, sz, sz);
              ctx.moveTo(x0, y0); ctx.lineTo(x0 + sz, y0 + sz);
              ctx.moveTo(x0 + sz, y0); ctx.lineTo(x0, y0 + sz);
            } else if (b > 0.15) {
              // Plus — crosshair (added to batched path)
              const arm = cellW * 0.35;
              ctx.moveTo(originX - arm, originY); ctx.lineTo(originX + arm, originY);
              ctx.moveTo(originX, originY - arm); ctx.lineTo(originX, originY + arm);
            } else if (b > 0.05) {
              // Dot — immediate fill (doesn't affect path)
              ctx.fillRect(originX - 0.5, originY - 0.5, 1, 1);
            }
            // else: empty cell
          }
        }
        ctx.stroke();
      } else {
        // Normal halftone rendering — ImageData fast path
        pixels32.fill(0);

        for (let y = 0; y < gridSize; y++) {
          for (let x = 0; x < gridSize; x++) {
            const idx = y * gridSize + x;

            // Mouse scramble (needs display-space coords)
            if (mouse) {
              const dx = (x + 0.5) * cellW - mouse.x;
              const dy = (y + 0.5) * cellH - mouse.y;
              if (dx * dx + dy * dy < scrambleR2) {
                stability[idx] = 0;
              }
            }

            // Advance stability
            if (stability[idx] < 1) {
              stability[idx] = Math.min(stability[idx] + STABILITY_RATE, 1);
            }

            let b: number;
            if (stability[idx] >= STABILITY_THRESHOLD) {
              b = brightness[idx];
            } else {
              if (rerollNoise) noise[idx] = Math.random();
              b = noise[idx];
            }

            const alpha = HALFTONE_LUT[(b * 255) | 0];
            if (alpha === 0) continue;
            pixels32[idx] = (alpha << 24) | CYAN32;
          }
        }

        blitCtx.putImageData(imgData, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(blitCvs, 0, 0, w, h);
      }

      // ── Telemetry update (imperative DOM writes) ──────────
      // CYCLE: smoothed fps (EMA to avoid flicker)
      smoothDelta += (delta - smoothDelta) * 0.1;

      // Throttled telemetry update (2x/sec — humans can't read faster)
      if (now - lastTelemetry > 500) {
        lastTelemetry = now;

        if (cycleRef.current) {
          cycleRef.current.textContent = `CYCLE: ${Math.round(1000 / smoothDelta)}Hz`;
        }
        if (heapRef.current) {
          if (mem) {
            heapRef.current.textContent = `HEAP: ${(mem.usedJSHeapSize / 1048576).toFixed(1)}MB`;
          } else {
            const sim = 12 + Math.sin(now * 0.002) * 3 + Math.sin(now * 0.007) * 1.5;
            heapRef.current.textContent = `HEAP: ~${sim.toFixed(1)}MB`;
          }
        }
        if (debugFrameRef.current) {
          debugFrameRef.current.textContent = `FRAME_TIME  ${smoothDelta.toFixed(2)}ms`;
        }
      }

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
    return () => {
      running = false;
    };
  }, [gridSize, activeTexture, textureReady, isMobile]);

  /* ── Resize observer ─────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sync = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const nextW = Math.round(rect.width * dpr);
      const nextH = Math.round(rect.height * dpr);
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
      }
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  /* ── Pointer tracking ────────────────────────────────────── */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      // Use offsetX/offsetY — already element-relative, no rect lookup needed
      const dpr = window.devicePixelRatio || 1;
      mouseRef.current = {
        x: e.nativeEvent.offsetX * dpr,
        y: e.nativeEvent.offsetY * dpr,
      };
    },
    [],
  );

  const handlePointerLeave = useCallback(() => {
    mouseRef.current = null;
  }, []);

  /* ── JSX ─────────────────────────────────────────────────── */
  return (
    <section
      id="home"
      className="relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col justify-center px-4 sm:px-6"
    >
      <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 py-12 sm:py-16 lg:py-20">
        {/* ── Left: Name + Title ─────────────────────────────── */}
        <motion.div
          className="flex-1 min-w-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-text-primary uppercase"
            variants={itemVariants}
          >
            {profile.name}
          </motion.h1>

          <motion.p
            className="mt-4 max-w-2xl font-mono text-sm uppercase tracking-[0.25em] text-accent"
            variants={itemVariants}
          >
            {profile.title}
          </motion.p>

          <motion.p
            className="mt-5 max-w-2xl text-lg leading-relaxed text-text-body sm:text-xl"
            variants={itemVariants}
          >
            {profile.bio}
          </motion.p>

          <motion.p
            className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base"
            variants={itemVariants}
          >
            Mostly data systems, internal tools, and side projects.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            variants={itemVariants}
          >
            {heroLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-text-primary transition-colors duration-200 hover:border-border-hover hover:text-accent"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-text-primary transition-colors duration-200 hover:border-border-hover hover:text-accent"
                >
                  {link.label}
                </Link>
              ),
            )}
          </motion.div>

          <motion.div
            className="mt-8 h-px max-w-xs bg-border"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: "easeInOut" as const,
            }}
          />

          {/* ── Spec Sheet ──────────────────────────────────── */}
          <motion.div
            className="mt-10 font-mono text-[10px] uppercase tracking-widest leading-loose space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <div>
              <span className="text-zinc-400">{"RIGHT NOW   "}</span>
              <span className="text-cyan-500/90">{profile.status.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-zinc-400">{"BASE        "}</span>
              <span className="text-cyan-500/90">{profile.location.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-zinc-400">{"INTO        "}</span>
              <span className="text-cyan-500/90">{"DATA SYSTEMS / INTERFACES / HOMELAB"}</span>
            </div>
            <div>
              <span className="text-zinc-400">{"CORE TECH   "}</span>
              <span className="text-cyan-500/90">{"SNOWFLAKE / DBT / AIRFLOW / SQL / MCP"}</span>
            </div>
          </motion.div>

          <motion.p
            className="mt-6 font-mono text-xs text-text-muted uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            <span className="text-accent">&#9662;</span> Scroll to explore
          </motion.p>
        </motion.div>

        {/* ── Right: Portrait + Telemetry ────────────────────── */}
        <div className="flex-1 min-w-0 w-full lg:w-auto flex flex-col items-center lg:items-end">
          {/* Canvas wrapper */}
          <div className="relative w-full max-w-120">
            <canvas
              ref={canvasRef}
              className={`w-full aspect-square cursor-crosshair${isMobile ? "" : " shadow-[0_0_10px_rgba(6,182,212,0.5)]"}`}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            />
            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.4) 1px, rgba(0,0,0,0.4) 2px)",
              }}
            />

            {/* Boot overlay */}
            <AnimatePresence>
              {showBoot && (
                <motion.div
                  className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-accent bg-black/70 px-2.5 py-1.5 rounded leading-relaxed"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" as const }}
                >
                  {bootLines.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Debug terminal panel */}
            <AnimatePresence>
              {showDebug && (
                <motion.div
                  className="absolute top-3 left-3 z-10 bg-zinc-950/90 border border-cyan-500/20 backdrop-blur-sm rounded-md p-4 font-mono text-[10px] text-cyan-400 uppercase tracking-widest leading-relaxed"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-cyan-500/40 mb-1">{"RENDERER::SCHEMATIC_VIEW"}</div>
                  <div className="text-cyan-500/20 mb-2">{"--------------------------------"}</div>
                  <div>{`ALGORITHM   VARIABLE_DENSITY_HALFTONE`}</div>
                  <div>{`SOURCE_RES  ${imgDimRef.current}px`}</div>
                  <div>{`GRID_RES    ${gridSize}x${gridSize} (${gridTier})`}</div>
                  <div>{`THREADS     ${cores} DETECTED`}</div>
                  <div ref={debugFrameRef}>{"FRAME_TIME  --ms"}</div>
                  <div>{`GPU         ${stats.gpu}`}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Telemetry Deck (3 coupled values) ─────────────── */}
          <div className="w-full max-w-120 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-cyan-500/60">
            <span>{`RES: ${gridSize}px :: ${gridTier}_MODE`}</span>
            <span ref={cycleRef}>{"CYCLE: --Hz"}</span>
            <span ref={heapRef}>{"HEAP: --.--MB"}</span>
            <button
              type="button"
              onClick={() => setShowDebug((d) => !d)}
              className="text-cyan-500/50 hover:text-cyan-500 transition-colors cursor-pointer"
            >
              {showDebug ? "[ HIDE_RENDER_STATS ]" : "[ VIEW_RENDER_STATS ]"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
