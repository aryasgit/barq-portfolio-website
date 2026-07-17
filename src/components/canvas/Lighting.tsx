"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { ENV_MAP } from "@/lib/environments";
import { useApp } from "@/lib/store";

/**
 * Neutral studio lighting that reveals geometry rather than tinting it. A large
 * soft key, a cool rim and a low fill wrap the robot; a Lightformer environment
 * supplies soft image-based reflections offline (no HDRI fetch). Per-environment
 * exposure is scaled so grass/lab read brighter without blowing out.
 */
export function Lighting() {
  const env = useApp((s) => s.env);
  const def = ENV_MAP[env];
  const boost = def.exposure ?? 1;

  return (
    <>
      <ambientLight intensity={0.16 * boost} />

      {/* Key — large, soft, slightly warm; the only shadow caster. */}
      <directionalLight
        position={[2.6, 4.0, 2.4]}
        intensity={2.4 * boost}
        color="#fff6ec"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      >
        <orthographicCamera attach="shadow-camera" args={[-1.2, 1.2, 1.2, -1.2, 0.1, 14]} />
      </directionalLight>

      {/* Cool rim from behind to separate the silhouette — restrained. */}
      <directionalLight position={[-2.4, 2.2, -2.6]} intensity={1.1 * boost} color="#cfe0ff" />
      {/* Low fill to keep shadow cores readable. */}
      <directionalLight position={[-1.2, 0.4, 2.0]} intensity={0.35 * boost} color="#aeb7c8" />

      <Environment resolution={256} background={false}>
        {/* Soft top key panel */}
        <Lightformer
          form="rect"
          intensity={3.0}
          color="#ffffff"
          position={[0, 5, 1]}
          scale={[8, 4, 1]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        {/* Cool side softbox */}
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#d6e3ff"
          position={[-5, 2, -1]}
          scale={[5, 5, 1]}
          rotation={[0, Math.PI / 2.5, 0]}
        />
        {/* Warm side softbox */}
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#ffe9d2"
          position={[5, 1.5, 0]}
          scale={[4, 5, 1]}
          rotation={[0, -Math.PI / 2.5, 0]}
        />
        {/* Front fill circle */}
        <Lightformer form="circle" intensity={1.4} color="#ffffff" position={[0, 1, 6]} scale={[4, 4, 1]} />
        {/* Ground bounce */}
        <Lightformer
          form="rect"
          intensity={0.5}
          color="#8a9099"
          position={[0, -2, 1]}
          scale={[8, 4, 1]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </Environment>

      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.7}
        scale={5}
        blur={2.8}
        far={2.2}
        resolution={1024}
        color="#000000"
      />
    </>
  );
}
