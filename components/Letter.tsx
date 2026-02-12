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

    // Flow: Envelope -> Letter (No memory card step)
    const [view, setView] = useState<"envelope" | "letter">("envelope");

    const handleOpen = () => {
        if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => setView("letter"), 800); // 800ms fade/open transition
        }
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


                    {/* --- 2. THE HANDWRITTEN LETTER --- */}
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

        </section>
    );
}
