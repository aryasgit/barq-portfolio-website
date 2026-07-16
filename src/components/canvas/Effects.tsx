"use client";

import { EffectComposer, Bloom, Vignette, SMAA } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/**
 * Restrained post-processing. Bloom is kept extremely subtle — only the
 * brightest rim highlights should bleed. A gentle vignette focuses the frame.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.42}
        luminanceThreshold={0.72}
        luminanceSmoothing={0.24}
        mipmapBlur
        radius={0.6}
      />
      <Vignette eskil={false} offset={0.28} darkness={0.72} blendFunction={BlendFunction.NORMAL} />
      <SMAA />
    </EffectComposer>
  );
}
