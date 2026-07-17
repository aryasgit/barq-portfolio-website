"use client";

import { motion } from "motion/react";

const YEAR = 2026;

export function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-line bg-bg px-6 py-20 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl font-display text-4xl font-medium leading-[0.95] tracking-tight text-text md:text-6xl"
        >
          Built to move.
          <br />
          <span className="text-text-dim">Engineered to last.</span>
        </motion.h2>

        <div className="flex flex-col justify-between gap-8 border-t border-line pt-8 md:flex-row md:items-end">
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-text">
              Krish Agarwal
            </p>
            <p className="mt-1 max-w-xs text-sm text-text-dim">
              Quadruped robotics — design, kinematics, control and this
              interactive teardown.
            </p>
          </div>
          <div className="flex gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">
            <a href="#top" data-cursor className="transition-colors hover:text-text">
              Back to top
            </a>
            <a href="#lab" data-cursor className="transition-colors hover:text-text">
              Robot Lab
            </a>
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint">
          BARQ · v2.1 — {YEAR} · Built with React Three Fiber
        </p>
      </div>
    </footer>
  );
}
