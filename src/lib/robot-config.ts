import type { GaitDef, JointPose, LegId, PartSpec, PoseDef } from "@/types/robot";

/** Public paths for the robot assets. */
export const ROBOT_URDF = "/robot/barq.urdf";
export const ROBOT_MESH_DIR = "/robot/meshes";

export const LEGS: LegId[] = ["FL", "FR", "RL", "RR"];
export const LEG_LABEL: Record<LegId, string> = {
  FL: "Front Left",
  FR: "Front Right",
  RL: "Rear Left",
  RR: "Rear Right",
};

/** Neutral standing joint angles (radians) — ported from the reference viewer. */
export const STAND_KNEE = 0.6;
export const STAND_ANKLE = -1.1;

const jointName = (leg: LegId, role: "hip" | "knee" | "ankle") =>
  `${leg}_${role}_joint`;

/** Build a symmetric pose from per-role angles applied to every leg. */
function symmetricPose(hip: number, knee: number, ankle: number): JointPose {
  const pose: JointPose = {};
  for (const leg of LEGS) {
    pose[jointName(leg, "hip")] = hip;
    pose[jointName(leg, "knee")] = knee;
    pose[jointName(leg, "ankle")] = ankle;
  }
  return pose;
}

/* ------------------------------------------------------------------ */
/*  Static poses                                                      */
/* ------------------------------------------------------------------ */
export const POSES: PoseDef[] = [
  { id: "stand", label: "Stand", pose: symmetricPose(0, STAND_KNEE, STAND_ANKLE) },
  { id: "idle", label: "Idle", pose: symmetricPose(0, STAND_KNEE, STAND_ANKLE) },
  {
    id: "sit",
    label: "Sit",
    pose: {
      ...symmetricPose(0, STAND_KNEE, STAND_ANKLE),
      RL_knee_joint: 1.35,
      RR_knee_joint: 1.35,
      RL_ankle_joint: -1.5,
      RR_ankle_joint: -1.5,
      FL_knee_joint: 0.35,
      FR_knee_joint: 0.35,
    },
    bodyY: -0.03,
  },
  {
    id: "lie",
    label: "Lie Down",
    pose: symmetricPose(0, 1.45, -1.55),
    bodyY: -0.07,
  },
  {
    id: "stretch",
    label: "Stretch",
    pose: {
      FL_knee_joint: 1.2,
      FR_knee_joint: 1.2,
      FL_ankle_joint: -0.4,
      FR_ankle_joint: -0.4,
      FL_hip_joint: 0.1,
      FR_hip_joint: -0.1,
      RL_knee_joint: 0.2,
      RR_knee_joint: 0.2,
      RL_ankle_joint: -1.2,
      RR_ankle_joint: -1.2,
    },
    bodyY: -0.02,
  },
  {
    id: "bow",
    label: "Bow",
    pose: {
      ...symmetricPose(0, STAND_KNEE, STAND_ANKLE),
      FL_knee_joint: 1.3,
      FR_knee_joint: 1.3,
      FL_ankle_joint: -1.3,
      FR_ankle_joint: -1.3,
    },
    bodyY: -0.02,
  },
  {
    id: "walk-ready",
    label: "Walk Ready",
    pose: symmetricPose(0, 0.78, -1.2),
    bodyY: -0.012,
  },
  {
    id: "run-ready",
    label: "Run Ready",
    pose: symmetricPose(0, 0.95, -1.38),
    bodyY: -0.03,
  },
  {
    id: "calibration",
    label: "Calibration",
    // All joints neutral — legs extended for a zeroing / self-check stance.
    pose: symmetricPose(0, 0, 0),
  },
  {
    id: "power-off",
    label: "Power Off",
    pose: symmetricPose(0, 1.5, -1.55),
    bodyY: -0.08,
  },
];

export const POSE_MAP = Object.fromEntries(POSES.map((p) => [p.id, p]));

