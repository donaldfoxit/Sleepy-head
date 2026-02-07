"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";

// --- CONTENT CONFIGURATION ---
const SECTIONS = [
    {
        id: "spark",
        title: "The Spark",
        content: "It started with a glance, a moment that felt like the universe aligning. I didn't know then that you would become my everything, but my soul recognized you before my heart even understood."
    },
    {
        id: "fire",
        title: "The Fire",
        content: "Every day since has been a burning testament to what love should be. You challenge me, you hold me, and you make the ordinary feel like a cinematic masterpiece. You are my muse and my peace."
    },
    {
        id: "eternal",
        title: "The Eternal",
        content: "I promise to build a future as beautiful as you are. To stand by you in the quiet moments and the loud ones. This isn't just for now; it's for every lifetime I'm lucky enough to find you in."
    }
];

interface ManifestoProps {
    onComplete: () => void;
}

export default function Manifesto({ onComplete }: ManifestoProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [viewedSections, setViewedSections] = useState<Set<string>>(new Set());
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // --- TYPEWRITER EFFECT ---
    useEffect(() => {
        if (!activeSection) return;

        const targetContent = SECTIONS.find(s => s.id === activeSection)?.content || "";
        let currentIndex = 0;
        setDisplayedText("");
        setIsTyping(true);

        const typingInterval = setInterval(() => {
            if (currentIndex <= targetContent.length) {
                setDisplayedText(targetContent.slice(0, currentIndex));
                currentIndex++;
            } else {
                setIsTyping(false);
                clearInterval(typingInterval);

                // Mark section as viewed
                setViewedSections(prev => {
                    const newSet = new Set(prev);
                    newSet.add(activeSection);
                    return newSet;
                });
            }
        }, 30); // Typing speed

        return () => clearInterval(typingInterval);
    }, [activeSection]);

    // --- COMPLETION CHECK ---
    useEffect(() => {
        if (viewedSections.size === SECTIONS.length) {
            // Slight delay before unlocking the next part
            const timeout = setTimeout(() => {
                onComplete();
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [viewedSections, onComplete]);

    return (
        <section className="relative min-h-[80vh] w-full flex items-center justify-center py-20 px-4 md:px-20 overflow-hidden">

            {/* Background Atmosphere */}
            {/* Background Atmosphere - REMOVED for seamless blend */}
            {/* <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-rose-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px]" />
            </div> */}

            <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">

                {/* --- LEFT COLUMN: NAVIGATION --- */}
                <div className="md:col-span-4 flex flex-col justify-center space-y-6">
                    <h2 className="text-white/40 uppercase tracking-[0.2em] text-sm mb-4 font-mono">
                        Select a Chapter
                    </h2>

                    {SECTIONS.map((section) => {
                        const isActive = activeSection === section.id;
                        const isViewed = viewedSections.has(section.id);

                        return (
                            <motion.button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`text-left group relative py-4 transition-all duration-300 ${isActive ? "pl-6" : "pl-0"}`}
                            >
                                {/* Active Indicator Line */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeLine"
                                        className="absolute left-0 top-0 bottom-0 w-[2px] bg-rose-500"
                                    />
                                )}

                                {/* Gold Sparkles on Active Section */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeSparkles"
                                        className="absolute -left-12 top-1/2 -translate-y-1/2"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, ease: "backOut" }}
                                    >
                                        <Sparkles
                                            size={32}
                                            strokeWidth={1}
                                            className="text-amber-400 fill-amber-400/20 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse"
                                        />
                                    </motion.div>
                                )}

                                <span
                                    className={`text-3xl md:text-5xl italic tracking-tight transition-colors duration-300 relative z-10
                                    ${isActive ? "text-white" : "text-white/30 group-hover:text-white/60"}`}
                                    style={{ fontFamily: "var(--font-bodoni), serif" }}
                                >
                                    {section.title}
                                    {isActive && <SparkleDust />}
                                </span>

                                {/* Viewed Indicator */}
                                {isViewed && !isActive && (
                                    <span className="ml-3 text-rose-500/50 text-xs">●</span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* --- RIGHT COLUMN: DISPLAY (TYPEWRITER) --- */}
                <div className="md:col-span-8 min-h-[400px] flex items-center">
                    <motion.div
                        key={activeSection || "idle"}
                        initial={{
                            boxShadow: "0 0 0 rgba(0,0,0,0), inset 0 0 0 1px rgba(255, 255, 255, 0.02)",
                            background: "rgba(0, 0, 0, 0.3)"
                        }}
                        animate={{
                            boxShadow: activeSection ? "0 0 40px rgba(244, 63, 94, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.2)" : "0 0 0 rgba(0,0,0,0), inset 0 0 0 1px rgba(255, 255, 255, 0.02)",
                            background: activeSection ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.3)"
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative w-full p-8 md:p-12 rounded-2xl backdrop-blur-md min-h-[300px] md:min-h-[400px] flex flex-col justify-center"
                    >

                        {/* MAIL HEADER */}
                        <div className="absolute top-0 left-0 right-0 h-16 border-b border-white/10 flex items-center px-8 justify-between bg-white/5 rounded-t-2xl">
                            <div className="flex flex-col">
                                <span className="text-xs text-white/40 font-mono uppercase tracking-wider mb-1">To:</span>
                                <span className="text-white font-medium tracking-wide">Favour</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-white/40 font-mono uppercase tracking-wider mb-1">From:</span>
                                <span className="text-white font-medium tracking-wide">Me</span>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeSection ? (
                                <motion.div
                                    key={activeSection}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="pt-12"
                                >
                                    <p
                                        className="text-white/90 text-xl md:text-3xl leading-relaxed font-light tracking-wide"
                                        style={{ whiteSpace: "pre-wrap" }}
                                    >
                                        {displayedText}
                                        {isTyping && (
                                            <span className="inline-block w-[2px] h-[1em] bg-rose-500 ml-1 animate-pulse align-middle" />
                                        )}
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-white/20 h-full pt-10">
                                    <p className="font-mono text-sm tracking-widest uppercase">
                                        Waiting for input...
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Footer Info */}
                        <div className="absolute bottom-6 right-8 text-white/20 text-xs font-mono">
                            {activeSection ? "Manifesto // " + activeSection.toUpperCase() : "System Ready"}
                        </div>

                    </motion.div>
                </div>

            </div>
        </section >
    );
}

// --- SUB-COMPONENT: SPARKLE DUST ---
function SparkleDust() {
    // Generate random particles
    const particles = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100 - 20, // Spread around text
        y: Math.random() * 40 - 20,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 2,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                    style={{
                        width: p.size,
                        height: p.size,
                        top: "50%",
                        left: "50%",
                    }}
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        x: p.x,
                        y: p.y,
                        scale: [0, 1, 0]
                    }}
                    transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
}
