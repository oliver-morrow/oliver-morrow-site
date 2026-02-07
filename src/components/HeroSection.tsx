"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/portfolio";
import { useSystemStats } from "@/hooks/useSystemStats";

/* ── Constants ─────────────────────────────────────────────── */
const AMBER = "#f59e0b";
const GAP_CSS = 0.5;
const STABILITY_RATE = 0.02;
const STABILITY_THRESHOLD = 0.8;
const NOISE_TICK = 10;
const SCRAMBLE_RADIUS_CSS = 50;

/* ── Floyd-Steinberg dithering ─────────────────────────────── */
function floydSteinberg(
  gray: Float32Array,
  w: number,
  h: number,
): Uint8Array {
  const buf = Float32Array.from(gray);
  const out = new Uint8Array(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const old = buf[i];
      const val = old > 0.5 ? 1 : 0;
      out[i] = val;
      const err = old - val;

      if (x + 1 < w) buf[i + 1] += err * (7 / 16);
      if (y + 1 < h) {
        if (x > 0) buf[(y + 1) * w + x - 1] += err * (3 / 16);
        buf[(y + 1) * w + x] += err * (5 / 16);
        if (x + 1 < w) buf[(y + 1) * w + x + 1] += err * (1 / 16);
      }
    }
  }
  return out;
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

  // Telemetry DOM refs (updated imperatively from rAF — zero re-renders)
  const heapRef = useRef<HTMLSpanElement>(null);
  const renderRef = useRef<HTMLSpanElement>(null);

  // Parse hardware stats (0 while still probing)
  const detected = stats.cpu !== "CALCULATING_CORES...";
  const cores = detected ? parseInt(stats.cpu) || 4 : 0;
  const ramGB = detected ? parseInt(stats.ram) || 4 : 4;
  const gridSize = cores > 0 ? Math.max(80, Math.min(160, cores * 20)) : 0;

  // RAM → noise config (low RAM = more "memory corruption")
  const noiseInterval = ramGB >= 16 ? 300 : ramGB >= 8 ? 180 : 90;
  const noiseAmount = ramGB >= 16 ? 0.002 : ramGB >= 8 ? 0.005 : 0.012;
  const noiseRef = useRef({ noiseInterval, noiseAmount });
  noiseRef.current = { noiseInterval, noiseAmount };

  /* ── Boot text sequencer ─────────────────────────────────── */
  useEffect(() => {
    if (!detected) return;
    setBootLines([
      `CPU: ${cores}-CORE`,
      `RAM: ${ramGB} GB`,
      `ALLOCATING_GRID: ${gridSize}×${gridSize}`,
    ]);
    const timer = setTimeout(() => setShowBoot(false), 2500);
    return () => clearTimeout(timer);
  }, [detected, cores, ramGB, gridSize]);

  /* ── Canvas render (starts once gridSize is known) ───────── */
  useEffect(() => {
    if (gridSize === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const total = gridSize * gridSize;
    const stability = new Float32Array(total);
    const noise = new Uint8Array(total);
    for (let i = 0; i < total; i++) noise[i] = Math.random() > 0.5 ? 1 : 0;
    let dithered: Uint8Array | null = null;
    let frame = 0;
    let lastTime = 0;

    // Load image → grayscale → invert → Floyd-Steinberg
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

      const gray = new Float32Array(total);
      for (let i = 0; i < total; i++) {
        const p = i * 4;
        const lum =
          (0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]) / 255;

        // Contrast boost: steepen mid-tones before inverting
        const contrast = 1.8;
        const boosted = Math.min(
          1,
          Math.max(0, (lum - 0.5) * contrast + 0.5),
        );
        gray[i] = 1 - boosted;
      }

      dithered = floydSteinberg(gray, gridSize, gridSize);
    };

    // ── rAF render loop ─────────────────────────────────────
    let running = true;
    const render = (now: number) => {
      if (!running) return;
      if (!dithered) {
        requestAnimationFrame(render);
        return;
      }

      // Frame timing
      const delta = lastTime ? now - lastTime : 16.67;
      lastTime = now;
      frame++;

      const { noiseInterval: nI, noiseAmount: nA } = noiseRef.current;

      // RAM-based "memory corruption" bursts
      if (frame % nI === 0) {
        for (let i = 0; i < total; i++) {
          if (Math.random() < nA) stability[i] = 0;
        }
      }

      // Re-roll noise at ~6 fps
      if (frame % NOISE_TICK === 0) {
        for (let i = 0; i < total; i++)
          noise[i] = Math.random() > 0.5 ? 1 : 0;
      }

      const w = canvas.width;
      const h = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      const cellW = w / gridSize;
      const cellH = h / gridSize;
      const gap = GAP_CSS * dpr;
      const dotW = cellW - gap;
      const dotH = cellH - gap;
      const scrambleR = SCRAMBLE_RADIUS_CSS * dpr;
      const scrambleR2 = scrambleR * scrambleR;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = AMBER;

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

          // Stable → dithered, unstable → noise
          const on =
            stability[idx] >= STABILITY_THRESHOLD
              ? dithered[idx] === 1
              : noise[idx] === 1;

          if (on) {
            ctx.fillRect(x * cellW, y * cellH, dotW, dotH);
          }
        }
      }

      // ── Telemetry update (imperative DOM writes) ──────────
      if (renderRef.current) {
        const fps = Math.round(1000 / delta);
        renderRef.current.textContent = `RENDER: ${delta.toFixed(1)}ms (${fps}fps)`;
      }

      if (heapRef.current) {
        const mem = getHeapMemory();
        if (mem) {
          const used = (mem.usedJSHeapSize / 1048576).toFixed(1);
          const limit = (mem.jsHeapSizeLimit / 1048576).toFixed(0);
          heapRef.current.textContent = `HEAP: ${used} / ${limit} MB`;
        } else {
          // Simulated fluctuation for Firefox/Safari
          const sim = 12 + Math.sin(now * 0.002) * 3 + Math.sin(now * 0.007) * 1.5;
          heapRef.current.textContent = `HEAP: ~${sim.toFixed(1)} MB`;
        }
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

  // Truncate GPU string for display
  const gpuShort = stats.gpu
    .replace(/ANGLE \(|,.*|\)/g, "")
    .replace(/\s+/g, "_")
    .toUpperCase()
    .slice(0, 28);

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
              className="w-full aspect-square"
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
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
          </div>

          {/* ── Hardware Telemetry Deck ──────────────────────── */}
          <div className="w-full max-w-120 mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-amber-500/60">
            <span ref={heapRef}>{"HEAP: --.- MB"}</span>
            <span ref={renderRef}>{"RENDER: --.--ms"}</span>
            <span>{"GPU: " + gpuShort}</span>
            <span>{`THREADS: ${cores || "—"}`}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
