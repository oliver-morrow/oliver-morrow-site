"use client";

import { useState, useEffect } from "react";

interface SystemStats {
  gpu: string;
  cpu: string;
  ram: string;
  connection: string;
  platform: string;
  userAgent: string;
}

const DEFAULTS: SystemStats = {
  gpu: "DETECTING_GPU...",
  cpu: "CALCULATING_CORES...",
  ram: "READING_MEMORY...",
  connection: "PROBING_NETWORK...",
  platform: "RESOLVING_PLATFORM...",
  userAgent: "PARSING_UA_STRING...",
};

function detectGPU(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl || !(gl instanceof WebGLRenderingContext)) return "UNAVAILABLE";

    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (!ext) return "UNAVAILABLE";

    return gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "UNKNOWN";
  } catch {
    return "UNAVAILABLE";
  }
}

export function useSystemStats(): SystemStats {
  const [stats, setStats] = useState<SystemStats>(DEFAULTS);

  useEffect(() => {
    const gpu = detectGPU();

    const cores = navigator.hardwareConcurrency;
    const cpu = cores ? `${cores}-CORE` : "UNKNOWN";

    // @ts-ignore — deviceMemory is experimental (Chrome/Edge only)
    const mem: number | undefined = navigator.deviceMemory;
    const ram = mem ? `${mem} GB` : "UNKNOWN";

    let connection = "UNKNOWN";
    const conn = (navigator as unknown as Record<string, unknown>)
      .connection as
      | { effectiveType?: string; downlink?: number }
      | undefined;
    if (conn) {
      const parts: string[] = [];
      if (conn.effectiveType) parts.push(conn.effectiveType.toUpperCase());
      if (conn.downlink != null) parts.push(`${conn.downlink} Mbps`);
      if (parts.length) connection = parts.join(" / ");
    }

    const platform = navigator.platform || "UNKNOWN";
    const userAgent = navigator.userAgent || "UNKNOWN";

    setStats({ gpu, cpu, ram, connection, platform, userAgent });
  }, []);

  return stats;
}
