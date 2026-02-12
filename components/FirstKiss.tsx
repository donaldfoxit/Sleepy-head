"use client";

import React from "react";
import { motion } from "framer-motion";

export default function FirstKiss() {
    return (
        <section className="relative w-full min-h-screen bg-black flex flex-col md:flex-row items-center justify-center overflow-hidden font-sans select-none">

            {/* Import Tech Font */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
            `}</style>

            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-black" />
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">

                {/* --- LEFT: THE DASHBOARD MEMORY --- */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center md:items-end text-center md:text-right space-y-2"
                >
                    {/* "Dashboard" Display container */}
                    <div className="bg-black/50 border border-red-900/30 p-8 rounded-2xl backdrop-blur-sm shadow-[0_0_50px_rgba(220,38,38,0.1)]">
                        <div className="text-red-600/60 text-xs tracking-[0.4em] uppercase mb-4 font-bold">
                            Time Stamp
                        </div>

                        {/* THE TIME */}
                        <h1 className="text-6xl md:text-8xl text-red-600 font-bold tracking-tighter drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] leading-none" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                            11:56<span className="text-2xl md:text-3xl align-top ml-2 opacity-50">PM</span>
                        </h1>

                        {/* THE DATE */}
                        <div className="text-red-800/80 text-lg md:text-xl tracking-[0.3em] font-mono mt-2">
                            FEB 11 2026
                        </div>

                        {/* AUDIO TRACK */}
                        <div className="mt-8 pt-6 border-t border-red-900/30 flex flex-col items-center md:items-end">
                            <div className="flex items-center gap-2 text-red-500/80 text-xs uppercase tracking-widest mb-1">
                                <span className="animate-pulse">●</span> Now Playing
                            </div>
                            <div className="text-white/90 text-2xl font-serif italic">
                                Little Love
                            </div>
                            <div className="text-white/40 text-sm font-light">
                                James Smith
                            </div>
                        </div>
                    </div>
                </motion.div>


                {/* --- RIGHT: THE GIANT KISS --- */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.4 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* Pulsing Glow Layer */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 blur-[80px] bg-rose-600 rounded-full"
                    />

                    {/* THE EMOJI */}
                    <motion.div
                        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 text-[150px] md:text-[250px] leading-none filter drop-shadow-2xl"
                    >
                        💋
                    </motion.div>

                    {/* Label */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="absolute -bottom-10 left-0 right-0 text-center text-white/50 text-sm tracking-[0.5em] uppercase font-light"
                    >
                        Our First Kiss
                    </motion.p>
                </motion.div>

            </div>
        </section>
    );
}
