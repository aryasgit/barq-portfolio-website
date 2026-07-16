import type { Object3D } from "three";

/** The four legs of the quadruped, in canonical order. */
export type LegId = "FL" | "FR" | "RL" | "RR";

/** Joint role within a leg. */
export type JointRole = "hip" | "knee" | "ankle";

/** A named joint value map, e.g. { FL_knee_joint: 0.6, ... }. */
export type JointPose = Record<string, number>;

/** urdf-loader augments joints/links onto the returned Object3D. */
export interface URDFJointLike extends Object3D {
  jointType: string;
  limit: { lower: number; upper: number };
  setJointValue: (value: number) => boolean;
}

export interface URDFRobotLike extends Object3D {
  joints: Record<string, URDFJointLike>;
  links: Record<string, Object3D>;
  setJointValue: (name: string, value: number) => boolean;
}

/** A gait defines per-leg phase offsets (fraction of one cycle, 0..1). */
export interface GaitDef {
  id: string;
  label: string;
  offsets: Record<LegId, number>;
  /** Cycle frequency multiplier and lift/push gains. */
  freq: number;
  lift: number;
  push: number;
}

/** A static pose the robot can settle into. */
export interface PoseDef {
  id: string;
  label: string;
  pose: JointPose;
  /** Optional base height offset applied to the whole body. */
  bodyY?: number;
}

/** A teardown component with engineering specifications. */
export interface PartSpec {
  id: string;
  /** Link name in the URDF this part maps to (for highlight). */
  link: string;
  name: string;
  category: string;
  accent: "cyan" | "emerald" | "pink";
  /** Direction the part travels during the exploded view. */
  explode: [number, number, number];
  specs: { label: string; value: string }[];
  description: string;
}
