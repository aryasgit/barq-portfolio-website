"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useApp } from "@/lib/store";

/**
 * Cinematic studio lighting built entirely from area lights (Lightformers) so
 * it renders offline with no external HDRI fetch. A key rim, cool fill and a
 * warm kicker wrap the robot; ContactShadows ground it softly.
 */
export function Lighting() {
  const env = useApp((s) => s.env);
  const bright = env === "grass" || env === "warehouse";

  return (
    <>
      <ambientLight intensity={0.18} />

      {/* Primary key light with a crisp cast shadow for structural read. */}
      <directionalLight
        position={[2.4, 3.6, 2.2]}
        intensity={bright ? 2.2 : 1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      >
        <orthographicCamera attach="shadow-camera" args={[-1, 1, 1, -1, 0.1, 12]} />
      </directionalLight>

      {/* Cyan rim from behind for that engineered edge glow. */}
      <spotLight
        position={[-2.5, 1.8, -2.2]}
        angle={0.7}
        penumbra={1}
        intensity={bright ? 44 : 30}
        color="#00f0ff"
        distance={12}
      />
      {/* Warm kicker to keep shadows from going dead — kept restrained. */}
      <pointLight position={[1.6, 0.4, -1.4]} intensity={3.2} color="#ff2b73" distance={5} />

      <Environment resolution={256} background={false}>
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#ffffff"
          position={[0, 4, 2]}
          scale={[6, 3, 1]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#8fb7ff"
          position={[-4, 2, -2]}
          scale={[4, 4, 1]}
          rotation={[0, Math.PI / 3, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          color="#00e784"
          position={[4, 1, -1]}
          scale={[3, 3, 1]}
          rotation={[0, -Math.PI / 3, 0]}
        />
        <Lightformer
          form="circle"
          intensity={2}
          color="#ffffff"
          position={[0, 1, 5]}
          scale={[3, 3, 1]}
        />
      </Environment>

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.55}
        scale={4}
        blur={2.6}
        far={2}
        resolution={1024}
        color="#000000"
      />
    </>
  );
}
