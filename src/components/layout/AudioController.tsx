"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/lib/store";

/**
 * Procedural ambience — a soft, distant drone built from two detuned sines
 * through a low-pass filter. No audio assets; starts only on user unmute (a
 * genuine gesture) and fades cleanly. Deliberately very quiet.
 */
export function AudioController() {
  const muted = useApp((s) => s.muted);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (muted) {
      // Fade out and suspend.
      const ctx = ctxRef.current;
      const gain = gainRef.current;
      if (ctx && gain) {
        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
      }
      return;
    }

    // Lazily build the graph on first unmute.
    let ctx = ctxRef.current;
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
      ctxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);
      gainRef.current = gain;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 380;
      filter.Q.value = 0.6;
      filter.connect(gain);

      [55, 82.4].forEach((freq, i) => {
        const osc = ctx!.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.detune.value = i === 0 ? -4 : 6;
        const oGain = ctx!.createGain();
        oGain.gain.value = i === 0 ? 0.8 : 0.5;
        osc.connect(oGain).connect(filter);
        osc.start();
      });
    }

    void ctx.resume();
    const gain = gainRef.current;
    if (gain) {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(0.035, ctx.currentTime, 0.6);
    }
  }, [muted]);

  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  return null;
}
