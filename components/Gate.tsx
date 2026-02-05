"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useStore } from "@/store/useStore";
import { Heart } from "lucide-react";

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

    // Play wavy success sound
    const playSuccessSound = () => {
        if (!audioContextRef.current) return;

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        // Create wavy, ascending sound
        const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

        frequencies.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.frequency.value = freq;
            osc.type = 'sine';

            // Wavy effect with vibrato
            const vibrato = ctx.createOscillator();
            const vibratoGain = ctx.createGain();
            vibrato.frequency.value = 6; // 6 Hz vibrato
            vibratoGain.gain.value = 10;

            vibrato.connect(vibratoGain);
            vibratoGain.connect(osc.frequency);

            gain.gain.setValueAtTime(0.2, now + index * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.15 + 0.8);

            osc.connect(gain);
            gain.connect(ctx.destination);

            vibrato.start(now + index * 0.15);
            vibrato.stop(now + index * 0.15 + 0.8);
            osc.start(now + index * 0.15);
            osc.stop(now + index * 0.15 + 0.8);
        });
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
            playSuccessSound(); // Play wavy success sound

            gsap.to(contentRef.current, {
                scale: 1.03,
                duration: 0.2,
                ease: "back.out(1.7)",
                onComplete: () => {
                    gsap.to(contentRef.current, {
                        opacity: 0,
                        scale: 0.97,
                        y: -20,
                        duration: 0.7,
                        ease: "power2.in"
                    });
                }
            });

            gsap.to(containerRef.current, {
                scale: 1.15,
                opacity: 0,
                filter: "blur(40px)",
                duration: 1.8,
                ease: "power4.inOut",
                delay: 0.6,
                onComplete: () => {
                    setIsUnlocked(true);
                },
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
            <div className="absolute inset-0 overflow-hidden">
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

                {/* Minimal Input Field - Smaller */}
                <motion.form
                    onSubmit={handleSubmit}
                    animate={error ? { x: [-10, 10, -10, 10, -6, 6, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="w-full relative group mb-6"
                >
                    {/* Subtle Glow */}
                    <div className={`absolute -inset-3 bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-purple-500/10 rounded-xl blur-lg transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />

                    {/* Input */}
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="enter here..."
                            className="w-full py-4 px-6 text-xl md:text-2xl text-center text-white/85 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-xl outline-none placeholder:text-white/20 focus:border-rose-400/30 transition-all duration-500 font-light"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            autoFocus
                        />

                        {/* Accent Line */}
                        <motion.div
                            className="absolute bottom-0 left-1/2 h-px bg-gradient-to-r from-transparent via-rose-400/50 to-transparent"
                            initial={{ width: 0, x: "-50%" }}
                            animate={{ width: isFocused ? "80%" : "0%", x: "-50%" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
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
