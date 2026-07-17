"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";
import { useInView } from "motion/react";
import { SectionHeading } from "./SectionHeading";

const JOINTS = [
  { id: "hip", label: "HIP · θ1", x: 120, y: 90 },
  { id: "knee", label: "KNEE · θ2", x: 120, y: 235 },
  { id: "ankle", label: "ANKLE · θ3", x: 205, y: 320 },
  { id: "foot", label: "FOOT", x: 205, y: 388 },
];

/**
 * A blueprint of the leg kinematic chain that draws itself when scrolled into
 * view (anime.js stroke-dashoffset), then reveals joint labels and axes.
 */
export function Blueprint() {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  useEffect(() => {
    if (!inView || !svgRef.current) return;
    const paths = svgRef.current.querySelectorAll<SVGPathElement>(".draw");
    const dots = svgRef.current.querySelectorAll<SVGGElement>(".label");

    const tl = anime.timeline({ easing: "easeInOutSine" });
    tl.add({
      targets: paths,
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 1100,
      delay: anime.stagger(140),
    }).add(
      {
        targets: dots,
        opacity: [0, 1],
        translateY: [6, 0],
        duration: 500,
        delay: anime.stagger(90),
      },
      "-=500",
    );

    return () => tl.pause();
  }, [inView]);

  return (
    <section
      id="blueprint"
      className="relative z-10 w-full bg-bg-secondary px-6 py-28 md:px-12"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
        <SectionHeading
          index="05"
          eyebrow="Technical"
          accent="cyan"
          title={
            <>
              The chain,
              <br />
              drawn to scale.
            </>
          }
          sub="Each leg is a three-link serial manipulator. The foot position is a closed-form function of three joint angles — the same forward kinematics the browser solves in real time."
          className="max-w-md"
        />

        <div ref={ref} className="relative mx-auto w-full max-w-sm">
          <svg
            ref={svgRef}
            viewBox="0 0 340 430"
            className="w-full"
            fill="none"
            stroke="#00f0ff"
          >
            {/* grid backdrop */}
            <g stroke="#0a4a63" strokeWidth="0.5" opacity="0.4">
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="430" />
              ))}
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 40} x2="340" y2={i * 40} />
              ))}
            </g>

            {/* coordinate axes at hip */}
            <path className="draw" d="M120 90 L180 90" stroke="#00e784" strokeWidth="1.5" />
            <path className="draw" d="M120 90 L120 40" stroke="#ff2b73" strokeWidth="1.5" />

            {/* links */}
            <path className="draw" d="M120 90 L120 235" strokeWidth="3" />
            <path className="draw" d="M120 235 L205 320" strokeWidth="3" />
            <path className="draw" d="M205 320 L205 388" strokeWidth="3" />

            {/* motion arc */}
            <path
              className="draw"
              d="M205 388 Q150 360 150 300"
              stroke="#8d8d96"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* joints */}
            {JOINTS.map((j) => (
              <g key={j.id} className="label" opacity="0">
                <circle cx={j.x} cy={j.y} r="6" fill="#050505" stroke="#00f0ff" strokeWidth="2" />
                <circle cx={j.x} cy={j.y} r="2" fill="#00f0ff" />
                <text
                  x={j.x + 14}
                  y={j.y + 4}
                  fill="#f6f6f6"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  stroke="none"
                >
                  {j.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
