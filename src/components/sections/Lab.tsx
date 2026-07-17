"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ENVIRONMENTS } from "@/lib/environments";
import { GAITS } from "@/lib/robot-config";
import { useApp, type MotionMode } from "@/lib/store";
import { cn } from "@/lib/utils";

const POSE_CONTROLS: { id: string; label: string }[] = [
  { id: "idle", label: "Idle" },
  { id: "stand", label: "Stand" },
  { id: "sit", label: "Sit" },
  { id: "stretch", label: "Stretch" },
  { id: "bow", label: "Bow" },
  { id: "lie", label: "Lie Down" },
];

const motionKey = (m: MotionMode) =>
  m.kind === "gait" ? `gait:${m.id}` : `${m.kind}:${m.id}`;

/**
 * The interactive sandbox. Orbit the robot on live terrain and drive it through
 * poses, gaits and demos while switching rendering environments. The overlay is
 * click-through except for the panel so drags reach the WebGL orbit controls.
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

  // Activate lab mode (orbit controls + terrain) while the section is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setLabActive(e.isIntersecting),
      { threshold: 0.35 },
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

  const setGait = (id: string, t: -1 | 0 | 1 = 0) =>
    setMotion({ kind: "gait", id, turn: t });

  return (
    <section
      ref={ref}
      id="lab"
      className="pointer-events-none relative min-h-[130svh] w-full"
    >
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
          Orbit the robot and drive it live — poses, gaits and balance demos,
          across seven rendering environments.
        </p>
      </div>

      {/* Sticky control console. */}
      <div className="pointer-events-none sticky bottom-6 mt-[52svh] flex justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full max-w-3xl rounded-2xl border border-line bg-[#0b0b0d]/80 p-4 backdrop-blur-xl md:p-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {/* Poses */}
            <ControlGroup label="Pose">
              {POSE_CONTROLS.map((p) => (
                <MagneticButton
                  key={p.id}
                  accent="cyan"
                  active={active === `pose:${p.id}`}
                  onClick={() => setMotion({ kind: "pose", id: p.id })}
                >
                  {p.label}
                </MagneticButton>
              ))}
              <MagneticButton
                accent="cyan"
                active={false}
                onClick={() => setMotion({ kind: "pose", id: "stand" })}
              >
                Recover
              </MagneticButton>
            </ControlGroup>

            {/* Gaits + demos */}
            <ControlGroup label="Locomotion">
              {GAITS.map((g) => (
                <MagneticButton
                  key={g.id}
                  accent="emerald"
                  active={active === `gait:${g.id}`}
                  onClick={() => setGait(g.id, turn)}
                >
                  {g.label}
                </MagneticButton>
              ))}
              <MagneticButton
                accent="emerald"
                active={active === "demo:wave"}
                onClick={() => setMotion({ kind: "demo", id: "wave" })}
              >
                Wave
              </MagneticButton>
              <MagneticButton
                accent="emerald"
                active={active === "demo:balance"}
                onClick={() => setMotion({ kind: "demo", id: "balance" })}
              >
                Balance
              </MagneticButton>
            </ControlGroup>
          </div>

          {/* Turn + speed */}
          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-faint">
                Turn
              </span>
              <MagneticButton
                accent="pink"
                active={turn === -1}
                onClick={() => setGait(currentGait, turn === -1 ? 0 : -1)}
              >
                ‹ Left
              </MagneticButton>
              <MagneticButton
                accent="pink"
                active={turn === 1}
                onClick={() => setGait(currentGait, turn === 1 ? 0 : 1)}
              >
                Right ›
              </MagneticButton>
            </div>

            <label className="flex flex-1 items-center gap-3">
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
                className="h-1 flex-1 cursor-none appearance-none rounded-full bg-line accent-emerald"
              />
              <span className="w-10 text-right font-mono text-[11px] text-text-dim">
                {gaitSpeed.toFixed(1)}×
              </span>
            </label>
          </div>

          {/* Environments */}
          <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
            <span className="mr-1 self-center font-mono text-[10px] uppercase tracking-widest text-text-faint">
              Env
            </span>
            {ENVIRONMENTS.map((e) => (
              <button
                key={e.id}
                data-cursor
                onClick={() => setEnv(e.id)}
                className={cn(
                  "rounded-md border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
                  env === e.id
                    ? "border-cyan/60 bg-white/[0.04] text-cyan"
                    : "border-line text-text-dim hover:text-text",
                )}
              >
                {e.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ControlGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-text-faint">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}