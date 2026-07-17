"use client";

import { motion } from "motion/react";
import { SectionHeading } from "./SectionHeading";
import { ACCENT } from "@/lib/accent";
import { HIGHLIGHTS } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The platform's defining traits — each card names a capability and, more
 * importantly, why it exists. No specs, no claims: engineering rationale.
 */
export function Highlights() {
  return (
    <section id="highlights" className="relative z-10 w-full bg-bg-secondary px-6 py-28 md:px-12">
      <SectionHeading
        index="08"
        eyebrow="Technical Highlights"
        accent="pink"
        title={<>Why it’s built the way it is.</>}
        sub="Twelve deliberate decisions — from the URDF single-source-of-truth to real hardware validation."
      />

      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {HIGHLIGHTS.map((h, i) => {
          const a = ACCENT[h.accent];
          return (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-xl border border-line bg-bg p-5 transition-colors hover:border-line-strong"
            >
              <div className="flex items-center gap-2">
                <span className={cn("h-1.5 w-1.5 rounded-full", a.bg)} />
                <h3 className="font-display text-base font-medium tracking-tight text-text">
                  {h.title}
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-text-dim">{h.why}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
