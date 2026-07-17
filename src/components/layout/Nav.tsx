"use client";

import { motion } from "motion/react";
import { useApp } from "@/lib/store";

export function Nav() {
  const booted = useApp((s) => s.booted);
  const muted = useApp((s) => s.muted);
  const toggleMuted = useApp((s) => s.toggleMuted);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: booted ? 1 : 0, y: booted ? 0 : -12 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-12"
    >
      <a href="#top" data-cursor className="flex items-center gap-2">
        <span className="font-display text-lg font-semibold tracking-tight text-text">
          BARQ
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--glow)]" />
      </a>

      <nav className="hidden gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim md:flex">
        <a href="#teardown" data-cursor className="transition-colors hover:text-text">
          Teardown
        </a>
        <a href="#lab" data-cursor className="transition-colors hover:text-text">
          Lab
        </a>
        <a href="#hardware" data-cursor className="transition-colors hover:text-text">
          Hardware
        </a>
      </nav>

      <button
        onClick={toggleMuted}
        data-cursor
        aria-label={muted ? "Unmute ambience" : "Mute ambience"}
        className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim transition-colors hover:text-text"
      >
        <span className="flex h-3 items-end gap-[2px]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[2px] bg-current"
              style={{
                height: muted ? 3 : [8, 12, 6][i],
                transition: "height .3s",
              }}
            />
          ))}
        </span>
        {muted ? "Sound off" : "Sound on"}
      </button>
    </motion.header>
  );
}
