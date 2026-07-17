"use client";

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import {
  Color,
  FogExp2,
  Material,
  Mesh,
  MeshBasicMaterial,
} from "three";
import { ENV_MAP } from "@/lib/environments";
import { useApp } from "@/lib/store";

/**
 * Applies the active environment to the scene: background, fog and the robot's
 * material mode (normal / wireframe / blueprint). Original materials are cached
 * on first touch so switching back is lossless.
 */
export function EnvController() {
  const { scene } = useThree();
  const env = useApp((s) => s.env);
  const robot = useApp((s) => s.robot);

  const wireMat = useMemo(() => new MeshBasicMaterial({ color: "#9aa3b2", wireframe: true }), []);
  const blueMat = useMemo(() => new MeshBasicMaterial({ color: "#37c6e6", wireframe: true }), []);

  // Scene background + fog.
  useEffect(() => {
    const def = ENV_MAP[env];
    scene.background = new Color(def.bg);
    scene.fog = def.fog > 0 ? new FogExp2(def.bg, def.fog) : null;
  }, [env, scene]);

  // Robot material mode.
  useEffect(() => {
    if (!robot) return;
    const def = ENV_MAP[env];
    robot.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      if (!mesh.userData.originalMaterial) {
        mesh.userData.originalMaterial = mesh.material as Material;
      }
      if (def.material === "wireframe") mesh.material = wireMat;
      else if (def.material === "blueprint") mesh.material = blueMat;
      else mesh.material = mesh.userData.originalMaterial as Material;
    });
  }, [env, robot, wireMat, blueMat]);

  return null;
}
