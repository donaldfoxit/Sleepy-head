"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

// --- TYPES ---
interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
    baseX: number;
    baseY: number;
}

export default function QuantumTouch() {
    const [status, setStatus] = useState<"idle" | "syncing" | "complete">("idle");
    const [progress, setProgress] = useState(0); // 0-100
    const [showDates, setShowDates] = useState(false); // Finale State
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const particles = useRef<Particle[]>([]);
    const animationFrame = useRef<number>(0);
    const isHolding = useRef(false);

    // --- CONFIGURATION ---
    const CHARGE_SPEED = 0.6;
    const DECAY_SPEED = 0.4;

    // --- PARTICLE SYSTEM ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles.current = [];
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            // Create a "Nebula" cloud
            for (let i = 0; i < 300; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * 200; // Cloud radius
                const x = cx + Math.cos(angle) * dist;
                const y = cy + Math.sin(angle) * dist;

                particles.current.push({
                    x, y,
                    baseX: x, baseY: y,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 0.5,
                    color: Math.random() > 0.5 ? "rgba(244, 63, 94," : "rgba(251, 191, 36,", // Partial rgba string
                    life: Math.random() * 100
                });
            }
        };

        resize();
        window.addEventListener("resize", resize);

        const loop = () => {
            // Update Progress
            if (status !== "complete") {
                if (isHolding.current) {
                    setProgress(p => Math.min(p + CHARGE_SPEED, 100));
                } else {
                    setProgress(p => Math.max(p - DECAY_SPEED, 0));
                }
            }

            // Check Complete
            if (progress >= 100 && status !== "complete") {
                handleCompletion();
            }

            // Draw
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // "Nebula" Logic
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const pulseFactor = 1 + (progress / 100) * 0.5; // Expands as you hold

            particles.current.forEach(p => {
                // Breathing motion
                const time = Date.now() * 0.001;
                const breath = Math.sin(time + p.x) * 0.5;

                // If holding, suck in slightly, then explode on complete
                let tx = p.baseX;
                let ty = p.baseY;

                if (isHolding.current) {
                    // Attraction to center (jittery)
                    tx = cx + (p.baseX - cx) * 0.8;
                    ty = cy + (p.baseY - cy) * 0.8;
                }

                p.x += (tx - p.x) * 0.05;
                p.y += (ty - p.y) * 0.05;
                p.x += Math.sin(time * 2 + p.y * 0.01) * 0.5; // Organic drift

                // Opacity based on charge
                const alpha = 0.3 + (progress / 150) + Math.random() * 0.2;

                ctx.fillStyle = `${p.color} ${alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * pulseFactor, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrame.current = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrame.current);
        };
    }, [progress, status]); // Re-bind if these change broadly, but refs handle frame-by-frame

    // --- HANDLERS ---
    const startSync = () => {
        if (status === "complete") return;
        isHolding.current = true;
        setStatus("syncing");
    };

    const stopSync = () => {
        if (status === "complete") return;
        isHolding.current = false;
        setStatus("idle");
    };

    const handleCompletion = () => {
        setStatus("complete");
        isHolding.current = false;

        // Explosion Effect (Canvas)
        const canvas = canvasRef.current;
        if (canvas) {
            particles.current.forEach(p => {
                const angle = Math.random() * Math.PI * 2;
                const force = Math.random() * 20 + 10;
                p.baseX = canvas.width / 2 + Math.cos(angle) * 1000; // Fly off screen
                p.baseY = canvas.height / 2 + Math.sin(angle) * 1000;
            });
        }
    };

    const revealDates = () => {
        setShowDates(true);
    };


    return (
        <section
            ref={containerRef}
            className="relative w-full h-screen bg-[#050505] overflow-hidden select-none touch-none flex flex-col items-center justify-center catch-all-events"
            onMouseDown={startSync}
            onMouseUp={stopSync}
            onTouchStart={startSync}
            onTouchEnd={stopSync}
            onMouseLeave={stopSync}
        >
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

            {/* --- THE NEBULA HEART --- */}
            <AnimatePresence>
                {status !== "complete" && (
                    <motion.div
                        className="relative z-10 flex flex-col items-center justify-center"
                        exit={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* The Glowing Core */}
                        <div className="relative">
                            {/* Inner Core */}
                            <motion.div
                                animate={{
                                    scale: isHolding.current ? [1, 1.2, 1] : [1, 1.05, 1],
                                    boxShadow: isHolding.current
                                        ? "0 0 100px rgba(244,63,94,0.6)"
                                        : "0 0 40px rgba(244,63,94,0.2)"
                                }}
                                transition={{
                                    duration: isHolding.current ? 0.4 : 2, // Faster heartbeat when holding
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-rose-500 via-purple-600 to-black blur-md"
                            />

                            {/* Outer Rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border border-rose-500/20 blur-[1px] scale-110"
                            />

                            {/* Instruction Text */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <motion.p
                                    animate={{ opacity: isHolding.current ? 1 : 0.5 }}
                                    className="text-white/60 font-mono text-xs tracking-[0.3em] uppercase"
                                >
                                    {isHolding.current ? "SYNCING..." : "HOLD TO SYNC"}
                                </motion.p>
                            </div>
                        </div>

                        {/* Progress Bar (Subtle) */}
                        {isHolding.current && (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 200, opacity: 1 }}
                                className="mt-12 h-0.5 bg-white/10 rounded-full overflow-hidden"
                            >
                                <motion.div
                                    className="h-full bg-rose-500 box-shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>


            {/* --- THE REVEAL --- */}
            {status === "complete" && !showDates && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="relative z-20 text-center px-4"
                >
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-white/40 text-sm tracking-[0.5em] uppercase mb-6"
                    >
                        Connection Established
                    </motion.h2>

                    <motion.h1
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="text-5xl md:text-7xl font-serif text-white mb-12 drop-shadow-[0_0_30px_rgba(244,63,94,0.3)] leading-tight"
                    >
                        Will You Be<br />My Valentine?
                    </motion.h1>

                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(244,63,94,0.6)" }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ delay: 1.5 }}
                        onClick={revealDates}
                        className="px-12 py-5 bg-gradient-to-r from-rose-600 to-rose-500 rounded-full text-white font-bold tracking-[0.2em] shadow-2xl relative overflow-hidden group"
                    >
                        <span className="relative z-10">YES, FOREVER</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </motion.button>
                </motion.div>
            )}


            {/* --- THE DATE SELECTION (Glassmorphic Portals) --- */}
            <AnimatePresence>
                {showDates && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="relative z-30 w-full max-w-6xl mx-auto px-4 pointer-events-auto flex flex-col md:flex-row gap-8 items-center justify-center min-h-[60vh]"
                    >
                        {/* Title */}
                        <motion.h2
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute top-0 left-0 right-0 text-center text-white/40 text-sm tracking-[0.5em] uppercase hidden md:block"
                        >
                            Choose Our Adventure
                        </motion.h2>


                        {/* CARD 1: CINEMA */}
                        <DatePortal
                            title="Starlight Cinema"
                            subtitle="Movie in the Park"
                            icon="🌜"
                            gradient="from-indigo-500/10 to-blue-900/10"
                            border="border-indigo-500/30"
                            delay={0.2}
                            details={{
                                location: "Centennial Park",
                                time: "8:00 PM",
                                vibe: "Blankets, stars, and cinema."
                            }}
                            onSelect={() => {
                                window.open(`https://wa.me/1234567890?text=${encodeURIComponent("I choose the Starlight Cinema! 🌜🍿 Let's watch a movie in the park.")}`, '_blank');
                            }}
                        />

                        {/* CARD 2: CAR DATE */}
                        <DatePortal
                            title="Neon & Nostalgia"
                            subtitle="Car Date + Photo Booth"
                            icon="📸"
                            gradient="from-rose-500/10 to-pink-900/10"
                            border="border-rose-500/30"
                            delay={0.4}
                            details={{
                                location: "Drive-In & Arcade",
                                time: "7:30 PM",
                                vibe: "Cozy car vibes & fun photos."
                            }}
                            onSelect={() => {
                                window.open(`https://wa.me/1234567890?text=${encodeURIComponent("I choose Neon & Nostalgia! 📸🚗 Car date and crazy photo booth time!")}`, '_blank');
                            }}
                        />

                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}

