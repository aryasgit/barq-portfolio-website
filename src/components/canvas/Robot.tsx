"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box3, Group } from "three";
import { useUrdf } from "@/hooks/useUrdf";
import { RobotDriver } from "@/lib/robot-driver";
import { useApp } from "@/lib/store";
import type { URDFRobotLike } from "@/types/robot";

interface RobotProps {
  onReady?: (robot: URDFRobotLike) => void;
}

/**
 * The living robot. Loads the URDF, grounds it so the feet rest at y=0, then
 * drives idle/pose/gait motion every frame via {@link RobotDriver}.
 */
export function Robot({ onReady }: RobotProps) {
  const outer = useRef<Group>(null);
  const setProgress = useApp((s) => s.setProgress);
  const setReady = useApp((s) => s.setReady);
  const setRobot = useApp((s) => s.setRobot);

  const { robot, progress } = useUrdf();
  const dropY = useRef(0);
  const driver = useRef<RobotDriver | null>(null);

  useEffect(() => {
    setProgress(progress);
  }, [progress, setProgress]);

  useEffect(() => {
    if (!robot || !outer.current) return;
    // Ground the robot: measure the assembled bounds and drop so feet touch 0.
    const box = new Box3().setFromObject(outer.current);
    const min = box.min.y;
    dropY.current = -min;
    outer.current.position.y = -min;

    driver.current = new RobotDriver(robot, -min);
    setRobot(robot);
    setReady(true);
    onReady?.(robot);
  }, [robot, onReady, setReady, setRobot]);

  useFrame((_, delta) => {
    if (!driver.current || !outer.current) return;
    const dt = Math.min(delta, 0.05);
    const { motion, gaitSpeed } = useApp.getState();
    const elapsed = performance.now() / 1000;
    driver.current.update(dt, motion, gaitSpeed, elapsed);
    outer.current.position.y = dropY.current + driver.current.currentBodyY;
  });

  const rotated = useMemo(() => {
    if (!robot) return null;
    return <primitive object={robot} />;
  }, [robot]);

  return (
    <group ref={outer}>
      {/* URDF is authored Z-up; rotate into the viewer's Y-up frame. */}
      <group rotation={[-Math.PI / 2, 0, 0]}>{rotated}</group>
    </group>
  );
}
