"use client";

import { motion } from "motion/react";
import { SectionHeading } from "./SectionHeading";
import { CountUp } from "@/components/ui/CountUp";
import { ACCENT } from "@/lib/accent";
import { METRICS } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Performance() {
  return (
    <section
      id="performance"
      className="relative z-10 w-full bg-bg-secondary px-6 py-28 md:px-12"
    >
      <SectionHeading
        index="07"
        eyebrow="Performance"
        accent="emerald"
        title={<>Numbers that hold under load.</>}
        sub="Real-time control at a kilohertz, single-digit-millisecond reflexes and the torque headroom for dynamic gaits."
      />

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
        {METRICS.map((m, i) => {
          const a = ACCENT[m.accent];
          const decimals = m.value % 1 === 0 ? 0 : 1;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">
                  {m.label}
                </span>
                <span className="font-display text-2xl font-medium text-text">
                  <CountUp value={m.value} decimals={decimals} />
                  <span className="ml-1 text-sm text-text-faint">{m.unit}</span>
                </span>
              </div>
              <div className="mt-3 h-px w-full overflow-hidden bg-line">
                <motion.div
                  className={cn("h-full", a.bg)}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: m.fill }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
