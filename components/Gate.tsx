"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Lock, ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function Gate() {
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);
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

            // 0. VISUAL EXPLOSION (Sparkles)
            // Create a burst of particles from the center
            const centerParams = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * 200 + 50;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;

                particle.style.cssText = `
                    position: fixed;
                    left: ${centerParams.x}px;
                    top: ${centerParams.y}px;
                    width: ${Math.random() * 8 + 4}px;
                    height: ${Math.random() * 8 + 4}px;
                    background: ${Math.random() > 0.5 ? '#f43f5e' : '#fff'};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 10000;
                    box-shadow: 0 0 10px rgba(244,63,94,0.8);
                `;
                document.body.appendChild(particle);

                // Animate Particle
                gsap.to(particle, {
                    x: tx,
                    y: ty,
                    opacity: 0,
                    scale: 0,
                    duration: 1 + Math.random(),
                    ease: "power2.out",
                    onComplete: () => particle.remove()
                });
            }

            // 1. Create the Brush Overlay Container
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position: fixed; inset: 0; z-index: 9999; pointer-events: none; transform: translateX(-120%); display: flex; align-items: stretch;';

            // The "Ink" Body (Solid Black)
            const ink = document.createElement('div');
            ink.style.cssText = 'background: #000; flex: 1; min-width: 100vw;';

            // The "Brush Edge" (Jagged SVG Texture)
            const edge = document.createElement('div');
            // We use a background image for the jagged edge
            edge.style.cssText = 'width: 100px; background-color: transparent; background-image: url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 1000\' preserveAspectRatio=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M50,0 C20,50 80,100 30,150 C70,200 10,250 60,300 C20,350 80,400 30,450 C70,500 20,550 60,600 C10,650 80,700 30,750 C70,800 20,850 60,900 C10,950 80,1000 50,1000H0V0Z\' fill=\'%23000\'/%3E%3C/svg%3E"); background-size: 100% 100%; margin-left: -1px;';

            // Append: Ink is on the LEFT, Edge is on the RIGHT.
            overlay.appendChild(ink);
            overlay.appendChild(edge);

            document.body.appendChild(overlay);

            // 2. Animate WIPE ACROSS
            const timeline = gsap.timeline({
                onComplete: () => overlay.remove()
            });

            timeline
                .to(overlay, {
                    x: "0%", // Move to cover screen (Center)
                    duration: 0.8, // Slightly faster swipe
                    ease: "power2.inOut",
                    onComplete: () => {
                        setIsUnlocked(true); // Unlock while covered
                    }
                })
                .to(overlay, {
                    x: "120%", // Move off to the right
                    duration: 0.8,
                    ease: "power2.inOut",
                    delay: 0.1
                });

        } else {
            setError(true);
            setTimeout(() => setError(false), 1000); // Reset shake
        }
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black overflow-hidden">

            {/* --- TEXTURES (Matching Hero) --- */}
            <div className="absolute inset-0 z-0">
                {/* Radial Gradient for Depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-950/20 via-black to-black" />

                {/* Film Grain */}
                <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
                />

                {/* Stardust */}
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen"
                    style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}
                />
            </div>

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
        </div>
    );
}
