"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// The list of names to cycle through
const NICKNAMES = [
    "Babe",
    "Mixxy",
    "Sunshine",
    "Miamor",
    "Princess"
];

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [index, setIndex] = useState(0);

    // 1. Text Cycle Logic - SLOWED DOWN to 3.5s
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % NICKNAMES.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    // 2. Parallax Logic
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(textRef.current, {
                yPercent: 50,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // 3. Generate floating particles
    const particles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        size: Math.random() * 6 + 2,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: Math.random() * 20 + 25,
        opacity: Math.random() * 0.4 + 0.1,
    }));

    return (
        <section
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden bg-black"
        >
            {/* --- BACKGROUND LAYER --- */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-black to-purple-950" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            </div>

            {/* --- PARTICLES LAYER --- */}
            <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute rounded-full bg-white/20 backdrop-blur-sm"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            left: `${particle.left}%`,
                            top: "-10%",
                            opacity: particle.opacity,
                        }}
                        animate={{
                            y: ["0vh", "110vh"],
                            x: [0, Math.random() * 100 - 50, 0],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            delay: particle.delay,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            {/* Film Grain Texture */}
            <div className="bg-noise absolute inset-0 z-[6] opacity-10 pointer-events-none" />

            {/* --- CONTENT LAYER --- */}
            <div className="relative z-10 flex items-center justify-center w-full h-full px-4">

                {/* Main Container */}
                <div ref={textRef} className="relative w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left">

                    {/* Sticker 1: Floating Heart (Left) */}
                    <motion.div
                        animate={{ y: [-15, 15, -15], rotate: [-5, 5, -5] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-24 left-10 md:-left-12 md:-top-32 z-20"
                    >
                        <div className="flex items-center justify-center w-20 h-20 md:w-28 md:h-28 bg-rose-500 rounded-full shadow-2xl rotate-[-12deg] border-4 border-white/10 backdrop-blur-sm">
                            <Heart className="text-white w-10 h-10 md:w-14 md:h-14 fill-white" strokeWidth={2.5} />
                        </div>
                    </motion.div>

                    {/* STATIC TEXT: "HEY" */}
                    <h1 className="text-7xl md:text-9xl font-bold tracking-tight text-white drop-shadow-2xl">
                        Hey
                    </h1>

                    {/* DYNAMIC TEXT SLIDER */}
                    {/* FIXED: Increased height (h-24/h-32) so text isn't cut off */}
                    <div className="relative h-24 md:h-40 overflow-hidden flex flex-col justify-center min-w-[280px] md:min-w-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={index}
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ y: "0%", opacity: 1 }}
                                exit={{ y: "-100%", opacity: 0 }}
                                transition={{ duration: 0.8, ease: [0.2, 1, 0.4, 1] }}
                                className="block text-6xl md:text-9xl font-serif italic text-rose-400 drop-shadow-lg absolute left-0 right-0 md:text-left text-center"
                                style={{ lineHeight: 1.1 }}
                            >
                                {NICKNAMES[index]}
                            </motion.span>
                        </AnimatePresence>

                        {/* The Red Scribble Underline */}
                        <svg className="absolute w-full bottom-0 left-0 -z-10 text-rose-600" viewBox="0 0 100 20" fill="none" height="20">
                            <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="8" strokeOpacity="0.8" />
                        </svg>
                    </div>

                    {/* Sticker 2: Glowing Star (Right) */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -bottom-20 right-4 md:-right-8 z-20"
                    >
                        <Star className="text-yellow-400 w-16 h-16 md:w-24 md:h-24 fill-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.5)]" />
                    </motion.div>

                    {/* Sticker 3: Sparkles (Top Right) */}
                    <motion.div
                        animate={{ rotate: [0, 360], scale: [0.8, 1.1, 0.8] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-16 right-10 md:right-20 opacity-60"
                    >
                        <Sparkles className="text-pink-200 w-12 h-12 md:w-20 md:h-20 fill-pink-200" />
                    </motion.div>

                </div>
            </div>

            {/* SCROLL INDICATOR */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.3em] uppercase z-20"
                animate={{ y: [0, 10, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Scroll for more
            </motion.div>

        </section>
    );
}
