import { GAIT_MAP, LEGS, POSE_MAP, STAND_ANKLE, STAND_KNEE } from "@/lib/robot-config";
import { damp } from "@/lib/utils";
import type { MotionMode } from "@/lib/store";
import type { JointPose, URDFRobotLike } from "@/types/robot";

const TWO_PI = Math.PI * 2;

/**
 * Drives the BARQ robot every frame: layered idle micro-motion on top of the
 * active pose or gait. Joint values are damped for organic, non-robotic easing.
 *
 * The gait model is ported from the reference viewer — per-leg sine phase
 * offsets, a positive-half swing lift on the knee and an anti-phase push.
 */
export class RobotDriver {
  private robot: URDFRobotLike;
  private target: JointPose = {};
  private current: JointPose = {};
  private baseBodyY = 0;
  private bodyY = 0;
  private targetBodyY = 0;
  private gaitClock = 0;

  constructor(robot: URDFRobotLike, baseBodyY: number) {
    this.robot = robot;
    this.baseBodyY = baseBodyY;
    for (const name of Object.keys(robot.joints)) {
      this.current[name] = 0;
      this.target[name] = 0;
    }
    this.applyPose("stand");
  }

  get currentBodyY() {
    return this.bodyY;
  }

  private applyPose(id: string) {
    const def = POSE_MAP[id];
    if (!def) return;
    // Reset all controllable joints to 0, then layer the pose on top.
    for (const name of Object.keys(this.target)) this.target[name] = 0;
    for (const [name, value] of Object.entries(def.pose)) {
      this.target[name] = value;
    }
    this.targetBodyY = def.bodyY ?? 0;
  }

  /** Advance the simulation by dt seconds under the given motion mode. */
  update(dt: number, mode: MotionMode, speed: number, elapsed: number) {
    if (mode.kind === "pose") {
      this.applyPose(mode.id);
      this.driveIdle(elapsed);
    } else {
      this.driveGait(dt, mode, speed);
    }

    // Damp every joint toward its target for smooth, weighty motion.
    for (const name of Object.keys(this.target)) {
      this.current[name] = damp(this.current[name], this.target[name], 9, dt);
      this.robot.setJointValue(name, this.current[name]);
    }
    this.bodyY = damp(this.bodyY, this.baseBodyY + this.targetBodyY, 7, dt);
  }

  /** Subtle life: breathing, weight shift, servo jitter — never frozen. */
  private driveIdle(t: number) {
    const breathe = Math.sin(t * 1.1) * 0.02;
    const shift = Math.sin(t * 0.6) * 0.015;
    const sway = Math.sin(t * 0.42) * 0.02;

    LEGS.forEach((leg, i) => {
      const jitter = Math.sin(t * 7.3 + i * 2.1) * 0.004;
      const phase = i * 1.7;
      this.target[`${leg}_knee_joint`] =
        STAND_KNEE + breathe + Math.sin(t * 0.9 + phase) * 0.01 + jitter;
      this.target[`${leg}_ankle_joint`] =
        STAND_ANKLE - breathe * 0.6 + Math.sin(t * 0.8 + phase) * 0.008;
      this.target[`${leg}_hip_joint`] = sway * (leg.endsWith("L") ? 1 : -1) + shift * 0.4;
    });
    this.targetBodyY = breathe * 0.4;
  }

  /** Cyclic locomotion. Turn biases the hip abduction left/right. */
  private driveGait(dt: number, mode: { id: string; turn: -1 | 0 | 1 }, speed: number) {
    const gait = GAIT_MAP[mode.id] ?? GAIT_MAP.trot;
    this.gaitClock += dt * gait.freq * speed;

    const liftGain = gait.lift;
    const pushGain = gait.push;

    LEGS.forEach((leg) => {
      const phase = TWO_PI * ((this.gaitClock + gait.offsets[leg]) % 1);
      const s = Math.sin(phase);
      const c = Math.cos(phase);
      const lift = Math.max(0, s);

      this.target[`${leg}_knee_joint`] = STAND_KNEE - liftGain * lift + pushGain * c;
      this.target[`${leg}_ankle_joint`] = STAND_ANKLE + liftGain * 1.3 * lift - pushGain * c;

      // Turning: outer legs reach, inner legs tuck via hip abduction.
      const side = leg.endsWith("L") ? 1 : -1;
      this.target[`${leg}_hip_joint`] = mode.turn * 0.28 * side;
    });

    this.targetBodyY = Math.sin(TWO_PI * this.gaitClock * 2) * 0.006 * speed;
  }
}
