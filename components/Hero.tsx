"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import RadioVisualizer from "@/components/RadioVisualizer";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Parallax effect for the text
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
        >
            {/* --- CINEMATIC BACKGROUND (Dark Spotlight) --- */}
            <div className="absolute inset-0 z-0 bg-[#0a0a0a]">

                {/* 1. The Spotlight (Top Center) */}
                <div
                    className="absolute inset-0 opacity-60 pointer-events-none"
                    style={{
                        background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.15) 0%, rgba(20,20,20,0) 60%)"
                    }}
                />

                {/* 2. Atmospheric Fog/Glow (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent opacity-80" />

                {/* 3. Film Grain Overlay */}
                <div className="absolute inset-0 opacity-[0.12] pointer-events-none mix-blend-overlay"
                    style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
                />
            </div>

            {/* --- MAIN CONTENT --- */}
            <motion.div
                style={{ y: yText, opacity: opacityText }}
                className="relative z-10 w-full max-w-[95vw] h-full flex flex-col items-center justify-center py-12 select-none"
            >

                {/* RADIO VISUALIZER (Floating Above) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5, type: "spring", bounce: 0.4 }}
                    className="z-30 relative mb-8 md:mb-10"
                >
                    <RadioVisualizer />
                </motion.div>

                {/* HORIZONTAL TYPOGRAPHY "My BABy" */}
                <div className="flex items-baseline justify-center gap-4 md:gap-6 z-20 relative w-full px-4 text-center">

                    {/* "My" */}
                    <motion.span
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-4xl md:text-6xl text-white mix-blend-overlay italic relative -top-3 md:-top-5 shrink-0"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        My
                    </motion.span>

                    {/* "BABy" */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-[17vw] md:text-[21vw] leading-[0.8] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tight mix-blend-overlay pb-2"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        BABy
                    </motion.h1>
                </div>

            </motion.div>

            {/* --- SCROLL INDICATOR --- */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                className="absolute bottom-12 text-white/40 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
                <ArrowDown size={16} />
            </motion.div>

            {/* --- OVERLAY TEXTURE --- */}
            <div className="absolute inset-0 pointer-events-none z-20 mix-blend-soft-light opacity-30"
                style={{ background: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}
            />

        </section>
    );
}
