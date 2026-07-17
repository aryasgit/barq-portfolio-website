export type Accent = "cyan" | "emerald" | "pink";

export interface HardwareCard {
  id: string;
  title: string;
  spec: string;
  detail: string;
  accent: Accent;
  /** Grid span on desktop. */
  span: "sm" | "md" | "lg";
}

export const HARDWARE: HardwareCard[] = [
  {
    id: "compute",
    title: "Compute",
    spec: "Jetson Orin NX",
    detail: "100 TOPS on-board inference for perception and policy execution.",
    accent: "cyan",
    span: "lg",
  },
  {
    id: "actuators",
    title: "Actuators",
    spec: "12 × BLDC",
    detail: "Direct-drive with planetary reduction. 10 N·m peak, 5.24 rad/s.",
    accent: "emerald",
    span: "md",
  },
  {
    id: "imu",
    title: "IMU",
    spec: "6-axis @ 1 kHz",
    detail: "Fused gyro + accel for base-state estimation and balance.",
    accent: "pink",
    span: "sm",
  },
  {
    id: "vision",
    title: "Vision",
    spec: "Stereo depth",
    detail: "Global-shutter stereo pair feeding the mapping pipeline.",
    accent: "cyan",
    span: "md",
  },
  {
    id: "power",
    title: "Power",
    spec: "6S Li-ion",
    detail: "Hot-swappable pack with per-rail distribution and monitoring.",
    accent: "emerald",
    span: "sm",
  },
  {
    id: "frame",
    title: "Frame",
    spec: "PA12 monocoque",
    detail: "Rib-stiffened shell, 0.95 kg, tuned for torsional stiffness.",
    accent: "pink",
    span: "sm",
  },
  {
    id: "electronics",
    title: "Electronics",
    spec: "CAN-FD bus",
    detail: "Deterministic 1 Mbit joint bus with per-actuator controllers.",
    accent: "cyan",
    span: "md",
  },
];

export interface Metric {
  id: string;
  label: string;
  value: number;
  unit: string;
  /** 0..1 fill of the bar for the animated meter. */
  fill: number;
  accent: Accent;
}

export const METRICS: Metric[] = [
  { id: "control", label: "Control loop", value: 1000, unit: "Hz", fill: 0.92, accent: "cyan" },
  { id: "latency", label: "Sense→act latency", value: 4, unit: "ms", fill: 0.16, accent: "emerald" },
  { id: "torque", label: "Peak joint torque", value: 10, unit: "N·m", fill: 0.7, accent: "pink" },
  { id: "battery", label: "Runtime", value: 42, unit: "min", fill: 0.62, accent: "cyan" },
  { id: "payload", label: "Payload", value: 2.5, unit: "kg", fill: 0.5, accent: "emerald" },
  { id: "mass", label: "Total mass", value: 3.6, unit: "kg", fill: 0.36, accent: "pink" },
];

export interface StackNode {
  id: string;
  label: string;
  layer: number; // 0 top (perception) .. n bottom (hardware)
  accent: Accent;
}

export const STACK_NODES: StackNode[] = [
  { id: "vision", label: "Vision Pipeline", layer: 0, accent: "cyan" },
  { id: "mapping", label: "Mapping", layer: 0, accent: "cyan" },
  { id: "planning", label: "Planning", layer: 1, accent: "emerald" },
  { id: "state", label: "State Machine", layer: 1, accent: "emerald" },
  { id: "ik", label: "Inverse Kinematics", layer: 2, accent: "pink" },
  { id: "pd", label: "PD Controller", layer: 2, accent: "pink" },
  { id: "ros", label: "ROS 2 · micro-ROS", layer: 3, accent: "cyan" },
  { id: "jetson", label: "Jetson Runtime", layer: 3, accent: "cyan" },
];

export const STACK_LAYERS = ["Perception", "Decision", "Control", "Runtime"];
