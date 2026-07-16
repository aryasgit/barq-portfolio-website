"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useApp } from "@/lib/store";

/**
 * Lenis smooth scrolling. Publishes normalized scroll progress to the store so
 * the camera rig and sections can react. Respects reduced-motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const setScroll = useApp((s) => s.setScroll);

  useEffect(() => {
    // Always start at the top; never restore a previous scroll position.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.scrollTo(0, { immediate: true });
    lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
      setScroll(limit > 0 ? scroll / limit : 0);
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [setScroll]);

  return <>{children}</>;
}
