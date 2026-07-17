"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Mesh, Object3D, Quaternion, Vector3 } from "three";
import { useApp } from "@/lib/store";
import { LEGS, PARTS } from "@/lib/robot-config";
import { ACCENT } from "@/lib/accent";
import { damp } from "@/lib/utils";

interface EmissiveMat {
  emissive: Color;
  emissiveIntensity?: number;
}

interface Tracked {
  link: Object3D;
  rest: Vector3;
  offsetDir: Vector3; // local-space unit direction to travel
  dist: number;
  mats: EmissiveMat[];
}

/**
 * A component type highlights every instance of it — hovering "coxa" lights all
 * four legs, not just the front-left. Chassis is the single base link.
 */
function linkMatchesPart(partId: string | undefined, linkName: string): boolean {
  if (!partId) return false;
  if (partId === "chassis") return linkName === "base_link";
  return linkName.endsWith(`_${partId}_link`);
}

/**
 * The teardown driver. Captures each leg link's rest transform once, then eases
 * every link outward along its leg axis proportional to the store's `exploded`
 * value — a reversible, spring-damped explosion. Hovered parts glow.
 */
export function Teardown3D() {
  const robot = useApp((s) => s.robot);
  const tracked = useRef<Tracked[]>([]);
  const eased = useRef(0);
  const glow = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!robot) return;
    const list: Tracked[] = [];
    const center = new Vector3();
    (robot.links["base_link"] ?? robot).getWorldPosition(center);

    // Give each tracked link its own materials so we can glow it in isolation.
    const prepare = (link: Object3D): EmissiveMat[] => {
      const mats: EmissiveMat[] = [];
      link.traverse((o) => {
        const mesh = o as Mesh;
        if (!mesh.isMesh) return;
        const src = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const cloned = src.map((m) => m.clone());
        mesh.material = cloned.length === 1 ? cloned[0] : cloned;
        cloned.forEach((m) => {
          const em = m as unknown as EmissiveMat;
          if (em.emissive) mats.push(em);
        });
      });
      return mats;
    };

    // Lift the chassis straight up.
    const base = robot.links["base_link"];
    if (base) {
      const invQ = base.parent
        ? base.parent.getWorldQuaternion(new Quaternion()).invert()
        : new Quaternion();
      list.push({
        link: base,
        rest: base.position.clone(),
        offsetDir: new Vector3(0, 1, 0).applyQuaternion(invQ),
        dist: 0.1,
        mats: prepare(base),
      });
    }

    // Each leg's links slide outward along the leg's horizontal axis.
    for (const leg of LEGS) {
      const coxa = robot.links[`${leg}_coxa_link`];
      const femur = robot.links[`${leg}_femur_link`];
      const tibia = robot.links[`${leg}_tibia_link`];
      if (!coxa) continue;

      const coxaWorld = coxa.getWorldPosition(new Vector3());
      const outward = coxaWorld.clone().sub(center);
      outward.y = 0;
      outward.normalize();

      [coxa, femur, tibia].forEach((link) => {
        if (!link || !link.parent) return;
        const invQ = link.parent.getWorldQuaternion(new Quaternion()).invert();
        list.push({
          link,
          rest: link.position.clone(),
          offsetDir: outward.clone().applyQuaternion(invQ),
          dist: 0.05,
          mats: prepare(link),
        });
      });
    }

    tracked.current = list;
    return () => {
      // Restore rest positions when unmounting.
      for (const t of tracked.current) t.link.position.copy(t.rest);
      tracked.current = [];
    };
  }, [robot]);

  useFrame((_, delta) => {
    const list = tracked.current;
    if (!list.length) return;
    const dt = Math.min(delta, 0.05);
    const { exploded, hoveredPart } = useApp.getState();
    eased.current = damp(eased.current, exploded, 6, dt);
    const e = eased.current;

    const part = PARTS.find((p) => p.id === hoveredPart);
    const glowColor = part ? ACCENT[part.accent].hex : "#00f0ff";
    for (const t of list) {
      t.link.position.copy(t.rest).addScaledVector(t.offsetDir, e * t.dist);

      const key = t.link.name;
      const want = linkMatchesPart(part?.id, t.link.name) ? 1 : 0;
      glow.current[key] = damp(glow.current[key] ?? 0, want, 8, dt);
      const g = glow.current[key];
      if (g > 0.001 || want > 0) {
        for (const m of t.mats) {
          // Restrained glow rather than a flat flood.
          m.emissive.set(glowColor);
          if (m.emissiveIntensity !== undefined) m.emissiveIntensity = g * 0.5;
        }
      }
    }
  });

  return null;
}
