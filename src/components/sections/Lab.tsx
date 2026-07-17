"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PoseInfoPanel } from "./PoseInfoPanel";
import { ENVIRONMENTS } from "@/lib/environments";
import { GAITS, POSE_MAP } from "@/lib/robot-config";
import { useApp, type MotionMode } from "@/lib/store";
import { cn } from "@/lib/utils";

const POSE_CONTROLS: { id: string; label: string }[] = [
  { id: "idle", label: "Idle" },
  { id: "neutral", label: "Neutral" },
  { id: "stand", label: "Stand" },
  { id: "high-stand", label: "High Stand" },
  { id: "low-crawl", label: "Low Crawl" },
  { id: "sit", label: "Sit" },
  { id: "rest", label: "Rest" },
  { id: "lie", label: "Lie Down" },
  { id: "power-off", label: "Power Off" },
  { id: "wake-up", label: "Wake Up" },
  { id: "calibration", label: "Calibration" },
  { id: "stretch", label: "Stretch" },
  { id: "play-bow", label: "Play Bow" },
  { id: "greeting", label: "Greeting" },
  { id: "ready", label: "Ready" },
  { id: "alert", label: "Alert" },
  { id: "inspection", label: "Inspection" },
  { id: "recovery", label: "Recovery" },
  { id: "balance-test", label: "Balance Test" },
  { id: "walk-ready", label: "Walk Ready" },
  { id: "trot-ready", label: "Trot Ready" },
  { id: "run-ready", label: "Run Ready" },
];

const motionKey = (m: MotionMode) =>
  m.kind === "gait" ? `gait:${m.id}` : `${m.kind}:${m.id}`;

type Tab = "pose" | "motion" | "env";

/**
 * The interactive sandbox. A compact, tabbed, collapsible console keeps the
 * robot the hero — only one control group shows at a time, and the whole
 * console folds to a single bar so nothing obstructs the view. Touch-friendly:
 * the overlay is click-through except the panel, so drags reach orbit controls.
 */
