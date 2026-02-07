"use client";

import { motion } from "framer-motion";

/*
 * Schematic DAG — a PCB-trace-style directed graph.
 *
 * Layout (rough positions inside a 480×340 viewBox):
 *
 *   [DATA]──────┐
 *               ├──[TRANSFORM]──[PIPELINE]
 *   [HDW]───────┤                   │
 *               │              [DEPLOY]
 *   [INFRA]─────┴──[COMPILE]───────┘
 *
 * Lines use right-angle bends (orthogonal routing) like real PCB traces.
 * "Active" paths are emerald or amber; inactive are faint slate.
 */

// ── Node definitions ────────────────────────────────────────────

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  active?: "accent" | "warning";
}

const nodes: Node[] = [
  // Source column
  { id: "data", label: "DATA", x: 40, y: 60, active: "accent" },
  { id: "hdw", label: "HDW", x: 40, y: 170 },
  { id: "infra", label: "INFRA", x: 40, y: 280, active: "warning" },
  // Process column
  { id: "transform", label: "TRANSFORM", x: 250, y: 100, active: "accent" },
  { id: "compile", label: "COMPILE", x: 250, y: 240 },
  // Output column
  { id: "pipeline", label: "PIPELINE", x: 420, y: 100, active: "accent" },
  { id: "deploy", label: "DEPLOY", x: 420, y: 240, active: "warning" },
];

// ── Edge definitions (orthogonal PCB-trace paths) ───────────────

interface Edge {
  id: string;
  d: string; // SVG path data
  active?: "accent" | "warning";
}

const edges: Edge[] = [
  // DATA → junction → TRANSFORM
  {
    id: "data-transform",
    d: "M 56,60 L 160,60 L 160,100 L 234,100",
    active: "accent",
  },
  // HDW → junction
  {
    id: "hdw-junction",
    d: "M 56,170 L 160,170",
  },
  // junction vertical (connecting DATA/HDW/INFRA junction)
  {
    id: "junction-vert",
    d: "M 160,60 L 160,280",
  },
  // junction → TRANSFORM (from HDW level)
  {
    id: "hdw-transform",
    d: "M 160,170 L 190,170 L 190,100 L 234,100",
  },
  // INFRA → junction → COMPILE
  {
    id: "infra-compile",
    d: "M 56,280 L 160,280 L 160,240 L 234,240",
    active: "warning",
  },
  // TRANSFORM → PIPELINE
  {
    id: "transform-pipeline",
    d: "M 330,100 L 404,100",
    active: "accent",
  },
  // COMPILE → DEPLOY
  {
    id: "compile-deploy",
    d: "M 330,240 L 404,240",
    active: "warning",
  },
  // PIPELINE → DEPLOY (vertical link on output side)
  {
    id: "pipeline-deploy",
    d: "M 420,116 L 420,224",
  },
];

// ── Animation variants ──────────────────────────────────────────

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.2, delay: 0.15 * i, ease: "easeInOut" as const },
      opacity: { duration: 0.3, delay: 0.15 * i },
    },
  }),
};

const nodeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: 0.8 + 0.1 * i,
      ease: "easeOut" as const,
    },
  }),
};

const labelVariants = {
  hidden: { opacity: 0, x: -4 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      delay: 1.0 + 0.1 * i,
    },
  }),
};

// ── Color helpers ───────────────────────────────────────────────

function strokeColor(active?: "accent" | "warning") {
  if (active === "accent") return "var(--color-accent)";
  if (active === "warning") return "var(--color-warning)";
  return "var(--color-border-bright)";
}

function strokeOpacity(active?: "accent" | "warning") {
  return active ? 0.7 : 0.3;
}

function fillColor(active?: "accent" | "warning") {
  if (active === "accent") return "var(--color-accent)";
  if (active === "warning") return "var(--color-warning)";
  return "var(--color-text-muted)";
}

// ── Component ───────────────────────────────────────────────────

export default function SchematicDAG() {
  return (
    <motion.svg
      viewBox="0 0 480 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-w-[480px]"
      initial="hidden"
      animate="visible"
    >
      {/* Edges */}
      {edges.map((edge, i) => (
        <motion.path
          key={edge.id}
          d={edge.d}
          stroke={strokeColor(edge.active)}
          strokeOpacity={strokeOpacity(edge.active)}
          strokeWidth={1}
          fill="none"
          variants={pathVariants}
          custom={i}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <g key={node.id}>
          {/* Node dot */}
          <motion.circle
            cx={node.x}
            cy={node.y}
            r={5}
            fill={fillColor(node.active)}
            fillOpacity={node.active ? 0.9 : 0.4}
            variants={nodeVariants}
            custom={i}
          />

          {/* Outer ring for active nodes */}
          {node.active && (
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={9}
              stroke={fillColor(node.active)}
              strokeOpacity={0.25}
              strokeWidth={1}
              fill="none"
              variants={nodeVariants}
              custom={i}
            />
          )}

          {/* Label */}
          <motion.text
            x={node.x}
            y={node.y - 16}
            textAnchor="middle"
            fill={node.active ? fillColor(node.active) : "var(--color-text-muted)"}
            fillOpacity={node.active ? 0.8 : 0.5}
            fontSize={10}
            fontFamily="var(--font-mono)"
            letterSpacing="0.05em"
            variants={labelVariants}
            custom={i}
          >
            {node.label}
          </motion.text>
        </g>
      ))}
    </motion.svg>
  );
}
