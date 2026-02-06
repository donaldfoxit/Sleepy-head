"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface LoadingScreenProps {
    onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [displayText, setDisplayText] = useState("");
    const [progress, setProgress] = useState(0);
    const [started, setStarted] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const fullText = "Favour: Secret Talent = Sleep!!";
    const totalDuration = 2500;
    const letterDelay = totalDuration / fullText.length;

    // --- AUDIO: Cinematic Deep Boom & Chimes ---
    // Kept the cinematic start, but added the typing clicks back
    const playInteractionSound = () => {
        if (!audioContextRef.current) return;
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        // 1. Deep "Heartbeat" Boom
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.5);

        // 2. Sparkly Stardust Chimes
        const frequencies = [880, 1109, 1318, 1760];
        frequencies.forEach((freq, i) => {
            const chime = ctx.createOscillator();
            const chimeGain = ctx.createGain();
            chime.type = 'sine';
            chime.frequency.value = freq;
            const delay = i * 0.08;
            chimeGain.gain.setValueAtTime(0, now + delay);
            chimeGain.gain.linearRampToValueAtTime(0.1, now + delay + 0.05);
            chimeGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 2);
            chime.connect(chimeGain);
            chimeGain.connect(ctx.destination);
            chime.start(now + delay);
            chime.stop(now + delay + 2.5);
        });
    };

    // --- AUDIO: Subtle Typing Clicks ---
    const playTypingSound = () => {
        if (!audioContextRef.current) return;
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        const click = ctx.createOscillator();
        const clickGain = ctx.createGain();

        // High frequency for a crisp "mechanical" click
        click.frequency.value = 800 + Math.random() * 200;
        click.type = 'sine';

        // Very short and snappy
        clickGain.gain.setValueAtTime(0.05, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        click.connect(clickGain);
        clickGain.connect(ctx.destination);

        click.start(now);
        click.stop(now + 0.03);
    };

    const handleStart = () => {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        playInteractionSound();
        setStarted(true);
    };

    // Progression Logic
    useEffect(() => {
        if (!started) return;
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayText(fullText.slice(0, currentIndex));
                setProgress((currentIndex / fullText.length) * 100);

                // Play typing sound for each char
                if (currentIndex > 0 && currentIndex < fullText.length) {
                    playTypingSound();
                }

                currentIndex++;
            } else {
                clearInterval(typeInterval);
                setTimeout(onComplete, 800);
            }
        }, letterDelay);
        return () => clearInterval(typeInterval);
    }, [started]);

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center w-full h-screen overflow-hidden bg-black selection:bg-rose-500/30">

            {/* BACKGROUND: Deep Breathing Gradient */}
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-950/50 via-black to-black" />
            </motion.div>

            {/* FILM GRAIN & VIGNETTE */}
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none z-[1]" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 z-[2] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <AnimatePresence mode="wait">
                    {!started ? (
                        <motion.div
                            key="start-button"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                            transition={{ duration: 0.8 }}
                            className="cursor-pointer group relative"
                            onClick={handleStart}
                        >
                            {/* --- THE PULSATING LOVE CORE --- */}
                            <div className="relative flex items-center justify-center">
                                {/* Layer 1: Ambient Glow (Breathing) */}
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute w-40 h-40 bg-rose-500/30 rounded-full blur-[50px]"
                                />

                                {/* Layer 2: The Heartbeat (Rapid Pulse) */}
                                <motion.div
                                    animate={{ scale: [1, 1.08, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} // Heartbeat Rhythm
                                    className="relative z-10"
                                >
                                    <Heart
                                        size={64}
                                        weight="fill" // Lucide doesn't have weight, but we fill it
                                        className="text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)] fill-rose-500"
                                    />

                                    {/* Inner Shine */}
                                    <div className="absolute top-2 left-2 w-4 h-4 bg-white/40 blur-[2px] rounded-full" />
                                </motion.div>

                                {/* Layer 3: Orbiting Particles */}
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-2 h-2 bg-rose-300 rounded-full"
                                        animate={{
                                            rotate: 360,
                                            scale: [0.5, 1, 0.5]
                                        }}
                                        style={{
                                            left: "50%",
                                            top: "50%",
                                            x: Math.cos(i * 60 * (Math.PI / 180)) * 60,
                                            y: Math.sin(i * 60 * (Math.PI / 180)) * 60,
                                        }}
                                        transition={{
                                            duration: 3 + i,
                                            repeat: Infinity,
                                            ease: "linear",
                                            scale: { duration: 2, repeat: Infinity }
                                        }}
                                    />
                                ))}
                            </div>

                            {/* TEXT PROMPT */}
                            <motion.p
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="mt-12 text-center text-[10px] md:text-xs tracking-[0.4em] uppercase text-rose-200/50"
                            >
                                Tap to begin
                            </motion.p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="loading-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            {/* Stylized Loading Typography */}
                            <h2 className="text-3xl md:text-5xl font-serif italic text-white/90 mb-8 tracking-wide">
                                {displayText}
                                <span className="animate-pulse text-rose-500">_</span>
                            </h2>

                            {/* Minimal Line Progress */}
                            <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