export function Lab() {
  const ref = useRef<HTMLElement>(null);
  const motion0 = useApp((s) => s.motion);
  const setMotion = useApp((s) => s.setMotion);
  const gaitSpeed = useApp((s) => s.gaitSpeed);
  const setGaitSpeed = useApp((s) => s.setGaitSpeed);
  const env = useApp((s) => s.env);
  const setEnv = useApp((s) => s.setEnv);
  const setLabActive = useApp((s) => s.setLabActive);

  const [tab, setTab] = useState<Tab>("pose");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setLabActive(e.isIntersecting),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      setLabActive(false);
    };
  }, [setLabActive]);

  const active = motionKey(motion0);
  const turn = motion0.kind === "gait" ? motion0.turn : 0;
  const currentGait = motion0.kind === "gait" ? motion0.id : "walk";
  const setGait = (id: string, t: -1 | 0 | 1 = 0) => setMotion({ kind: "gait", id, turn: t });

  // Short status shown in the console header.
  const statusLabel =
    motion0.kind === "pose"
      ? (POSE_MAP[motion0.id]?.label ?? motion0.id)
      : motion0.kind === "gait"
        ? `${GAITS.find((g) => g.id === motion0.id)?.label ?? motion0.id}${turn ? (turn < 0 ? " · Left" : " · Right") : ""}`
        : motion0.id === "wave"
          ? "Wave"
          : "Balance";

  return (
    <section
      ref={ref}
      id="lab"
      className="pointer-events-none relative min-h-[135svh] w-full"
    >
      <PoseInfoPanel />

      {/* Heading rides in at the top of the lab. */}
      <div className="pointer-events-none px-6 pt-24 md:px-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-20% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-xs uppercase tracking-[0.4em] text-emerald"
        >
          06 · Robot Lab
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-20% 0px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="mt-4 max-w-xl font-display text-4xl font-medium leading-[0.95] tracking-tight md:text-6xl"
        >
          Take the controls.
        </motion.h2>
        <p className="mt-4 max-w-sm text-sm text-text-dim">
          Drag to orbit, pinch or scroll to zoom, then drive the robot live —
          poses, gaits and demos across seven environments.
        </p>
      </div>

      {/* Compact, collapsible control console pinned to the bottom. */}
      <div className="pointer-events-none sticky bottom-4 mt-[62svh] flex justify-center px-3 md:bottom-6 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-8% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-[var(--overlay)] shadow-[0_20px_60px_var(--shadow)] backdrop-blur-xl"
        >
          {/* Header: tabs + live status + collapse */}
          <div className="flex items-center gap-2 px-3 py-2.5 md:px-4">
            <div className="flex gap-1 rounded-lg bg-[var(--active)] p-1">
              {(["pose", "motion", "env"] as Tab[]).map((t) => (
                <button
                  key={t}
                  data-cursor
                  onClick={() => {
                    setTab(t);
                    setOpen(true);
                  }}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors md:text-[11px]",
                    tab === t && open
                      ? "bg-[var(--surface-el)] text-text"
                      : "text-text-dim hover:text-text",
                  )}
                >
                  {t === "pose" ? "Poses" : t === "motion" ? "Motion" : "Env"}
                </button>
              ))}
            </div>

            <div className="ml-auto flex min-w-0 items-center gap-2">
              <span className="hidden truncate font-mono text-[10px] uppercase tracking-widest text-text-dim sm:inline">
                <span className="text-[var(--accent)]">▶</span> {statusLabel}
              </span>
              <button
                data-cursor
                aria-label={open ? "Collapse controls" : "Expand controls"}
                onClick={() => setOpen((o) => !o)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-text-dim transition-colors hover:text-text"
              >
                <span className={cn("transition-transform", open ? "rotate-0" : "rotate-180")}>
                  ▾
                </span>
              </button>
            </div>
          </div>

          {/* Body */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-line"
              >
                <div className="p-3 md:p-4">
                  {tab === "pose" && (
                    <div className="scroll-thin flex max-h-[26svh] flex-wrap gap-2 overflow-y-auto md:max-h-[30svh]">
                      {POSE_CONTROLS.map((p) => (
                        <MagneticButton
                          key={p.id}
                          accent="cyan"
                          strength={0.2}
                          active={active === `pose:${p.id}`}
                          onClick={() => setMotion({ kind: "pose", id: p.id })}
                        >
                          {p.label}
                        </MagneticButton>
                      ))}
                    </div>
                  )}

                  {tab === "motion" && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {GAITS.map((g) => (
                          <MagneticButton
                            key={g.id}
                            accent="emerald"
                            strength={0.2}
                            active={active === `gait:${g.id}`}
                            onClick={() => setGait(g.id, turn)}
                          >
                            {g.label}
                          </MagneticButton>
                        ))}
                        <MagneticButton
                          accent="emerald"
                          strength={0.2}
                          active={active === "demo:wave"}
                          onClick={() => setMotion({ kind: "demo", id: "wave" })}
                        >
                          Wave
                        </MagneticButton>
                        <MagneticButton
                          accent="emerald"
                          strength={0.2}
                          active={active === "demo:balance"}
                          onClick={() => setMotion({ kind: "demo", id: "balance" })}
                        >
                          Balance
                        </MagneticButton>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-3">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-text-faint">
                          Turn
                        </span>
                        <MagneticButton
                          accent="pink"
                          strength={0.2}
                          active={turn === -1}
                          onClick={() => setGait(currentGait, turn === -1 ? 0 : -1)}
                        >
                          ‹ Left
                        </MagneticButton>
                        <MagneticButton
                          accent="pink"
                          strength={0.2}
                          active={turn === 1}
                          onClick={() => setGait(currentGait, turn === 1 ? 0 : 1)}
                        >
                          Right ›
                        </MagneticButton>

                        <label className="flex flex-1 items-center gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-text-faint">
                            Speed
                          </span>
                          <input
                            type="range"
                            min={0.3}
                            max={2.5}
                            step={0.1}
                            value={gaitSpeed}
                            onChange={(e) => setGaitSpeed(parseFloat(e.target.value))}
                            data-cursor
                            className="h-1 min-w-16 flex-1 appearance-none rounded-full bg-line accent-emerald"
                          />
                          <span className="w-9 text-right font-mono text-[11px] text-text-dim">
                            {gaitSpeed.toFixed(1)}×
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {tab === "env" && (
                    <div className="flex flex-wrap gap-2">
                      {ENVIRONMENTS.map((e) => (
                        <button
                          key={e.id}
                          data-cursor
                          onClick={() => setEnv(e.id)}
                          className={cn(
                            "rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
                            env === e.id
                              ? "border-[var(--accent)] bg-[var(--active)] text-[var(--accent)]"
                              : "border-line text-text-dim hover:text-text",
                          )}
                        >
                          {e.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
