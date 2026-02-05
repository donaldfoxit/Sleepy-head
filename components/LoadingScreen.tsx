"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
    const totalDuration = 3000; // 3 seconds total
    const letterDelay = totalDuration / fullText.length;

    // Create light mouse click sound
    const playTypingSound = () => {
        if (!audioContextRef.current) return;

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        // Low frequency click (mouse button press)
        const click = ctx.createOscillator();
        const clickGain = ctx.createGain();

        // Low frequency for subtle click
        click.frequency.value = 150 + Math.random() * 50;
        click.type = 'sine';

        // Very short and quiet
        clickGain.gain.setValueAtTime(0.03, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

        click.connect(clickGain);
        clickGain.connect(ctx.destination);

        click.start(now);
        click.stop(now + 0.015);
    };

    // Create beautiful chime sound
    const playChimeSound = () => {
        if (!audioContextRef.current) return;

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        // Create harmonious chime with multiple frequencies
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (C major chord)

        frequencies.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.frequency.value = freq;
            osc.type = 'sine';

            gain.gain.setValueAtTime(0.15, now + index * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.05 + 1.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + index * 0.05);
            osc.stop(now + index * 0.05 + 1.5);
        });
    };

    const handleStart = () => {
        // Initialize audio context on user interaction
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        playChimeSound(); // Play chime when heart is clicked
        setStarted(true);
    };

    useEffect(() => {
        if (!started) return;

        let currentIndex = 0;

        const typeInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayText(fullText.slice(0, currentIndex));
                setProgress((currentIndex / fullText.length) * 100);

                // Play typing sound for each character (except spaces)
                if (currentIndex > 0 && fullText[currentIndex - 1] !== ' ') {
                    playTypingSound();
                }

                currentIndex++;
            } else {
                clearInterval(typeInterval);
                // Wait a moment before transitioning
                setTimeout(() => {
                    onComplete();
                }, 500);
            }
        }, letterDelay);

        return () => clearInterval(typeInterval);
    }, [started]);

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center w-full h-screen overflow-hidden bg-black">
            {/* Softly Moving Gradient Background */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-950/40 via-black to-purple-950/30" />
                <div className="absolute inset-0 bg-gradient-to-tl from-pink-900/20 via-transparent to-red-900/20" />
            </div>

            {/* Vignette */}
            <div className="vignette" />

            {/* Film Grain */}
            <div className="bg-noise" />

            {/* Loading Content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-8">

                {!started ? (
                    // Heart-Shaped Button
                    <motion.button
                        onClick={handleStart}
                        className="relative group flex flex-col items-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/30 via-pink-500/30 to-rose-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Heart Icon */}
                        <Heart
                            size={80}
                            strokeWidth={1.5}
                            className="text-rose-400/80 group-hover:text-rose-300 transition-colors duration-300 relative z-10"
                            fill="currentColor"
                        />

                        {/* Text Below Heart */}
                        <p
                            className="mt-4 text-sm tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors duration-300 uppercase text-center"
                            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                        >
                            Click to Enter
                        </p>
                    </motion.button>
                ) : (
                    <>
                        {/* Typewriter Text - Single Line */}
                        <div className="mb-12 min-h-[80px] flex items-center justify-center w-full">
                            <h1
                                className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-rose-300 whitespace-nowrap"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {displayText}
                                <motion.span
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    className="inline-block w-0.5 h-10 ml-1 bg-rose-300/70 align-middle"
                                />
                            </h1>
                        </div>

                        {/* Loading Bar */}
                        <div className="w-full max-w-md">
                            <div className="relative h-1 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                                {/* Progress Bar */}
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 rounded-full"
                                    style={{ width: `${progress}%` }}
                                    transition={{ duration: 0.1 }}
                                />

                                {/* Shimmer Effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    animate={{
                                        x: ["-100%", "200%"],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                            </div>

                            {/* Progress Percentage */}
                            <p
                                className="mt-4 text-center text-xs tracking-[0.3em] text-white/30 uppercase font-light"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                {Math.round(progress)}%
                            </p>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
