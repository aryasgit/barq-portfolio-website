"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, OrbitControls, Preload } from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import type { ComponentRef } from "react";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";
import { EnvController } from "./EnvController";
import { Ground } from "./Ground";
import { Lighting } from "./Lighting";
import { Particles } from "./Particles";
import { Robot } from "./Robot";
import { Teardown3D } from "./Teardown3D";
import { useApp } from "@/lib/store";

function LabControls() {
  const labActive = useApp((s) => s.labActive);
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);

  // Frame the whole robot each time the lab opens, resetting the orbit state.
  useEffect(() => {
    if (!labActive) return;
    const id = requestAnimationFrame(() => {
      const c = controls.current;
      if (!c) return;
      c.object.position.set(0.6, 0.24, 0.7);
      c.target.set(0, 0.13, 0);
      c.update();
    });
    return () => cancelAnimationFrame(id);
  }, [labActive]);

  if (!labActive) return null;
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={[0, 0.12, 0]}
      enablePan={false}
      minDistance={0.4}
      maxDistance={2.2}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2 - 0.05}
      enableDamping
      dampingFactor={0.08}
    />
  );
}

/**
 * The single persistent WebGL scene shared across the whole experience.
 * Fixed behind the DOM content; sections drive it through the store.
 */
export function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0.62, 0.34, 0.72], fov: 38, near: 0.01, far: 100 }}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#050505", 1);
      }}
    >
      <Suspense fallback={null}>
        <Lighting />
        <EnvController />
        <Robot />
        <Teardown3D />
        <Ground />
        <Particles />
        <CameraRig />
        <LabControls />
        <Effects />
        <Preload all />
      </Suspense>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
