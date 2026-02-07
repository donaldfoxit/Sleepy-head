"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather } from "lucide-react";

// --- THE LETTER CONTENT ---
const LETTER_LINES = [
    "I’ve been thinking about us...",
    "About how you make the ordinary feel like magic.",
    "You are my favorite notification,",
    "My safe space,",
    "And my greatest adventure.",
    "I wouldn't want to build this universe with anyone else."
];

export default function Letter() {
    const [isOpened, setIsOpened] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // --- SOUND EFFECTS (Optional Placeholder) ---
    const playMagicSound = () => {
        // const audio = new Audio("/sounds/shimmer.mp3");
        // audio.play().catch(() => {});
    };

    const handleOpen = () => {
        playMagicSound();
        setIsOpened(true);
    };

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
        >

            {/* --- BACKGROUND MOOD (Always Present) --- */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Subtle Heartbeat Glow in Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-rose-900/10 blur-[150px] rounded-full animate-pulse-slow mix-blend-screen" />
                <div className="bg-noise absolute inset-0 opacity-20 mix-blend-overlay" />
            </div>

            <AnimatePresence mode="wait">
                {!isOpened ? (
                    /* --- STEP 1: THE MASSIVE ENVELOPE GATE --- */
                    <motion.div
                        key="envelope-gate"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="relative z-20 flex flex-col items-center justify-center"
                    >
                        <motion.div
                            onClick={handleOpen}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            className="cursor-pointer group relative w-[650px] h-[450px] bg-[#fda4af] shadow-[0_0_50px_rgba(253,164,175,0.3)] flex items-center justify-center transform transition-transform duration-300"
                        >
                            {/* Flap (Top Triangle) */}
                            <div className="absolute top-0 left-0 w-0 h-0 border-l-[325px] border-r-[325px] border-t-[260px] border-l-transparent border-r-transparent border-t-[#f43f5e] origin-top z-20 group-hover:origin-top group-hover:rotate-x-180 transition-all duration-700 shadow-sm" />

                            {/* Address Text */}
                            <div className="z-10 text-center opacity-90 group-hover:opacity-60 transition-opacity mt-12">
                                <p className="italic text-white drop-shadow-sm text-5xl md:text-7xl tracking-tight" style={{ fontFamily: "var(--font-bodoni), serif" }}>To My Favorite Person</p>
                                <p className="font-mono text-sm text-rose-100 mt-3 uppercase tracking-[0.3em] font-bold">Confidential</p>
                            </div>

                            {/* Wax Seal */}
                            <div className="absolute z-30 w-24 h-24 bg-[#9f1239] rounded-full flex items-center justify-center shadow-lg border-4 border-[#881337] group-hover:scale-110 transition-transform">
                                <span className="text-rose-200 font-serif font-bold text-4xl">♥</span>
                            </div>

                            {/* Bottom Flaps */}
                            <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[325px] border-b-[240px] border-l-[#fb7185] border-b-transparent opacity-90" />
                            <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[325px] border-b-[240px] border-r-[#fb7185] border-b-transparent opacity-90" />

                            {/* "Flash" Effect on Click (White Overlay) */}
                            <div className="absolute inset-0 bg-white opacity-0 active:opacity-40 transition-opacity duration-100 rounded-sm pointer-events-none z-40" />
                        </motion.div>

                        <p className="mt-8 text-white/40 text-sm font-mono tracking-widest uppercase animate-pulse">
                            ( Click to Open )
                        </p>
                    </motion.div>

                ) : (
                    /* --- STEP 2: THE DARK MODE REVEAL CONTENT --- */
                    <motion.div
                        key="letter-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="relative z-10 w-full max-w-4xl py-32 px-6 flex flex-col items-center"
                    >
                        {/* Header Tag */}
                        <div className="mb-24 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                            >
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                <span className="text-xs font-bold tracking-[0.2em] text-rose-200 uppercase">
                                    A Note For You
                                </span>
                            </motion.div>
                        </div>

                        {/* Staggered Text Content */}
                        <div className="flex flex-col gap-24 md:gap-32 w-full">
                            {LETTER_LINES.map((line, i) => (
                                <ScrollRevealLine key={i} index={i}>
                                    {line}
                                </ScrollRevealLine>
                            ))}
                        </div>

                        {/* Signature Block */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ margin: "-100px" }}
                            transition={{ duration: 1.5 }}
                            className="relative mt-40 text-center"
                        >
                            <div className="text-white/40 text-sm mb-6 tracking-widest font-mono">WITH ALL MY LOVE,</div>
                            <div className="font-serif italic text-5xl md:text-7xl text-rose-500 -rotate-2 mix-blend-screen" style={{ fontFamily: "serif" }}>
                                Your Name
                            </div>

                            {/* Floating Feather */}
                            <motion.div
                                animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-16 -bottom-4 opacity-60"
                            >
                                <Feather className="w-20 h-20 text-rose-200/20" strokeWidth={1} />
                            </motion.div>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}

// --- SUB-COMPONENT: SCROLL REVEAL TEXT ---
function ScrollRevealLine({ children, index }: { children: string, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0.1, y: 50, filter: "blur(10px)" }}
            whileInView={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
            }}
            viewport={{ once: true, margin: "-15% 0px -15% 0px" }} // Triggers when element is in the middle 70% of screen
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex justify-center"
        >
            <p className={`
            text-4xl md:text-6xl font-serif leading-tight text-center max-w-3xl
            ${index % 2 === 0 ? "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "text-rose-100/90 drop-shadow-[0_0_15px_rgba(253,164,175,0.1)]"}
        `}>
                {children}
            </p>
        </motion.div>
    );
}
