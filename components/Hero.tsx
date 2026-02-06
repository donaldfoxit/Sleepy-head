"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Star } from "lucide-react";

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
            className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-center"
        >
            {/* --- CINEMATIC BACKGROUND --- */}
            <div className="absolute inset-0 z-0">
                {/* 1. The Video */}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                >
                    <source src="/169443-841382814_small.mp4" type="video/mp4" />
                </video>

                {/* 2. Dark Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60" />

                {/* 3. Film Grain Overlay */}
                {/* CSS-based noise texture */}
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
                />
            </div>

            {/* --- MAGAZINE LAYOUT CONTENT --- */}
            <motion.div
                style={{ y: yText, opacity: opacityText }}
                className="relative z-10 w-full max-w-[90vw] h-full flex flex-col justify-between py-12 md:py-20 select-none"
            >

                {/* Top Section: Date & Location (Movie Poster Style) */}
                <div className="flex justify-between items-start text-white/60 text-xs md:text-sm tracking-[0.2em] uppercase font-light mix-blend-difference">
                    <div className="flex flex-col gap-1">
                        <span>Est. 2024</span>
                        <span>London, UK</span>
                    </div>
                    <div className="flex flex-col text-right gap-1">
                        <span>Volume No. 1</span>
                        <span>The Love Letter</span>
                    </div>
                </div>

                {/* Center Section: Main Title */}
                <div className="flex flex-col items-center justify-center flex-grow">

                    {/* "To My" - Centered above Favorite */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="mb-[-2vw] z-20"
                    >
                        <p className="font-serif italic text-2xl md:text-3xl text-white mix-blend-overlay">
                            To My
                        </p>
                    </motion.div>

                    {/* "FAVORITE" - Huge, Bold, Serif */}
                    <div className="relative">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="text-[18vw] leading-[0.8] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tighter"
                            style={{ fontFamily: "'Playfair Display', serif" }} // Assuming Google Font avail or fallback
                        >
                            FAVORITE
                        </motion.h1>

                        {/* Decorative Star */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute top-[10%] right-[5%] text-white mix-blend-overlay"
                        >
                            <Star size={48} fill="white" />
                        </motion.div>
                    </div>

                    {/* "PERSON" - Outline or Lighter Weight */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="text-[12vw] leading-[0.8] font-serif italic text-white/90 -mt-[2vw] mix-blend-overlay"
                    >
                        person
                    </motion.h1>

                </div>

                {/* Bottom Section: Scroll Indicator */}
                <div className="flex justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                        className="flex flex-col items-center gap-2 text-white/50"
                    >
                        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
                        <ArrowDown size={16} />
                    </motion.div>
                </div>

            </motion.div>

            {/* --- OVERLAY TEXTURE --- */}
            {/* A subtle texture to unify everything */}
            <div className="absolute inset-0 pointer-events-none z-20 mix-blend-soft-light opacity-30"
                style={{ background: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}
            />

        </section>
    );
}
