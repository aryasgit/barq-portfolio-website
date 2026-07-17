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
  /** Global lighting exposure multiplier for this environment. */
  exposure?: number;
  /** Floor treatment. */
  floor: "reflector" | "solid" | "grid";
  /** Roughness of a reflective/solid floor. */
  floorRoughness?: number;
}

export const ENVIRONMENTS: EnvDef[] = [
  { id: "studio", label: "Dark Studio", bg: "#060607", ground: "#0b0b0d", grid: "#1c222c", material: "normal", fog: 0.12, exposure: 1, floor: "reflector", floorRoughness: 0.6 },
  { id: "concrete", label: "Industrial Lab", bg: "#0c0c0d", ground: "#3a3a3f", grid: "#4a4a52", material: "normal", fog: 0.08, exposure: 1.08, floor: "solid", floorRoughness: 0.9 },
  { id: "grass", label: "Outdoor Grass", bg: "#0e1a12", ground: "#24401f", grid: "#2c4a33", material: "normal", fog: 0.09, exposure: 1.3, floor: "solid", floorRoughness: 1 },
  { id: "warehouse", label: "Warehouse Night", bg: "#0b0a09", ground: "#211c18", grid: "#3a2f28", material: "normal", fog: 0.1, exposure: 0.92, floor: "solid", floorRoughness: 0.8 },
  { id: "research", label: "Research Lab", bg: "#eceef2", ground: "#dfe3ea", grid: "#c2c8d2", material: "normal", fog: 0, exposure: 1.15, floor: "solid", floorRoughness: 0.7 },
  { id: "blueprint", label: "Blueprint", bg: "#02121f", ground: "#04202f", grid: "#0a4a63", material: "blueprint", fog: 0.08, exposure: 1, floor: "grid" },
  { id: "night", label: "Studio Night", bg: "#040409", ground: "#0a0a12", grid: "#161626", material: "normal", fog: 0.18, exposure: 0.72, floor: "reflector", floorRoughness: 0.5 },
];

export const ENV_MAP = Object.fromEntries(ENVIRONMENTS.map((e) => [e.id, e])) as Record<
  EnvId,
  EnvDef
>;
