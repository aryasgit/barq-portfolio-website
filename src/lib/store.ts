"use client";

import { create } from "zustand";

export type EnvId =
  | "studio"
  | "concrete"
  | "grass"
  | "warehouse"
  | "wireframe"
  | "blueprint"
  | "night";

export type MotionMode =
  | { kind: "pose"; id: string }
  | { kind: "gait"; id: string; turn: -1 | 0 | 1 };

interface AppState {
  /* Loading */
  ready: boolean;
  progress: number;
  setProgress: (p: number) => void;
  setReady: (r: boolean) => void;

  /* Boot / intro */
  booted: boolean;
  setBooted: (b: boolean) => void;

  /* Scroll-driven narrative (0..1 across the whole page) */
  scroll: number;
  setScroll: (s: number) => void;
  /** Index of the active narrative section for the camera rig. */
  section: number;
  setSection: (i: number) => void;

  /* Exploded teardown */
  exploded: number; // 0..1 spring target
  setExploded: (v: number) => void;
  hoveredPart: string | null;
  setHoveredPart: (id: string | null) => void;

  /* Robot lab */
  labActive: boolean;
  setLabActive: (v: boolean) => void;
  motion: MotionMode;
  setMotion: (m: MotionMode) => void;
  gaitSpeed: number;
  setGaitSpeed: (v: number) => void;
  env: EnvId;
  setEnv: (e: EnvId) => void;

  /* Audio */
  muted: boolean;
  toggleMuted: () => void;
}

export const useApp = create<AppState>((set) => ({
  ready: false,
  progress: 0,
  setProgress: (p) => set({ progress: p }),
  setReady: (r) => set({ ready: r }),

  booted: false,
  setBooted: (b) => set({ booted: b }),

  scroll: 0,
  setScroll: (s) => set({ scroll: s }),
  section: 0,
  setSection: (i) => set({ section: i }),

  exploded: 0,
  setExploded: (v) => set({ exploded: v }),
  hoveredPart: null,
  setHoveredPart: (id) => set({ hoveredPart: id }),

  labActive: false,
  setLabActive: (v) => set({ labActive: v }),
  motion: { kind: "pose", id: "idle" },
  setMotion: (m) => set({ motion: m }),
  gaitSpeed: 1,
  setGaitSpeed: (v) => set({ gaitSpeed: v }),
  env: "studio",
  setEnv: (e) => set({ env: e }),

  muted: true,
  toggleMuted: () => set((s) => ({ muted: !s.muted })),
}));
