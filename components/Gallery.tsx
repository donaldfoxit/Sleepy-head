"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

// --- MEMORIES CONFIGURATION ---
const MEMORIES = [
    {
        id: 1,
        src: "/videos/memories/memory-1.mp4",
        type: "video",
        caption: "The day you said yes",
        tagColor: "bg-purple-200/90 text-purple-900 border-purple-300 backdrop-blur-sm",
        rotation: -4,
        yOffset: 20,
    },
    {
        id: 2,
        src: "/videos/memories/memory-2.mov",
        type: "video",
        caption: "We look good together",
        tagColor: "bg-orange-200/90 text-orange-900 border-orange-300 backdrop-blur-sm",
        rotation: 3,
        yOffset: -20,
    },
    {
        id: 3,
        src: "/videos/memories/memory-3.mov",
        type: "video",
        caption: "Golden moments",
        tagColor: "bg-lime-200/90 text-lime-900 border-lime-300 backdrop-blur-sm",
        rotation: -3,
        yOffset: 30,
    },
    {
        id: 4,
        src: "/videos/memories/memory-4.mov",
        type: "video",
        caption: "My favorite view",
        tagColor: "bg-rose-200/90 text-rose-900 border-rose-300 backdrop-blur-sm",
        rotation: 5,
        yOffset: -10,
    },
];

export default function Gallery() {
    return (
        <section className="relative min-h-[100vh] w-full overflow-hidden flex flex-col items-center justify-center py-24">

            {/* --- BACKGROUND TEXTURE: Subtle Grid --- */}
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
            />

            {/* --- DECORATION: Night Nebula (Left) --- */}
            <div className="absolute top-[10%] left-[-10%] w-[60vw] h-[60vw] md:w-[45vw] md:h-[45vw] z-0 pointer-events-none opacity-40">
                <motion.div
                    className="w-full h-full bg-rose-950/40 rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* --- DECORATION: Deep Indigo Glow (Right) --- */}
            <div className="absolute bottom-[5%] right-[-10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] z-0 pointer-events-none opacity-30">
                <motion.div
                    className="w-full h-full bg-indigo-950/40 rounded-full blur-[150px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -50, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* --- DECORATION: Subtle Sparkles (Stars) --- */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}
            />

            {/* --- CLASSIC MESSY ROW LAYOUT --- */}
            <div className="relative z-10 w-full max-w-[95vw] px-4 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-0 md:-space-x-12 mb-20 md:mb-28 mt-10">
                {MEMORIES.map((memory) => (
                    <MemoryFrame key={memory.id} memory={memory} />
                ))}
            </div>

            {/* --- DESCRIPTIVE TEXT BLOCK --- */}
            <div className="relative z-10 text-center max-w-3xl px-6">
                <p
                    className="text-2xl md:text-4xl text-white/80 italic leading-relaxed mb-12 tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    style={{ fontFamily: "var(--font-bodoni), serif" }}
                >
                    "Every little moment I managed to capture made me know I wanted you from the first day"
                </p>

                {/* Bouncing Arrow */}
                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex justify-center text-rose-300/40"
                >
                    <ArrowDown size={32} strokeWidth={1.5} />
                </motion.div>
            </div>

        </section>
    );
}

// --- SUB-COMPONENT: MEMORY FRAME WITH HOVER PLAY ---
function MemoryFrame({ memory }: { memory: any }) {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    return (
        <motion.div
            initial={{ rotate: memory.rotation, y: memory.yOffset }}
            whileHover={{ scale: 1.15, rotate: 0, y: 0, zIndex: 100 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative group cursor-pointer shrink-0"
        >
            {/* Minimal Dark Border for a "Pressed Photo" Look */}
            <div className="relative w-[340px] md:w-[420px] aspect-[4/5] p-2 bg-[#0a0a0a] rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col items-center transition-all group-hover:border-rose-400/30">

                {/* Video Container */}
                <div className="w-full h-full bg-black overflow-hidden relative rounded-lg">
                    <video
                        ref={videoRef}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    >
                        <source src={memory.src} type={memory.src.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
                    </video>

                    {/* Gloss Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* OVERLAY CAPTION - Simplified Translucent Style */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10 px-6 text-center">
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="italic text-lg md:text-xl text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-wide"
                            style={{ fontFamily: "var(--font-bodoni), serif" }}
                        >
                            {memory.caption}
                        </motion.p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
