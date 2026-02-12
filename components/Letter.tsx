"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";

// --- THE LETTER CONTENT ---
const LETTER_LINES = [
    "I’ve been thinking about us...",
    "About how you make the ordinary feel like magic.",
    "You are my favorite notification,",
    "My safe space,",
    "And my greatest adventure.",
    "I wouldn't want to build this universe with anyone else."
];

// --- PETAL COMPONENT ---
// A single petal that rotates and unfolds based on progress
const Petal = ({ index, total, progress }: { index: number, total: number, progress: number }) => {
    // Unique characteristics for each petal layer
    const layer = Math.floor(index / 5); // 0, 1, 2... concentric layers
    const angle = (index % 5) * (360 / 5) + (layer * 36); // Offset rotation per layer

    // Animation Transforms
    // As progress 0 -> 100:
    // Rotate folds out (X axis)
    // Scale grows
    // Z-index shifts

    // Normalize progress 0-1
    const p = Math.min(progress / 100, 1);

    // Stagger opening based on layer (outer layers open first or last? Let's say inner opens last)
    const stagger = Math.max(0, p * 1.5 - (0.1 * (3 - layer)));
    const openFactor = Math.min(stagger, 1);

    return (
        <motion.div
            className="absolute origin-bottom-center"
            style={{
                width: 60 + layer * 20,
                height: 100 + layer * 30,
                rotate: angle, // Static rotation around center
                rotateX: (1 - openFactor) * 90, // Unfolds from 90deg (closed) to 0deg (open)
                y: -layer * 10,
                z: layer,
                opacity: 0.8 + (layer * 0.05),
                filter: `hue-rotate(${layer * 10}deg)`
            }}
        >
            <div
                className="w-full h-full rounded-[50%_50%_10%_10%] bg-gradient-to-t from-rose-900 via-rose-600 to-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.3)] border border-white/10"
                style={{
                    clipPath: "polygon(50% 0%, 100% 20%, 80% 100%, 20% 100%, 0% 20%)" // Stylized petal shape
                }}
            />
        </motion.div>
    );
};


export default function Letter() {
    const [progress, setProgress] = useState(0); // 0 to 100
    const [isComplete, setIsComplete] = useState(false);

    // Smooth spring for the bloom animation
    const springProgress = useSpring(0, { stiffness: 50, damping: 20 });

    const isHolding = useRef(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<any[]>([]);
    const animationFrame = useRef<number>(0);

    // Sync state to spring
    useEffect(() => {
        springProgress.set(progress);
    }, [progress, springProgress]);

    // --- INTERACTION LOOP ---
    useEffect(() => {
        const loop = setInterval(() => {
            if (isComplete) return;

            if (isHolding.current) {
                setProgress(p => Math.min(p + 0.4, 100)); // Charge up
            } else {
                setProgress(p => Math.max(p - 0.5, 0)); // Decay if released
            }
        }, 16); // ~60fps

        return () => clearInterval(loop);
    }, [isComplete]);

    useEffect(() => {
        if (progress >= 100) setIsComplete(true);
    }, [progress]);


    // --- PARTICLE SYSTEM (Embers) ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Init Particles
        for (let i = 0; i < 100; i++) {
            particles.current.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vy: -Math.random() * 1 - 0.2, // Float up
                size: Math.random() * 2,
                opacity: Math.random() * 0.5
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#fff";

            particles.current.forEach(p => {
                p.y += p.vy;
                if (p.y < 0) p.y = canvas.height; // Wrap

                // Draw
                ctx.globalAlpha = p.opacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
            animationFrame.current = requestAnimationFrame(render);
        };
        render();

        return () => cancelAnimationFrame(animationFrame.current);
    }, []);

    // --- HANDLERS ---
    const startObj = () => { isHolding.current = true; };
    const endObj = () => { isHolding.current = false; };


    return (
        <section
            className="relative w-full min-h-screen bg-[#020102] overflow-hidden flex flex-col items-center justify-center select-none"
            onMouseDown={startObj}
            onMouseUp={endObj}
            onTouchStart={startObj}
            onTouchEnd={endObj}
            onMouseLeave={endObj}
        >
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-50" />

            {/* --- INSTRUCTION --- */}
            <AnimatePresence>
                {!isComplete && progress < 10 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-20 text-center pointer-events-none"
                    >
                        <p className="text-rose-200/40 text-xs tracking-[0.4em] uppercase animate-pulse">
                            Touch & Hold to Bloom
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- THE ROSE CONTAINER --- */}
            <div className={`relative z-10 w-64 h-64 md:w-96 md:h-96 flex items-center justify-center transition-all duration-1000 ${isComplete ? 'blur-sm scale-110 opacity-20' : ''}`}>
                <div className="relative w-full h-full preserve-3d flex items-center justify-center" style={{ transformStyle: "preserve-3d", perspective: "800px" }}>
                    {/* CORE GLOW */}
                    <motion.div
                        className="absolute w-20 h-20 bg-rose-500 rounded-full blur-[50px]"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Generate Procedural Petals */}
                    {/* Layer 1 (Inner) */}
                    {[...Array(5)].map((_, i) => <Petal key={`l1-${i}`} index={i} total={5} progress={progress} />)}
                    {/* Layer 2 */}
                    {[...Array(5)].map((_, i) => <Petal key={`l2-${i}`} index={i + 5} total={5} progress={progress} />)}
                    {/* Layer 3 (Outer) */}
                    {[...Array(6)].map((_, i) => <Petal key={`l3-${i}`} index={i + 10} total={6} progress={progress} />)}

                </div>
            </div>

            {/* --- THE LETTER CONTENT (REVEAL) --- */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                <div className="max-w-xl text-center px-6">
                    {LETTER_LINES.map((line, i) => {
                        // Show line based on progress milestones
                        const lineTrigger = (i + 1) * (100 / (LETTER_LINES.length + 1));
                        const isVisible = progress > lineTrigger;

                        return (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                animate={{
                                    opacity: isVisible ? 1 : 0,
                                    y: isVisible ? 0 : 20,
                                    filter: isVisible ? "blur(0px)" : "blur(10px)"
                                }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-white/90 font-serif text-xl md:text-3xl leading-relaxed mb-6 drop-shadow-lg"
                            >
                                {line}
                            </motion.p>
                        );
                    })}
                </div>

                {/* FINAL SIGNATURE */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isComplete ? 1 : 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-12"
                >
                    <p className="text-rose-500 font-serif italic text-2xl">Forever Yours.</p>
                </motion.div>
            </div>

        </section>
    );
}