/* ------------------------------------------------------------------ */
/*  Gaits — per-leg phase offsets (fraction of a cycle)               */
/* ------------------------------------------------------------------ */
export const GAITS: GaitDef[] = [
  {
    id: "trot",
    label: "Trot",
    offsets: { FL: 0.0, FR: 0.5, RL: 0.5, RR: 0.0 },
    freq: 1.15,
    lift: 0.55,
    push: 0.3,
  },
  {
    id: "walk",
    label: "Walk",
    offsets: { FL: 0.0, RL: 0.25, RR: 0.5, FR: 0.75 },
    freq: 0.85,
    lift: 0.5,
    push: 0.26,
  },
  {
    id: "run",
    label: "Run",
    offsets: { FL: 0.0, FR: 0.5, RL: 0.5, RR: 0.0 },
    freq: 2.1,
    lift: 0.7,
    push: 0.42,
  },
  {
    id: "pace",
    label: "Pace",
    offsets: { FL: 0.0, RL: 0.0, FR: 0.5, RR: 0.5 },
    freq: 1.2,
    lift: 0.5,
    push: 0.32,
  },
  {
    id: "bound",
    label: "Bound",
    offsets: { FL: 0.0, FR: 0.0, RL: 0.5, RR: 0.5 },
    freq: 1.6,
    lift: 0.65,
    push: 0.4,
  },
];

export const GAIT_MAP = Object.fromEntries(GAITS.map((g) => [g.id, g]));

/* ------------------------------------------------------------------ */
/*  Teardown / hardware component specs                               */
/* ------------------------------------------------------------------ */
export const PARTS: PartSpec[] = [
  {
    id: "chassis",
    link: "base_link",
    name: "Monocoque Chassis",
    category: "Structure",
    accent: "cyan",
    explode: [0, 0.16, 0],
    description:
      "Central load-bearing shell housing compute, IMU and power distribution. CNC-finished with an internal rib lattice for torsional stiffness.",
    specs: [
      { label: "Mass", value: "0.95 kg" },
      { label: "Material", value: "PA12 / AL6061" },
      { label: "Process", value: "SLS + CNC" },
      { label: "Footprint", value: "258 × 117 × 85 mm" },
    ],
  },
  {
    id: "coxa",
    link: "FL_coxa_link",
    name: "Hip Actuator · Coxa",
    category: "Actuation",
    accent: "emerald",
    explode: [0.22, 0.06, 0.16],
    description:
      "Abduction/adduction joint driving lateral leg swing. Direct-drive BLDC with a planetary reduction and magnetic absolute encoder.",
    specs: [
      { label: "Range", value: "±45°" },
      { label: "Peak torque", value: "10 N·m" },
      { label: "Max velocity", value: "5.24 rad/s" },
      { label: "Encoder", value: "14-bit abs" },
    ],
  },
  {
    id: "femur",
    link: "FL_femur_link",
    name: "Femur Linkage",
    category: "Kinematics",
    accent: "cyan",
    explode: [0.34, -0.02, 0.24],
    description:
      "Upper leg link carrying the knee actuator. Optimised topology balances bending stiffness against swing inertia.",
    specs: [
      { label: "Mass", value: "0.05 kg" },
      { label: "Length", value: "100 mm" },
      { label: "Range", value: "±90°" },
      { label: "Material", value: "PA12-CF" },
    ],
  },
  {
    id: "tibia",
    link: "FL_tibia_link",
    name: "Tibia + Foot",
    category: "Contact",
    accent: "pink",
    explode: [0.46, -0.12, 0.32],
    description:
      "Lower link terminating in a compliant TPU foot. Passive damping absorbs impact transients before they reach the estimator.",
    specs: [
      { label: "Mass", value: "0.05 kg" },
      { label: "Foot", value: "TPU 90A" },
      { label: "Reach", value: "100 mm" },
      { label: "Contact", value: "Ø 24 mm" },
    ],
  },
];

/** 12 controllable revolute joints. */
export const JOINT_COUNT = LEGS.length * 3;
