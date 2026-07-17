"use client";

import dynamic from "next/dynamic";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Nav } from "@/components/layout/Nav";
import { AudioController } from "@/components/layout/AudioController";
import { ThemeController } from "@/components/layout/ThemeController";
import { Cursor } from "@/components/ui/Cursor";
import { Grain } from "@/components/ui/Grain";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Boot } from "@/components/sections/Boot";
import { Hero } from "@/components/sections/Hero";
import { StorySection } from "@/components/sections/StorySection";
import { Exploded } from "@/components/sections/Exploded";
import { Blueprint } from "@/components/sections/Blueprint";
import { Lab } from "@/components/sections/Lab";
import { Pipeline } from "@/components/sections/Pipeline";
import { Highlights } from "@/components/sections/Highlights";
import { Hardware } from "@/components/sections/Hardware";
import { Software } from "@/components/sections/Software";
import { Capabilities } from "@/components/sections/Capabilities";
import { Footer } from "@/components/layout/Footer";

// The WebGL scene is client-only; never render it on the server.
const Scene = dynamic(() => import("@/components/canvas/Scene").then((m) => m.Scene), {
  ssr: false,
});

/**
 * Top-level composition: one persistent canvas fixed behind the scrolling
 * narrative. Overlays (grain, cursor, nav, boot) sit above it.
 */
export function Experience() {
  return (
    <SmoothScroll>
      <div id="top" className="fixed inset-0 z-0">
        <Scene />
      </div>

      <ThemeController />
      <Grain />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <AudioController />
      <Boot />

      <main className="relative z-10">
        <Hero />

        <StorySection
          index={1}
          eyebrow="Kinematics"
          accent="cyan"
          title={<>Twelve degrees of freedom.</>}
          body="Four legs, each a three-joint serial chain — hip (coxa), upper leg (femur) and lower leg (tibia). The whole mechanical hierarchy lives in a single URDF that the browser assembles in real time, joint limits and all — the same file that drives simulation."
          stats={[
            { label: "Legs", value: "4" },
            { label: "Joints / leg", value: "3" },
            { label: "Total DOF", value: "12" },
            { label: "CAD", value: "Fusion 360" },
          ]}
        />

        <StorySection
          index={2}
          eyebrow="Actuation"
          accent="emerald"
          align="right"
          title={
            <>
              Twelve joints,
              <br />
              one control path.
            </>
          }
          body="Each joint is a DS3240MG high-torque digital servo, driven over PWM through a PCA9685 controller. A calibration pipeline and joint-level software abstraction mean every servo is commanded the same way — pose and gait targets, not raw pulses."
          stats={[
            { label: "Servos", value: "12 × DS3240MG" },
            { label: "Driver", value: "PCA9685" },
            { label: "Signal", value: "PWM" },
            { label: "Hip range", value: "±45°" },
          ]}
        />

        <StorySection
          index={3}
          eyebrow="Structure"
          accent="pink"
          title={<>Designed to be iterated.</>}
          body="Every structural component was modelled in Fusion 360 and optimised for 3D printing, modularity and ease of maintenance. The central body carries the compute, IMU and power distribution — a platform built to be taken apart and improved."
          stats={[
            { label: "Structure", value: "3D-printed" },
            { label: "CAD", value: "Fusion 360" },
            { label: "Legs", value: "Modular" },
            { label: "Source", value: "URDF" },
          ]}
        />

        <Exploded />
        <Blueprint />
        <Lab />
        <Pipeline />
        <Highlights />
        <Hardware />
        <Software />
        <Capabilities />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
