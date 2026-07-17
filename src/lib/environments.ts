import type { EnvId } from "@/lib/store";

export type MaterialMode = "normal" | "wireframe" | "blueprint";

export interface EnvDef {
  id: EnvId;
  label: string;
  /** Scene background colour. */
  bg: string;
  /** Lab ground colour. */
  ground: string;
  /** Grid line colour. */
  grid: string;
  /** How the robot's meshes are rendered. */
  material: MaterialMode;
  /** Exponential fog density; 0 disables. */
  fog: number;
}

export const ENVIRONMENTS: EnvDef[] = [
  { id: "studio", label: "Dark Studio", bg: "#050505", ground: "#0d0d0d", grid: "#1c222c", material: "normal", fog: 0.14 },
  { id: "concrete", label: "Concrete Lab", bg: "#0a0a0b", ground: "#26262b", grid: "#3a3a42", material: "normal", fog: 0.1 },
  { id: "grass", label: "Outdoor Grass", bg: "#0c1410", ground: "#1d3524", grid: "#2c4a33", material: "normal", fog: 0.12 },
  { id: "warehouse", label: "Warehouse", bg: "#0d0b0a", ground: "#2a2320", grid: "#41352e", material: "normal", fog: 0.1 },
  { id: "wireframe", label: "Wireframe", bg: "#050505", ground: "#0a0a0a", grid: "#20262f", material: "wireframe", fog: 0.16 },
  { id: "blueprint", label: "Blueprint", bg: "#02121f", ground: "#04202f", grid: "#0a4a63", material: "blueprint", fog: 0.1 },
  { id: "night", label: "Night", bg: "#030308", ground: "#0a0a12", grid: "#161626", material: "normal", fog: 0.2 },
];

export const ENV_MAP = Object.fromEntries(ENVIRONMENTS.map((e) => [e.id, e])) as Record<
  EnvId,
  EnvDef
>;
