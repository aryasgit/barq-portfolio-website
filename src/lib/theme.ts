import type { EnvId } from "@/lib/store";

/**
 * A complete semantic token set. Every environment supplies one; the whole
 * interface reads these CSS variables, so switching environment re-themes the
 * entire UI — not just the 3D background.
 */
export interface ThemeTokens {
  bg: string;
  surface: string;
  surfaceEl: string; // elevated surface
  overlay: string;
  text: string;
  text2: string; // secondary
  textMuted: string;
  accent: string;
  success: string;
  warning: string;
  selection: string;
  hover: string;
  active: string;
  border: string;
  borderStrong: string;
  glow: string; // accent glow (rgba)
  shadow: string; // ambient shadow (rgba)
  /** UI mood: dark chrome or light chrome (drives a few conditional styles). */
  scheme: "dark" | "light";
}

export const THEMES: Record<EnvId, ThemeTokens> = {
  studio: {
    bg: "#060607",
    surface: "#0e0f12",
    surfaceEl: "#16181c",
    overlay: "rgba(8,8,10,0.82)",
    text: "#f6f6f6",
    text2: "#8d8d96",
    textMuted: "#55555c",
    accent: "#00f0ff",
    success: "#00e784",
    warning: "#ffb020",
    selection: "#00f0ff",
    hover: "rgba(255,255,255,0.06)",
    active: "rgba(255,255,255,0.10)",
    border: "rgba(255,255,255,0.08)",
    borderStrong: "rgba(255,255,255,0.16)",
    glow: "rgba(0,240,255,0.5)",
    shadow: "rgba(0,0,0,0.6)",
    scheme: "dark",
  },
  research: {
    bg: "#eef1f5",
    surface: "#ffffff",
    surfaceEl: "#f4f6f9",
    overlay: "rgba(255,255,255,0.82)",
    text: "#14171c",
    text2: "#4a5160",
    textMuted: "#8a92a0",
    accent: "#0a84ff",
    success: "#12b76a",
    warning: "#f79009",
    selection: "#0a84ff",
    hover: "rgba(0,0,0,0.04)",
    active: "rgba(0,0,0,0.08)",
    border: "rgba(20,23,28,0.10)",
    borderStrong: "rgba(20,23,28,0.20)",
    glow: "rgba(10,132,255,0.30)",
    shadow: "rgba(20,30,50,0.14)",
    scheme: "light",
  },
  concrete: {
    bg: "#17171a",
    surface: "#202024",
    surfaceEl: "#2a2a2f",
    overlay: "rgba(15,15,17,0.84)",
    text: "#ededed",
    text2: "#a0a0a6",
    textMuted: "#6a6a70",
    accent: "#ff7a1a",
    success: "#c3d600",
    warning: "#ffcf3a",
    selection: "#ff7a1a",
    hover: "rgba(255,255,255,0.05)",
    active: "rgba(255,255,255,0.10)",
    border: "rgba(255,255,255,0.09)",
    borderStrong: "rgba(255,255,255,0.18)",
    glow: "rgba(255,122,26,0.42)",
    shadow: "rgba(0,0,0,0.62)",
    scheme: "dark",
  },
  grass: {
    bg: "#0f1712",
    surface: "#182117",
    surfaceEl: "#212c1e",
    overlay: "rgba(12,18,12,0.80)",
    text: "#f2f5ee",
    text2: "#a8b39c",
    textMuted: "#6f7a64",
    accent: "#7ac74f",
    success: "#9bd458",
    warning: "#e8b04b",
    selection: "#7ac74f",
    hover: "rgba(255,255,255,0.05)",
    active: "rgba(255,255,255,0.10)",
    border: "rgba(200,230,180,0.11)",
    borderStrong: "rgba(200,230,180,0.22)",
    glow: "rgba(122,199,79,0.40)",
    shadow: "rgba(20,30,15,0.5)",
    scheme: "dark",
  },
  warehouse: {
    bg: "#0b0a09",
    surface: "#151311",
    surfaceEl: "#1e1a16",
    overlay: "rgba(8,7,6,0.85)",
    text: "#e6e2da",
    text2: "#9a9086",
    textMuted: "#635c53",
    accent: "#ffab40",
    success: "#7bd88f",
    warning: "#ffca4d",
    selection: "#ffab40",
    hover: "rgba(255,255,255,0.04)",
    active: "rgba(255,255,255,0.08)",
    border: "rgba(255,240,220,0.08)",
    borderStrong: "rgba(255,240,220,0.16)",
    glow: "rgba(255,171,64,0.36)",
    shadow: "rgba(0,0,0,0.7)",
    scheme: "dark",
  },
  night: {
    bg: "#040409",
    surface: "#0a0d12",
    surfaceEl: "#10141c",
    overlay: "rgba(4,6,10,0.86)",
    text: "#dfe8ea",
    text2: "#7a8b8e",
    textMuted: "#48565a",
    accent: "#00f0ff",
    success: "#00e784",
    warning: "#ffcf3a",
    selection: "#00f0ff",
    hover: "rgba(0,240,255,0.06)",
    active: "rgba(0,240,255,0.12)",
    border: "rgba(0,240,255,0.10)",
    borderStrong: "rgba(0,240,255,0.20)",
    glow: "rgba(0,240,255,0.5)",
    shadow: "rgba(0,0,0,0.75)",
    scheme: "dark",
  },
  blueprint: {
    bg: "#0a3a5e",
    surface: "#0d4571",
    surfaceEl: "#115081",
    overlay: "rgba(7,42,69,0.85)",
    text: "#eaf4ff",
    text2: "#a9cbe6",
    textMuted: "#6f9cc0",
    accent: "#7fdbff",
    success: "#9be7c4",
    warning: "#ffd27a",
    selection: "#7fdbff",
    hover: "rgba(255,255,255,0.07)",
    active: "rgba(255,255,255,0.14)",
    border: "rgba(180,220,255,0.24)",
    borderStrong: "rgba(180,220,255,0.44)",
    glow: "rgba(127,219,255,0.5)",
    shadow: "rgba(0,20,40,0.5)",
    scheme: "dark",
  },
};

export const TOKEN_KEYS = Object.keys(THEMES.studio).filter(
  (k) => k !== "scheme",
) as (keyof Omit<ThemeTokens, "scheme">)[];
