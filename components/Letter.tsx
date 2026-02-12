"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- CONTENT ---
const LETTER_CONTENT = [
    "I’ve been thinking about us...",
    "About how you make the ordinary feel like magic.",
    "You are my favorite notification,",
    "My safe space,",
    "And my greatest adventure.",
    "I wouldn't want to build this universe with anyone else.",
    "Forever Yours."
];

export default function Letter() {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<"envelope" | "memory" | "letter">("envelope");

    const handleOpen = () => {
        if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => setView("memory"), 800); // Show memory card after open
        }
    };

    const handleNext = () => {
        setView("letter");
    };

    return (
        <section className="relative w-full h-screen bg-[#1a1a1a] flex items-center justify-center overflow-hidden font-sans select-none">

            {/* Import Handwriting Font */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Share+Tech+Mono&display=swap');
            `}</style>

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/leather.png')]" />

            <div className="relative z-10 perspective-1000">
                <AnimatePresence mode="wait">

                    {/* --- 1. THE ENVELOPE --- */}
                    {view === "envelope" && (
                        <motion.div
                            key="envelope"
                            initial={{ opacity: 0, y: 50, rotateX: 20 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            exit={{ opacity: 0, scale: 1.5, rotateX: -20 }}
                            transition={{ duration: 0.8 }}
                            className="relative w-[320px] h-[220px] md:w-[400px] md:h-[280px] bg-[#fdfbf7] shadow-2xl rounded-sm cursor-pointer group"
                            onClick={handleOpen}
                        >
                            {/* Flap */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-1/2 bg-[#f2efe9] origin-top z-20 shadow-md"
                                style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }}
                                animate={{ rotateX: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                            />

                            {/* Envelope Body */}
                            <div className="absolute bottom-0 left-0 w-full h-full border-t-[20px] border-[#fdfbf7] z-10 bg-[#fdfbf7]"
                                style={{ clipPath: "polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%)" }}
                            />

                            {/* Wax Seal */}
                            <motion.div
                                animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 1.5 : 1 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                            >
                                <div className="w-16 h-16 bg-rose-700 rounded-full flex items-center justify-center shadow-lg border-2 border-rose-800">
                                    <div className="text-2xl text-rose-900 filter drop-shadow-md">❤</div>
                                </div>
                            </motion.div>

                            {/* Hint Text */}
                            {!isOpen && (
                                <motion.p
                                    className="absolute -bottom-12 w-full text-center text-white/30 text-xs tracking-[0.3em] uppercase"
                                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    Tap to Open
                                </motion.p>
                            )}
                        </motion.div>
                    )}


                    {/* --- 2. THE MEMORY (DASHBOARD) --- */}
                    {view === "memory" && (
                        <motion.div
                            key="memory"
                            initial={{ opacity: 0, y: 100, rotate: -5 }}
                            animate={{ opacity: 1, y: 0, rotate: -2 }}
                            exit={{ opacity: 0, x: -100, rotate: -15 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="relative w-[340px] h-[240px] md:w-[420px] md:h-[300px] bg-black border-4 border-white/10 rounded-xl shadow-2xl overflow-hidden cursor-pointer"
                            onClick={handleNext}
                        >
                            {/* Polaroid Frame / Card Paper */}
                            <div className="absolute inset-0 bg-[#111] p-4 flex flex-col justify-between font-mono relative">
                                {/* The "Screen" Glow */}
                                <div className="absolute inset-0 bg-red-900/5 pointer-events-none" />
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[50px] rounded-full pointer-events-none" />

                                {/* Top Bar */}
                                <div className="flex justify-between items-start z-10">
                                    <div className=" bg-red-600/20 px-2 py-1 rounded text-[10px] text-red-500 tracking-wider">
                                        BT Audio
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl md:text-5xl text-red-600 font-bold tracking-tighter drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                                            11:56<span className="text-lg align-top ml-1">PM</span>
                                        </div>
                                        <div className="text-red-800/80 text-xs tracking-widest mt-1">FEB 11 2026</div>
                                    </div>
                                </div>

                                {/* Center Track Info */}
                                <div className="z-10 mt-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-red-900/40 rounded flex items-center justify-center">
                                            <span className="text-red-500 text-xs">♫</span>
                                        </div>
                                        <div className="h-[2px] w-20 bg-red-800/30" />
                                    </div>
                                    <div className="text-red-500 text-lg md:text-xl font-bold tracking-wide uppercase truncate">
                                        James Smith
                                    </div>
                                    <div className="text-red-400/80 text-sm tracking-widest uppercase">
                                        Little Love
                                    </div>
                                </div>

                                {/* Bottom Controls Visual */}
                                <div className="z-10 mt-auto">
                                    <div className="w-full h-1 bg-red-900/20 rounded-full mb-2 overflow-hidden">
                                        <div className="w-1/3 h-full bg-red-600/60" />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-red-800/60 font-sans">
                                        <span>0:42</span>
                                        <span>3:15</span>
                                    </div>
                                </div>

                                {/* Handwritten Note Overlay */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                    animate={{ opacity: 1, scale: 1, rotate: -5 }}
                                    transition={{ delay: 1 }}
                                    className="absolute bottom-6 right-4 rotate-[-5deg] z-20"
                                >
                                    <p className="text-white text-3xl md:text-4xl drop-shadow-lg" style={{ fontFamily: "'Pinyon Script', cursive" }}>
                                        Our First Kiss <span className="text-2xl filter drop-shadow">💋</span>
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}


                    {/* --- 3. THE HANDWRITTEN LETTER --- */}
                    {view === "letter" && (
                        <motion.div
                            key="letter"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="relative w-full max-w-lg p-8 md:p-12 bg-[#f4f1ea] shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm rotate-1"
                        >
                            {/* Paper Texture */}
                            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

                            <div className="relative z-10 text-[#2c2222]">
                                <div className="mb-8 text-right opacity-60 font-serif text-sm italic">
                                    EST. 11.02.2026
                                </div>

                                {LETTER_CONTENT.map((line, i) => (
                                    <motion.p
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + i * 1.5, duration: 1 }} // Slow reveal
                                        className="text-2xl md:text-3xl leading-relaxed mb-6"
                                        style={{ fontFamily: "'Pinyon Script', cursive" }}
                                    >
                                        {line}
                                    </motion.p>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Hint for Memory Card */}
            <AnimatePresence>
                {view === "memory" && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-10 text-white/30 text-xs tracking-widest uppercase"
                    >
                        Tap to Read Letter
                    </motion.p>
                )}
            </AnimatePresence>

        </section>
    );
}
