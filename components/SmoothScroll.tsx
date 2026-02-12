"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    // Options for "Luxurious" feel
    const options = {
        lerp: 0.1, // Linear interpolation (lower = smoother/slower)
        duration: 1.5, // Duration of scroll animation
        smoothWheel: true,
        wheelMultiplier: 1, // Scroll speed multiplier
    };

    return (
        <ReactLenis root options={options}>
            {children}
        </ReactLenis>
    );
}
