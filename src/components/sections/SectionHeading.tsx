"use client";

import { motion } from "motion/react";
import type { Accent } from "@/lib/content";
import { cn } from "@/lib/utils";

const accentText = { cyan: "text-cyan", emerald: "text-emerald", pink: "text-pink" };

/** Shared eyebrow + title header used across the content sections. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  sub,
  accent = "cyan",
  className,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  accent?: Accent;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn("mb-4 font-mono text-xs uppercase tracking-[0.4em]", accentText[accent])}
      >
        {index} · {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="font-display text-4xl font-medium leading-[0.95] tracking-tight text-text md:text-6xl"
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          className="mt-5 max-w-xl text-balance text-sm leading-relaxed text-text-dim md:text-base"
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}
