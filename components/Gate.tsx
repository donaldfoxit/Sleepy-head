"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Lock, ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function Gate() {
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false); // Track success animation
    const setIsUnlocked = useStore((state) => state.setIsUnlocked);

    // --- CONFIGURATION ---
    const PASSWORDS = ["forever", "Forever", "FOREVER"];

    const playSuccessSound = () => {
        const audio = new Audio('/sounds/correct-answer.mp3');
        audio.volume = 0.7;
        audio.play().catch(err => console.log('Audio playback failed:', err));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (PASSWORDS.includes(input.trim())) {
            // --- SUCCESS SEQUENCE ---
            playSuccessSound();

            // 1. Trigger Success State (Explosion & Fade)
            setSuccess(true);

            // 2. Wait for explosion/fade, then Unlock
            setTimeout(() => {
                setIsUnlocked(true);
            }, 2000); // Wait for the magic to happen

        } else {
            setError(true);
            setTimeout(() => setError(false), 1000); // Reset shake
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black overflow-hidden"
            animate={{ opacity: success ? 0 : 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }} // Smooth fade out after sparkles
        >

            {/* --- TEXTURES (Matching Hero) --- */}
            <div className="absolute inset-0 z-0">
                {/* Radial Gradient for Depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-950/20 via-black to-black" />

                {/* Film Grain */}
                <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
                />
            </div>

            {/* --- SUCCESS SPARKLE EXPLOSION --- */}
            {success && (
                <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                    {[...Array(50)].map((_, i) => (
                        <motion.div
                            key={`explode-${i}`}
                            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                            animate={{
                                scale: [0, Math.random() * 2 + 1, 0],
                                x: (Math.random() - 0.5) * window.innerWidth * 1.5,
                                y: (Math.random() - 0.5) * window.innerHeight * 1.5,
                                opacity: [1, 1, 0]
                            }}
                            transition={{
                                duration: Math.random() * 1.5 + 1,
                                ease: "easeOut"
                            }}
                            className="absolute rounded-full"
                            style={{
                                width: Math.random() * 6 + 2 + "px",
                                height: Math.random() * 6 + 2 + "px",
                                background: Math.random() > 0.5 ? '#fbbf24' : '#f43f5e', // Gold & Rose
                                boxShadow: "0 0 15px currentColor"
                            }}
                        />
                    ))}
                    {/* Central Flash */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 2, 3] }}
                        transition={{ duration: 0.8 }}
                        className="absolute w-full h-full bg-white rounded-full blur-3xl mix-blend-overlay"
                    />
                </div>
            )}

            <div className="relative z-10 w-full max-w-md px-6">

                {/* Icon */}
                <div className="flex justify-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                    >
                        <Lock className="w-6 h-6 text-white/60" />
                    </motion.div>
                </div>

                {/* Title */}
                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl text-center text-white font-bold mb-2 tracking-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    WHAT'S THE <span className="text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">MAGIC</span> WORD?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-white/40 text-sm mb-10 tracking-widest uppercase font-light"
                >
                    (Hint: It ends with "ER")
                </motion.p>

                {/* --- MAGICAL SPARKLES BACKGROUND --- */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-rose-300 rounded-full opacity-0" // Pink Sparkles
                            style={{
                                width: Math.random() * 4 + 1 + "px",
                                height: Math.random() * 4 + 1 + "px",
                                top: Math.random() * 100 + "%",
                                left: Math.random() * 100 + "%",
                                boxShadow: "0 0 10px rgba(244, 63, 94, 0.5)" // Pink Glow
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0],
                                y: -30,
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {/* Input Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative z-10 flex flex-col items-center gap-6 w-full max-w-2xl px-4" // Widened container for "Straight Line" look
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setError(false);
                            // No auto-submit
                        }}
                        placeholder="Type the magic word..."
                        className={`w-full bg-transparent border-b-2 border-white/20 py-4 text-center text-3xl md:text-5xl text-white placeholder-white/10 outline-none transition-all duration-500 focus:border-rose-500 focus:text-rose-100 focus:drop-shadow-[0_0_25px_rgba(244,63,94,0.6)] font-serif italic ${error ? 'animate-shake text-rose-500 border-rose-500' : ''}`}
                        autoFocus
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    />

                    {/* Submit Arrow (Only visible when typing) */}
                    {input.length > 0 && (
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            type="submit"
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors"
                        >
                            <ArrowRight size={24} />
                        </motion.button>
                    )}
                </motion.form>

                {/* Error Message */}
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-red-400/80 text-xs mt-6 tracking-widest uppercase"
                    >
                        Access Denied. Try "Favour"
                    </motion.p>
                )}
            </div>
        </motion.div>
    );
}
