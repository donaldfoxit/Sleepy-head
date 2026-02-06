"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useStore } from "@/store/useStore";
import { Heart, Sparkles } from "lucide-react";

// --- CONFIGURATION ---
const MAGIC_WORD = "forever"; // <--- CHANGE THIS TO YOUR MAGIC WORD
const CLUE = "The name of our first date spot..."; // <--- CHANGE THIS

export default function Gate() {
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const setIsUnlocked = useStore((state) => state.setIsUnlocked);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Refs for GSAP animations
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const wipeRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    // Play entrance chime when component mounts
    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Play shimmer sound after wipe animation
        setTimeout(() => {
            if (!audioContextRef.current) return;
            const ctx = audioContextRef.current;
            const now = ctx.currentTime;

            // Create shimmer with rapidly ascending high frequencies
            const shimmerFrequencies = [1200, 1600, 2000, 2400, 2800, 3200];

            shimmerFrequencies.forEach((freq, index) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.frequency.value = freq;
                osc.type = 'sine';

                // Quick, sparkly envelope
                const startTime = now + index * 0.03;
                gain.gain.setValueAtTime(0.08, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.3);
            });
        }, 800);
    }, []);

    // Play custom success sound from file
    const playSuccessSound = () => {
        // Play audio file from public/sounds folder
        const audio = new Audio('/sounds/correct-answer.mp3');
        audio.volume = 0.7; // Adjust volume (0.0 to 1.0)
        audio.play().catch(err => console.log('Audio playback failed:', err));
    };

    // Initial Wipe & Entry Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Wipe animation (curtain reveal from left to right)
            gsap.fromTo(wipeRef.current,
                { x: "0%" },
                {
                    x: "100%",
                    duration: 1.5,
                    ease: "power3.inOut",
                    onComplete: () => {
                        if (wipeRef.current) {
                            wipeRef.current.style.display = "none";
                        }
                    }
                }
            );

            // Fade in content after wipe starts
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.6 }
            );

            // Gentle background movement
            gsap.to(bgRef.current, {
                x: "random(-30, 30)",
                y: "random(-30, 30)",
                duration: "random(15, 20)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (input.toLowerCase().trim() === MAGIC_WORD.toLowerCase()) {
            // --- SUCCESS SEQUENCE ---
            playSuccessSound();

            // 1. MASSIVE SPARKLE EXPLOSION
            const sparkleContainer = document.createElement('div');
            sparkleContainer.style.cssText = 'position: fixed; inset: 0; z-index: 9999; pointer-events: none; overflow: hidden;';
            document.body.appendChild(sparkleContainer);

            // Generate 300 sparkles for "Massive" effect
            for (let i = 0; i < 300; i++) {
                const sparkle = document.createElement('div');
                const size = Math.random() * 6 + 2;
                // Start from center
                const startX = 50;
                const startY = 50;
                // Explode outwards 360 degrees
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 100 + 20; // Explode far out
                const endX = 50 + Math.cos(angle) * distance;
                const endY = 50 + Math.sin(angle) * distance;

                sparkle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${startX}%;
                    top: ${startY}%;
                    background: #fda4af;
                    border-radius: 50%;
                    box-shadow: 0 0 ${size * 4}px rgba(251, 113, 133, 0.9);
                    transform: translate(-50%, -50%);
                `;
                sparkleContainer.appendChild(sparkle);

                // Animate expansion
                gsap.to(sparkle, {
                    left: `${endX}%`,
                    top: `${endY}%`,
                    opacity: 0,
                    scale: 0,
                    duration: Math.random() * 2 + 1, // 1-3 seconds
                    delay: Math.random() * 0.2, // Slight staggered burst
                    ease: "power4.out",
                });
            }

            // 2. THE TRANSITION: "Sparkle Whiteout"
            // Instead of blur, we flash white and then dissolve
            const whiteoutOverlay = document.createElement('div');
            whiteoutOverlay.style.cssText = 'position: fixed; inset: 0; bg-white; z-index: 9998; background: white; opacity: 0; pointer-events: none;';
            document.body.appendChild(whiteoutOverlay);

            // Flash white quickly to simulate explosion intensity
            gsap.to(whiteoutOverlay, {
                opacity: 1,
                duration: 1.5,
                ease: "power2.inOut",
                onComplete: () => {
                    // UNLOCK THE APP WHILE SCREEN IS WHITE
                    setIsUnlocked(true);

                    // Fade out the white overlay to reveal the new page
                    gsap.to(whiteoutOverlay, {
                        opacity: 0,
                        duration: 2,
                        delay: 0.5,
                        onComplete: () => {
                            whiteoutOverlay.remove();
                            sparkleContainer.remove();
                        }
                    });
                }
            });

            // Fade OUT the current content immediately
            gsap.to([contentRef.current, bgRef.current], {
                opacity: 0,
                scale: 0.9,
                duration: 0.5
            });


        } else {
            // --- ERROR SEQUENCE ---
            setError(true);
            setTimeout(() => setError(false), 500);

            setInput("");
            inputRef.current?.focus();
        }
    };

    // Generate floating particles
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: Math.random() * 15 + 20,
        opacity: Math.random() * 0.3 + 0.1,
    }));

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex items-center justify-center w-full h-screen overflow-hidden bg-black"
        >
            {/* Wipe/Curtain Overlay */}
            <div
                ref={wipeRef}
                className="absolute inset-0 z-[200] bg-gradient-to-r from-black via-rose-950 to-black"
            />

            {/* Softly Moving Gradient Background */}
            <div ref={bgRef} className="absolute inset-0 w-full h-full scale-110">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-950/40 via-black to-purple-950/30" />
                <div className="absolute inset-0 bg-gradient-to-tl from-pink-900/20 via-transparent to-red-900/20" />
            </div>

            {/* Floating Particles/Bubbles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
                            scale: [1, 1.2, 1],
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

            {/* Vignette */}
            <div className="vignette" />

            {/* Film Grain */}
            <div className="bg-noise" />

            {/* Main Content - Minimal & Smaller */}
            <div ref={contentRef} className="relative z-10 flex flex-col items-center w-full max-w-md px-6 text-center">

                {/* Minimal Heart Icon */}
                <motion.div
                    animate={{
                        scale: [1, 1.08, 1],
                        opacity: [0.6, 0.8, 0.6]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="mb-8"
                >
                    <Heart size={32} strokeWidth={1} className="text-rose-400/70" fill="currentColor" />
                </motion.div>

                {/* Minimal Title - Smaller Text */}
                <h1 className="mb-10 text-3xl md:text-4xl font-light tracking-tight text-white/90" style={{ fontFamily: "'Playfair Display', serif" }}>
                    What is the <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-pink-300">magic word</span>?
                </h1>

                <motion.form
                    onSubmit={handleSubmit}
                    animate={error ? { x: [-10, 10, -10, 10, -6, 6, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="w-full relative group mb-6 flex justify-center"
                >
                    {/* Minimal Input Container */}
                    <div className="relative w-full max-w-[300px]">

                        {/* The Input Itself */}
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="enter here..."
                            className="w-full py-2 text-xl md:text-2xl text-center text-white/90 bg-transparent border-b border-white/20 outline-none placeholder:text-white/10 transition-all duration-300 font-light tracking-widest uppercase"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }} // Elegant refined font
                            autoFocus
                        />

                        {/* Animated Glow Line / Underline */}
                        <motion.div
                            className="absolute bottom-0 left-0 h-[1px] bg-rose-300 shadow-[0_0_15px_rgba(251,113,133,0.6)]"
                            initial={{ width: "0%", left: "50%" }}
                            animate={{
                                width: isFocused || input.length > 0 ? "100%" : "0%",
                                left: isFocused || input.length > 0 ? "0%" : "50%",
                                opacity: isFocused ? 1 : 0.5
                            }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />

                        {/* Ambient Glow behind the text when focused */}
                        <motion.div
                            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-rose-500/20 blur-xl rounded-full -z-10"
                            animate={{ opacity: isFocused ? 1 : 0 }}
                            transition={{ duration: 0.5 }}
                        />

                    </div>
                </motion.form>

                {/* Minimal Clue */}
                <p className="text-[10px] md:text-xs tracking-[0.25em] text-white/30 uppercase font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {CLUE}
                </p>

            </div>
        </div>
    );
}
