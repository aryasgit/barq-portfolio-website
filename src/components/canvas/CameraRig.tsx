"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Box3, PerspectiveCamera, Sphere, Vector3 } from "three";
import { CAM_FRAMES, orbitDir } from "@/lib/camera-keyframes";
import { SpringScalar, SpringVec3 } from "@/lib/spring";
import { useApp } from "@/lib/store";
import { clamp } from "@/lib/utils";

const DEG2RAD = Math.PI / 180;

/**
 * Cinematic framing rig. Rather than driving fixed coordinates, it frames the
 * robot's live bounding sphere: each section picks an orbit angle and FOV, and
 * the distance is solved so the robot always fills the shot with headroom — it
 * can never crop, clip or drift, even as the teardown explodes. Position,
 * target and FOV are critically-damped springs for Apple-grade transitions.
 */
export function CameraRig() {
  const { camera, pointer } = useThree();

  const box = useRef(new Box3());
  const sphere = useRef(new Sphere());
  const dir = useRef(new Vector3());
  const target = useRef(new Vector3());
  const desired = useRef(new Vector3());

  const posSpring = useRef<SpringVec3 | null>(null);
  const tgtSpring = useRef<SpringVec3 | null>(null);
  const fovSpring = useRef<SpringScalar | null>(null);

  useFrame((state, delta) => {
    if (useApp.getState().labActive) return;
    const { section, robotGroup } = useApp.getState();
    if (!robotGroup) return;

    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    // Live bounds → bounding sphere. Grows automatically during the teardown.
    box.current.setFromObject(robotGroup);
    if (box.current.isEmpty()) return;
    box.current.getBoundingSphere(sphere.current);

    const frame = CAM_FRAMES[Math.min(section, CAM_FRAMES.length - 1)];

    // Pointer + breathe as orbit offsets so the subject stays centred.
    const az = frame.azimuth + pointer.x * 0.16 + Math.sin(t * 0.3) * 0.02;
    const el = clamp(
      frame.elevation + pointer.y * 0.1 + Math.cos(t * 0.24) * 0.015,
      0.02,
      1.45,
    );
    orbitDir(az, el, dir.current);

    const fovRad = frame.fov * DEG2RAD;
    const dist = (sphere.current.radius * frame.margin) / Math.sin(fovRad / 2);

    target.current.copy(sphere.current.center);
    target.current.x += frame.targetOffset[0];
    target.current.y += frame.targetOffset[1];
    target.current.z += frame.targetOffset[2];
    desired.current.copy(target.current).addScaledVector(dir.current, dist);

    // Lazily seed the springs at the framed pose so the hero opens composed.
    if (!posSpring.current) {
      posSpring.current = new SpringVec3(desired.current);
      tgtSpring.current = new SpringVec3(target.current);
      fovSpring.current = new SpringScalar(frame.fov);
      camera.position.copy(desired.current);
    }

    const omega = 7;
    posSpring.current.step(desired.current, omega, dt);
    tgtSpring.current!.step(target.current, omega, dt);
    const fov = fovSpring.current!.step(frame.fov, 6, dt);

    camera.position.copy(posSpring.current.value);
    const cam = camera as PerspectiveCamera;
    cam.fov = fov;
    cam.near = Math.max(0.01, dist - sphere.current.radius * 2.5);
    cam.far = dist + sphere.current.radius * 8;
    cam.updateProjectionMatrix();
    camera.lookAt(tgtSpring.current!.value);
  });

  return null;
}
