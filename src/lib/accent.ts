import type { Accent } from "@/lib/content";

/** Tailwind class fragments keyed by accent, for consistent theming. */
export const ACCENT = {
  cyan: {
    text: "text-cyan",
    border: "border-cyan/50",
    bg: "bg-cyan",
    glow: "shadow-[0_0_40px_-8px_var(--color-cyan)]",
    hex: "#00f0ff",
  },
  emerald: {
    text: "text-emerald",
    border: "border-emerald/50",
    bg: "bg-emerald",
    glow: "shadow-[0_0_40px_-8px_var(--color-emerald)]",
    hex: "#00e784",
  },
  pink: {
    text: "text-pink",
    border: "border-pink/50",
    bg: "bg-pink",
    glow: "shadow-[0_0_40px_-8px_var(--color-pink)]",
    hex: "#ff2b73",
  },
} as const satisfies Record<Accent, unknown>;
