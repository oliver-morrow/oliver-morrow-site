"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/portfolio";
import { useSystemStats } from "@/hooks/useSystemStats";

/* ── Constants ─────────────────────────────────────────────── */
const ACCENT = "#06b6d4";
const STABILITY_RATE = 0.02;
const STABILITY_THRESHOLD = 0.8;
const NOISE_TICK_FAST = 6; // normal: re-roll noise every 6 frames
const NOISE_TICK_SLOW = 10; // throttled: when delta > 32ms (below 30fps)
const SCRAMBLE_RADIUS_CSS = 50;
const HEAP_SPIKE_THRESHOLD = 0.5; // MB change that triggers a glitch
const HEAP_SPIKE_ENTROPY = 0.03; // fraction of pixels to destabilize on GC

/* ── Halftone size (linear + exposure boost) ──────────────── */
const EXPOSURE = 1.2;
function halftoneScale(b: number): number {
  if (b < 0.1) return 0; // noise gate — keep background pitch black
  return Math.min(1, b * EXPOSURE);
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
  const gridSize = cores > 0 ? Math.max(48, Math.min(128, cores * 16)) : 0;

  /* ── Boot text sequencer ─────────────────────────────────── */
  useEffect(() => {
    if (!detected) return;
    setBootLines([
      `CORES: ${cores} → RES: ${gridSize}px`,
      `GRID: ${gridSize}×${gridSize}`,
      "BINDING_TELEMETRY...",
    ]);
    const timer = setTimeout(() => setShowBoot(false), 2500);
    return () => clearTimeout(timer);
  }, [detected, cores, gridSize]);

  /* ── Canvas render (starts once gridSize is known) ───────── */
  useEffect(() => {
    if (gridSize === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const total = gridSize * gridSize;
    const stability = new Float32Array(total);
    const noise = new Float32Array(total);
    for (let i = 0; i < total; i++) noise[i] = Math.random();
    let brightness: Float32Array | null = null;
    let frame = 0;
    let lastTime = 0;
    let prevHeap = 0;
    let smoothDelta = 16.67; // EMA for stable FPS readout

    // Load image → grayscale → invert → brightness map
    const img = new Image();
    img.src = "/hero.jpeg";
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

        // Contrast boost then invert (bright face features → high values)
        const contrast = 1.8;
        const boosted = Math.min(
          1,
          Math.max(0, (lum - 0.5) * contrast + 0.5),
        );
        brightness[i] = 1 - boosted;
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
      lastTime = now;
      frame++;

      // BINDING: FPS → Animation Speed
      const noiseTick = delta > 32 ? NOISE_TICK_SLOW : NOISE_TICK_FAST;
      if (frame % noiseTick === 0) {
        for (let i = 0; i < total; i++) noise[i] = Math.random();
      }

      // BINDING: Memory → Entropy (heap spikes destabilize pixels)
      const mem = getHeapMemory();
      if (mem) {
        const heapMB = mem.usedJSHeapSize / 1048576;
        if (prevHeap > 0 && Math.abs(heapMB - prevHeap) > HEAP_SPIKE_THRESHOLD) {
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
        // 1. Graph paper — stroke every cell boundary
        ctx.strokeStyle = "rgba(6,182,212,0.1)";
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= gridSize; i++) {
          const px = i * cellW;
          const py = i * cellH;
          ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
        }

        // 2. Symbol pass — stroke-only, uniform weight
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 0.5;

        for (let y = 0; y < gridSize; y++) {
          for (let x = 0; x < gridSize; x++) {
            const idx = y * gridSize + x;

            // Mouse scramble
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

            const b =
              stability[idx] >= STABILITY_THRESHOLD
                ? brightness[idx]
                : noise[idx];

            const centerX = x * cellW + cellW / 2;
            const centerY = y * cellH + cellH / 2;

            if (b > 0.7) {
              // Boxed X — box + diagonals
              const sz = cellW * 0.8;
              const x0 = centerX - sz / 2;
              const y0 = centerY - sz / 2;
              ctx.strokeRect(x0, y0, sz, sz);
              ctx.beginPath();
              ctx.moveTo(x0, y0); ctx.lineTo(x0 + sz, y0 + sz);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(x0 + sz, y0); ctx.lineTo(x0, y0 + sz);
              ctx.stroke();
            } else if (b > 0.15) {
              // Plus — crosshair
              const arm = cellW * 0.35;
              ctx.beginPath();
              ctx.moveTo(centerX - arm, centerY);
              ctx.lineTo(centerX + arm, centerY);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(centerX, centerY - arm);
              ctx.lineTo(centerX, centerY + arm);
              ctx.stroke();
            } else if (b > 0.05) {
              // Dot — single pixel
              ctx.fillStyle = ACCENT;
              ctx.fillRect(centerX - 0.5, centerY - 0.5, 1, 1);
            }
            // else: empty cell
          }
        }
      } else {
        // Normal halftone rendering
        ctx.fillStyle = ACCENT;
        ctx.lineWidth = 1;

        for (let y = 0; y < gridSize; y++) {
          for (let x = 0; x < gridSize; x++) {
            const idx = y * gridSize + x;

            // Mouse scramble
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

            const b =
              stability[idx] >= STABILITY_THRESHOLD
                ? brightness[idx]
                : noise[idx];

            const scale = halftoneScale(b);
            if (scale === 0) continue;

            const baseW = cellW * scale;
            const baseH = cellH * scale;
            const cx = x * cellW + (cellW - baseW) / 2;
            const cy = y * cellH + (cellH - baseH) / 2;
            ctx.fillRect(cx, cy, baseW, baseH);
          }
        }
      }

      // ── Telemetry update (imperative DOM writes) ──────────
      // CYCLE: smoothed fps (EMA to avoid flicker)
      smoothDelta += (delta - smoothDelta) * 0.1;
      if (cycleRef.current) {
        const fps = Math.round(1000 / smoothDelta);
        cycleRef.current.textContent = `CYCLE: ${fps}Hz`;
      }

      // HEAP: real or estimated
      if (heapRef.current) {
        if (mem) {
          heapRef.current.textContent = `HEAP: ${(mem.usedJSHeapSize / 1048576).toFixed(1)}MB`;
        } else {
          const sim = 12 + Math.sin(now * 0.002) * 3 + Math.sin(now * 0.007) * 1.5;
          heapRef.current.textContent = `HEAP: ~${sim.toFixed(1)}MB`;
        }
      }

      // DEBUG: live frame time
      if (debugFrameRef.current) {
        debugFrameRef.current.textContent = `FRAME_TIME  ${delta.toFixed(2)}ms`;
      }

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
    return () => {
      running = false;
    };
  }, [gridSize]);

  /* ── Resize observer ─────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sync = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  /* ── Pointer tracking ────────────────────────────────────── */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      mouseRef.current = {
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr,
      };
    },
    [],
  );

  const handlePointerLeave = useCallback(() => {
    mouseRef.current = null;
  }, []);

  /* ── JSX ─────────────────────────────────────────────────── */
  return (
    <section className="relative mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 py-20 sm:py-28 lg:py-36">
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
            className="mt-4 font-mono text-sm uppercase tracking-widest text-accent"
            variants={itemVariants}
          >
            {profile.title}
          </motion.p>

          <motion.p
            className="mt-4 text-lg text-text-body leading-relaxed max-w-md"
            variants={itemVariants}
          >
            {profile.bio}
          </motion.p>

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

          <motion.p
            className="mt-4 font-mono text-xs text-text-muted uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
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
              className="w-full aspect-square drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] cursor-crosshair"
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
                  <div>{`GRID_RES    ${gridSize}x${gridSize} (CPU_SCALED)`}</div>
                  <div>{`THREADS     ${cores} DETECTED`}</div>
                  <div ref={debugFrameRef}>{"FRAME_TIME  --ms"}</div>
                  <div>{`GPU         ${stats.gpu}`}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Telemetry Deck (3 coupled values) ─────────────── */}
          <div className="w-full max-w-120 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-cyan-500/60">
            <span>{`RES: ${gridSize}px :: ${cores}_CORE`}</span>
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
