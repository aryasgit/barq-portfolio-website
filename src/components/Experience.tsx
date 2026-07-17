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
import { Performance } from "@/components/sections/Performance";
import { Hardware } from "@/components/sections/Hardware";
import { Software } from "@/components/sections/Software";
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
          body="Four identical legs, each a three-joint serial chain — hip abduction, knee and ankle. Every link is described in a single URDF that the browser assembles in real time, joint limits and all."
          stats={[
            { label: "Legs", value: "4" },
            { label: "Joints / leg", value: "3" },
            { label: "Total DOF", value: "12" },
            { label: "Encoders", value: "14-bit" },
          ]}
        />

        <StorySection
          index={2}
          eyebrow="Actuation"
          accent="emerald"
          align="right"
          title={
            <>
              Direct-drive
              <br />
              torque.
            </>
          }
          body="Each joint is a BLDC actuator with a planetary reduction and magnetic absolute encoder — 10 N·m of peak torque and 5.24 rad/s of travel, enough for dynamic gaits and hard landings."
          stats={[
            { label: "Peak torque", value: "10 N·m" },
            { label: "Max vel", value: "5.24 rad/s" },
            { label: "Range", value: "±90°" },
            { label: "Damping", value: "0.05" },
          ]}
        />

        <StorySection
          index={3}
          eyebrow="Chassis"
          accent="pink"
          title={<>A monocoque brain-case.</>}
          body="The central shell carries the compute, IMU and power distribution inside a rib-stiffened monocoque — 0.95 kg of structure tuned for torsional stiffness and a low, stable centre of mass."
          stats={[
            { label: "Body mass", value: "0.95 kg" },
            { label: "Footprint", value: "258 mm" },
            { label: "Material", value: "PA12" },
            { label: "IMU", value: "6-axis" },
          ]}
        />

        <Exploded />
        <Blueprint />
        <Lab />
        <Performance />
        <Hardware />
        <Software />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
