"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- THE LETTER CONTENT ---
const LETTER_LINES = [
    "I’ve been thinking about us...",
    "About how you make the ordinary feel like magic.",
    "You are my favorite notification,",
    "My safe space,",
    "And my greatest adventure.",
    "I wouldn't want to build this universe with anyone else."
];

// --- PHYSICS CONSTANTS ---
const PARTICLE_COUNT = 800; // Stars
const EASE = 0.05; // Forming text speed

export default function Letter() {
    const [phase, setPhase] = useState<"void" | "charging" | "exploding" | "universe">("void");
    const [progress, setProgress] = useState(0); // 0 to 100 for charging
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();

    // Interaction Refs
    const isHolding = useRef(false);
    const holdStartTime = useRef(0);
    const particles = useRef<Particle[]>([]);

    // --- PARTICLE CLASS ---
    class Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        color: string;
        targetX: number | null;
        targetY: number | null;
        friction: number;

        constructor(w: number, h: number) {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 0.5;

            // Random Star Colors
            const colors = ["#ffffff", "#ffecd1", "#ffe4e1", "#b0e0e6", "#ffd700"];
            this.color = colors[Math.floor(Math.random() * colors.length)];

            this.targetX = null;
            this.targetY = null;
            this.friction = 0.98;
        }

        update(w: number, h: number, currentPhase: string, holdFactor: number) {
            const cx = w / 2;
            const cy = h / 2;

            if (currentPhase === "charging") {
                // SUCK INTO CENTER
                const dx = cx - this.x;
                const dy = cy - this.y;
                // Stronger pull as holdFactor increases
                const pullStrength = 0.05 * (holdFactor / 100);

                this.vx += dx * pullStrength;
                this.vy += dy * pullStrength;
                this.vx *= 0.9;
                this.vy *= 0.9;

            } else if (currentPhase === "exploding") {
                // BIG BANG: Handled by initial burst, just friction here
                this.vx *= this.friction;
                this.vy *= this.friction;

            } else if (currentPhase === "universe") {
                // FLOAT / ORBIT
                if (this.targetX !== null && this.targetY !== null) {
                    // Form Text (if target set - future feature or subtle background shape)
                    // For now, let's keep them drifting to form a galaxy, maybe targeted later?
                    // Actually, let's just let them drift in universe mode for readability
                    this.vx += (Math.random() - 0.5) * 0.02;
                    this.vy += (Math.random() - 0.5) * 0.02;
                } else {
                    // Drift
                    this.vx += (Math.random() - 0.5) * 0.02;
                    this.vy += (Math.random() - 0.5) * 0.02;
                }
            } else {
                // VOID: Gentle float
                this.vx += (Math.random() - 0.5) * 0.01;
                this.vy += (Math.random() - 0.5) * 0.01;
            }

            this.x += this.vx;
            this.y += this.vy;

            // Screen Wrap (only in void/universe if not text forming)
            if (this.targetX === null) {
                if (this.x < 0) this.x = w;
                if (this.x > w) this.x = 0;
                if (this.y < 0) this.y = h;
                if (this.y > h) this.y = 0;
            }
        }

        draw(ctx: CanvasRenderingContext2D) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.size * 2;
            ctx.shadowColor = this.color;
            ctx.fill();
        }
    }

    // --- INITIALIZATION ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        // Init Particles
        if (particles.current.length === 0) {
            particles.current = Array.from({ length: PARTICLE_COUNT }, () => new Particle(w, h));
        }

        const animate = () => {
            // Clear
            ctx.fillStyle = "rgba(5, 5, 10, 0.3)"; // Trails
            if (phase === "exploding") ctx.fillStyle = "rgba(255, 255, 255, 0.1)"; // Flash effect fade
            ctx.fillRect(0, 0, w, h);

            // Update Logic
            if (isHolding.current && phase === "charging") {
                const heldTime = Date.now() - holdStartTime.current;
                const newProgress = Math.min((heldTime / 2000) * 100, 100); // 2s to charge
                setProgress(newProgress);

                if (newProgress >= 100) {
                    triggerBigBang(w, h); // Pass dimensions
                }
            } else if (!isHolding.current && phase === "charging") {
                // Decay if released early
                setProgress(p => Math.max(p - 2, 0));
            }

            // Draw Particles
            particles.current.forEach(p => {
                p.update(w, h, phase, progress);
                p.draw(ctx);
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            window.removeEventListener("resize", handleResize);
        };
    }, [phase, progress]);

    // --- HANDLERS ---

    const startCharge = () => {
        if (phase !== "void" && phase !== "charging") return;
        setPhase("charging");
        isHolding.current = true;
        holdStartTime.current = Date.now();
    };

    const endCharge = () => {
        if (phase !== "charging") return;
        isHolding.current = false;
        if (progress < 100) {
            // Reset to void if failed
            if (progress < 10) setPhase("void"); // Only reset if barely touched
        }
    };

    const triggerBigBang = (w: number, h: number) => {
        setPhase("exploding");
        isHolding.current = false;

        // EXPLOSION PHYSICS
        particles.current.forEach(p => {
            const angle = Math.random() * Math.PI * 2;
            const force = Math.random() * 50 + 20; // Massive speed
            p.vx = Math.cos(angle) * force;
            p.vy = Math.sin(angle) * force;
        });

        // Transition to Universe/Text after explosion settles
        setTimeout(() => {
            setPhase("universe");
        }, 2000);
    };

    return (
        <section
            className="relative w-full h-screen bg-[#05050a] overflow-hidden cursor-crosshair select-none touch-none"
            onMouseDown={startCharge}
            onMouseUp={endCharge}
            onTouchStart={startCharge}
            onTouchEnd={endCharge}
            onMouseLeave={endCharge}
        >
            <canvas ref={canvasRef} className="absolute inset-0 z-10 block" />

            {/* --- UI OVERLAY --- */}
            <AnimatePresence>

                {/* 1. VOID INSTRUCTION */}
                {phase === "void" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                    >
                        <div className="text-center">
                            <p className="text-white/30 font-mono text-xs tracking-[0.5em] uppercase animate-pulse">
                                Touch & Hold to Create
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* 2. CHARGING FEEDBACK */}
                {phase === "charging" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        {/* Shaking Text */}
                        <motion.div
                            animate={{
                                x: [0, -5, 5, -5, 5, 0],
                                filter: [`blur(0px)`, `blur(${progress / 20}px)`]
                            }}
                            transition={{ duration: 0.2, repeat: Infinity }}
                        >
                            <p className="text-white font-bold text-4xl md:text-6xl tracking-widest uppercase opacity-80"
                                style={{ textShadow: `0 0 ${progress}px white` }}>
                                {Math.floor(progress)}%
                            </p>
                        </motion.div>
                    </div>
                )}

                {/* 3. UNIVERSE / LETTER CONTENT */}
                {phase === "universe" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 1 }}
                        className="absolute inset-0 z-30 overflow-y-auto"
                    >
                        <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6">

                            {/* The "Constellation" Header */}
                            <motion.h1
                                initial={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-rose-200 text-center mb-16 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                style={{ fontFamily: "serif" }}
                            >
                                The Beginning
                            </motion.h1>

                            {/* Letter Lines */}
                            <div className="space-y-12 max-w-2xl text-center">
                                {LETTER_LINES.map((line, i) => (
                                    <motion.p
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 2 + (i * 0.8), duration: 1 }}
                                        className="text-white/80 font-serif text-xl md:text-3xl leading-relaxed"
                                    >
                                        {line}
                                    </motion.p>
                                ))}
                            </div>

                            {/* Final Signature */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 6, duration: 1.5 }}
                                className="mt-24"
                            >
                                <p className="text-white/40 font-mono text-xs tracking-widest uppercase mb-4 text-center">
                                    EST. 2024
                                </p>
                                <div className="text-rose-500 font-serif italic text-4xl">
                                    Your Name
                                </div>
                            </motion.div>

                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </section>
    );
}