// --- SUB-COMPONENT: DATE PORTAL ---
function DatePortal({ title, subtitle, icon, gradient, border, delay, details, onSelect }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.8, ease: "easeOut" }}
            whileHover={{ y: -10, scale: 1.02 }}
            className={`relative group w-full md:w-[400px] h-[500px] rounded-[30px] border ${border} bg-gradient-to-b ${gradient} backdrop-blur-md overflow-hidden cursor-pointer`}
            onClick={onSelect}
        >
            {/* Hover Glow */}
            <div className={`absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                <div>
                    <div className="text-6xl mb-6">{icon}</div>
                    <h3 className="text-3xl font-serif text-white mb-2 leading-tight">{title}</h3>
                    <p className="text-white/60 text-sm tracking-wider uppercase">{subtitle}</p>
                </div>

                <div className="space-y-4">
                    <div className="w-12 h-[1px] bg-white/20" />
                    <div className="flex justify-between text-xs text-white/50 tracking-widest uppercase">
                        <span>{details.time}</span>
                        <span>{details.location}</span>
                    </div>
                    <p className="text-sm text-white/80 font-light italic leading-relaxed">
                        "{details.vibe}"
                    </p>

                    <button className="mt-8 w-full py-4 bg-white/10 hover:bg-white text-white hover:text-black transition-all duration-300 rounded-xl font-bold uppercase text-xs tracking-[0.2em] border border-white/10">
                        Claim Date
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
