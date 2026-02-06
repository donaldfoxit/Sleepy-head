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
            playSuccessSound(); // Play custom success sound

            // Create magical sparkles
            const sparkleContainer = document.createElement('div');
            sparkleContainer.style.cssText = 'position: fixed; inset: 0; z-index: 150; pointer-events: none;';
            containerRef.current?.appendChild(sparkleContainer);

            // Generate 50 sparkles
            for (let i = 0; i < 50; i++) {
                const sparkle = document.createElement('div');
                const size = Math.random() * 8 + 4;
                const startX = 50 + (Math.random() - 0.5) * 20; // Center with slight variation
                const startY = 50 + (Math.random() - 0.5) * 20;
                const endX = Math.random() * 100;
                const endY = Math.random() * 100;

                sparkle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${startX}%;
                    top: ${startY}%;
                    background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,200,255,0.8) 50%, transparent 100%);
                    border-radius: 50%;
                    box-shadow: 0 0 ${size * 2}px rgba(255,255,255,0.8), 0 0 ${size * 4}px rgba(255,200,255,0.4);
                    pointer-events: none;
                `;

                sparkleContainer.appendChild(sparkle);

                // Animate sparkle
                gsap.to(sparkle, {
                    left: `${endX}%`,
                    top: `${endY}%`,
                    opacity: 0,
                    scale: 0,
                    duration: 1.5 + Math.random() * 0.5,
                    delay: Math.random() * 0.3,
                    ease: "power2.out",
                    onComplete: () => sparkle.remove()
                });
            }

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
