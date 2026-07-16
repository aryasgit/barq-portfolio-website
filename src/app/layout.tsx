import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://barq.krishagarwal.dev"),
  title: {
    default: "BARQ — Quadruped Robotics · Krish Agarwal",
    template: "%s · BARQ",
  },
  description:
    "BARQ is a custom-engineered quadruped robot. An interactive teardown of its kinematics, actuators, compute and control stack.",
  keywords: [
    "quadruped robot",
    "robotics",
    "URDF",
    "Krish Agarwal",
    "legged locomotion",
    "BARQ",
  ],
  authors: [{ name: "Krish Agarwal" }],
  openGraph: {
    title: "BARQ — Quadruped Robotics",
    description: "An interactive teardown of a custom quadruped robot.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
