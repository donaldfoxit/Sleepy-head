"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

// --- MEMORIES CONFIGURATION ---
const MEMORIES = [
    {
        id: 1,
        src: "/photo1.png",
        caption: "The day you said yes",
        tagColor: "bg-purple-200/90 text-purple-900 border-purple-300 backdrop-blur-sm",
        rotation: -4,
        yOffset: 20,
    },
    {
        id: 2,
        src: "/photo2.png",
        caption: "We look good together",
        tagColor: "bg-orange-200/90 text-orange-900 border-orange-300 backdrop-blur-sm",
        rotation: 3,
        yOffset: -20,
    },
    {
        id: 3,
        src: "/photo3.png",
        caption: "Pure happiness",
        tagColor: "bg-lime-200/90 text-lime-900 border-lime-300 backdrop-blur-sm",
        rotation: -3,
        yOffset: 30,
    },
    {
        id: 4,
        src: "/photo4.png",
        caption: "My favorite view",
        tagColor: "bg-rose-200/90 text-rose-900 border-rose-300 backdrop-blur-sm",
        rotation: 5,
        yOffset: -10,
    },
];

export default function Gallery() {
    return (
        <section className="relative min-h-[100vh] w-full overflow-hidden bg-[#EFECE6] flex flex-col items-center justify-center py-24">

            {/* --- BACKGROUND TEXTURE: Subtle Grid --- */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />

            {/* --- DECORATION: The Amoeba Blob (Left) --- */}
            <div className="absolute top-[15%] left-[-5%] w-[50vw] h-[50vw] md:w-[35vw] md:h-[35vw] z-0 pointer-events-none opacity-90 mix-blend-multiply">
                <motion.svg
                    viewBox="0 0 200 200"
                    className="w-full h-full text-[#6B90FF] fill-current drop-shadow-xl"
                    animate={{ rotate: [0, 10, 0], scale: [1, 1.05, 1], borderRadius: ["30%", "50%", "30%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                >
                    <path d="M45.7,-76.3C58.9,-69.3,69.1,-55.6,76.9,-41.2C84.7,-26.8,90.1,-11.7,88.3,2.4C86.5,16.5,77.5,29.6,67.6,41.2C57.7,52.8,46.9,62.9,34.4,69.9C21.9,76.9,7.7,80.8,-5.4,78.8C-18.5,76.8,-30.5,68.9,-41.8,59.8C-53.1,50.7,-63.7,40.4,-70.8,28.2C-77.9,16,-81.5,1.9,-79.1,-11.2C-76.7,-24.3,-68.3,-36.4,-57.6,-46.6C-46.9,-56.8,-33.9,-65.1,-20.3,-68.3C-6.7,-71.5,7.5,-69.6,20.5,-67.2" transform="translate(100 100)" />
                </motion.svg>
            </div>

            {/* --- DECORATION: Secondary Soft Blob (Right) --- */}
            <div className="absolute bottom-[10%] right-[-10%] w-[60vw] h-[60vw] md:w-[45vw] md:h-[45vw] z-0 pointer-events-none opacity-60 mix-blend-multiply">
                <motion.div
                    className="w-full h-full bg-[#FFB7B2] rounded-full blur-[80px]"
                    animate={{ scale: [1, 1.1, 1], x: [0, -20, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* --- DECORATION: Cute Doodles --- */}
            <svg className="absolute top-[8%] right-[8%] w-24 h-24 text-yellow-500 z-0 opacity-80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M50 10 L50 90 M10 50 L90 50 M25 25 L75 75 M75 25 L25 75" />
            </svg>
            <svg className="absolute bottom-[20%] left-[8%] w-32 h-32 text-black z-0 opacity-50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M10 50 Q 50 20 90 50" />
                <path d="M20 70 Q 50 40 80 70" />
            </svg>

            {/* --- CLASSIC MESSY ROW LAYOUT --- */}
            <div className="relative z-10 w-full max-w-[95vw] px-4 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-0 md:-space-x-12 mb-20 md:mb-28 mt-10">
                {MEMORIES.map((memory) => (
                    <motion.div
                        key={memory.id}
                        initial={{ rotate: memory.rotation, y: memory.yOffset }}
                        whileHover={{ scale: 1.1, rotate: 0, y: 0, zIndex: 100 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative group cursor-pointer shrink-0"
                    >
                        {/* Ultra minimal border to maximize image space */}
                        {/* Added p-2 to keep just a tiny bit of white frame, effectively "removing" the bulky polaroid look */}
                        <div className="relative w-[340px] md:w-[420px] aspect-[4/5] p-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform border border-gray-100 flex flex-col items-center transition-shadow hover:shadow-[0_30px_60px_rgba(0,0,0,0.25)]">

                            {/* Image Container - Takes full height */}
                            <div className="w-full h-full bg-gray-100 overflow-hidden relative rounded-xl border border-gray-200">
                                <img
                                    src={memory.src}
                                    alt={memory.caption}
                                    className="w-full h-full object-cover"
                                />

                                {/* Gloss Reflection */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                {/* OVERLAY CAPTION */}
                                {/* Positioned at the bottom of the photo */}
                                <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                                    <motion.p
                                        initial={{ y: 10, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className={`
                            font-bold text-sm md:text-base px-5 py-2 rounded-full border border-white/40
                            ${memory.tagColor}
                            shadow-lg backdrop-blur-md transform transition-transform group-hover:scale-105 tracking-wide
                        `}>
                                        {memory.caption}
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* --- DESCRIPTIVE TEXT BLOCK --- */}
            <div className="relative z-10 text-center max-w-3xl px-6">
                <p className="text-2xl md:text-3xl text-gray-900 font-medium leading-relaxed mb-8 tracking-wide">
                    "Every little moment I managed to capture made me know I wanted you from the first day"
                </p>

                {/* Bouncing Arrow */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex justify-center text-black/50"
                >
                    <ArrowDown size={32} strokeWidth={2.5} />
                </motion.div>
            </div>

        </section>
    );
}
