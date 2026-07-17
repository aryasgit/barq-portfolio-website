"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Group } from "three";
import { Grid, MeshReflectorMaterial } from "@react-three/drei";
import { ENV_MAP } from "@/lib/environments";
import { useApp } from "@/lib/store";
import { damp } from "@/lib/utils";

/**
 * The floor the robot always stands on. Per environment it becomes a soft
 * reflective studio sweep, a matte solid surface, or a technical blueprint
 * grid. Eases in once the robot is ready and recolours on environment change.
 */
export function Ground() {
  const ready = useApp((s) => s.ready);
  const env = useApp((s) => s.env);
  const def = ENV_MAP[env];
  const group = useRef<Group>(null);
  const opacity = useRef(0);

  useFrame((_, delta) => {
    if (!group.current) return;
    opacity.current = damp(opacity.current, ready ? 1 : 0, 3, Math.min(delta, 0.05));
    group.current.visible = opacity.current > 0.01;
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {def.floor === "grid" ? (
        <Grid
          args={[12, 12]}
          cellSize={0.1}
          cellThickness={0.6}
          cellColor={new Color(def.grid)}
          sectionSize={0.5}
          sectionThickness={1.1}
          sectionColor={new Color(def.grid)}
          fadeDistance={5}
          fadeStrength={2}
          infiniteGrid
          followCamera={false}
        />
      ) : def.floor === "reflector" ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <MeshReflectorMaterial
            resolution={512}
            mixBlur={1}
            mixStrength={2.2}
            blur={[400, 120]}
            mirror={0.4}
            depthScale={0.6}
            minDepthThreshold={0.3}
            maxDepthThreshold={1.2}
            roughness={def.floorRoughness ?? 0.6}
            metalness={0.35}
            color={new Color(def.ground)}
          />
        </mesh>
      ) : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial
            color={new Color(def.ground)}
            roughness={def.floorRoughness ?? 0.9}
            metalness={0.05}
          />
        </mesh>
      )}
    </group>
  );
}
