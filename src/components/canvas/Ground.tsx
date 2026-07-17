"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Group } from "three";
import { Grid } from "@react-three/drei";
import { ENV_MAP } from "@/lib/environments";
import { useApp } from "@/lib/store";
import { damp } from "@/lib/utils";

/**
 * The lab terrain: an infinite fading grid that eases in when the Robot Lab is
 * active and recolours per environment. Sits just below the robot's feet.
 */
export function Ground() {
  const labActive = useApp((s) => s.labActive);
  const env = useApp((s) => s.env);
  const def = ENV_MAP[env];
  const group = useRef<Group>(null);
  const opacity = useRef(0);

  useFrame((_, delta) => {
    if (!group.current) return;
    opacity.current = damp(opacity.current, labActive ? 1 : 0, 4, Math.min(delta, 0.05));
    group.current.visible = opacity.current > 0.01;
    group.current.scale.setScalar(0.9 + opacity.current * 0.1);
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <Grid
        args={[10, 10]}
        cellSize={0.1}
        cellThickness={0.6}
        cellColor={new Color(def.grid)}
        sectionSize={0.5}
        sectionThickness={1.1}
        sectionColor={new Color(def.grid)}
        fadeDistance={4}
        fadeStrength={2}
        infiniteGrid
        followCamera={false}
      />
    </group>
  );
}
