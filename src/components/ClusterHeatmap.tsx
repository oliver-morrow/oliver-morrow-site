"use client";

import { useEffect, useRef, useCallback } from "react";

const ROWS = 16;
const COLS = 16;
const TOTAL = ROWS * COLS; // 256
const SPAWN_CHANCE = 0.06;
const DECREMENT = 3;

function workloadColor(value: number): string {
  if (value > 300) return "#f43f5e"; // rose-500
  if (value >= 100) return "#06b6d4"; // cyan-500
  if (value > 0) return "#06b6d4";   // cyan-500
  return "#18181b";                   // zinc-900 (idle)
}

interface ClusterHeatmapProps {
  tickMs: number;
  legendText: string;
}

export default function ClusterHeatmap({ tickMs, legendText }: ClusterHeatmapProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<Float32Array>(new Float32Array(TOTAL));
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const tickMsRef = useRef(tickMs);

  useEffect(() => {
    tickMsRef.current = tickMs;
  }, [tickMs]);

  const tick = useCallback(() => {
    const grid = gridRef.current;
    const container = canvasRef.current;
    if (!container) return;

    const children = container.children;
    let activeCount = 0;

    for (let i = 0; i < TOTAL; i++) {
      if (grid[i] === 0 && Math.random() < SPAWN_CHANCE) {
        grid[i] = 100 + Math.random() * 400;
      }
    }

    for (let i = 0; i < TOTAL; i++) {
      if (grid[i] > 0) {
        grid[i] = Math.max(0, grid[i] - DECREMENT);
        if (grid[i] > 0) activeCount++;
      }
      const el = children[i] as HTMLElement;
      if (el) {
        el.style.backgroundColor = workloadColor(grid[i]);
      }
    }

    if (legendRef.current) {
      legendRef.current.textContent = String(activeCount);
    }
  }, []);

  useEffect(() => {
    const loop = (timestamp: number) => {
      if (timestamp - lastTickRef.current >= tickMsRef.current) {
        lastTickRef.current = timestamp;
        tick();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  return (
    <div>
      <div
        ref={canvasRef}
        className="grid gap-0.5"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {Array.from({ length: TOTAL }, (_, i) => (
          <div
            key={i}
            className="aspect-square rounded-[2px]"
            style={{ backgroundColor: "#18181b" }}
          />
        ))}
      </div>
      <div className="mt-2 font-mono text-[10px] text-zinc-600 flex items-center justify-between gap-4">
        <span>0x0000–0x00FF · 4KB pages</span>
        <span>
          {legendText} · <span ref={legendRef}>0</span>/256 active
        </span>
      </div>
    </div>
  );
}
