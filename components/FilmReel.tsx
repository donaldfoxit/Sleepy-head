"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const PHOTOS = [
    { id: 1, src: "/videos/reel/reel-1.mp4", type: "video", date: "FEB 14 2024", caption: "Our First Date" },
    { id: 2, src: "/videos/reel/reel-2.mp4", type: "video", date: "MAR 03 2024", caption: "Beach Walk" },
    { id: 3, src: "/videos/reel/reel-3.mp4", type: "video", date: "APR 21 2024", caption: "Paris Trip" },
    { id: 4, src: "/videos/reel/reel-4.mp4", type: "video", date: "MAY 15 2024", caption: "Just Us" },
    { id: 5, src: "/videos/reel/reel-5.mp4", type: "video", date: "JUN 10 2024", caption: "Summer Vibes" },
];

export default function FilmReel() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Snappier scroll: stop horizontal move at the last frame
    // Adjusted [0, 0.95] to include the new text frame
    const x = useTransform(scrollYProgress, [0, 0.95], ["0%", "-82%"]);

    return (
        <section ref={targetRef} className="relative h-[250vh]">
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">

                {/* --- FILM STRIP CONTAINER --- */}
                <motion.div
                    style={{ x }}
                    className="flex gap-4 px-20"
                >
                    {PHOTOS.map((photo, index) => (
                        <div key={index} className="relative flex-shrink-0 w-[500px] h-[400px] bg-black border-y-8 border-dashed border-gray-800 flex flex-col items-center justify-center p-4">

                            {/* Sprocket Holes (Top & Bottom) */}
                            <div className="absolute top-2 left-0 right-0 h-4 flex justify-between px-4">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="w-3 h-4 bg-transparent border border-white/20 rounded-sm" />
                                ))}
                            </div>
                            <div className="absolute bottom-2 left-0 right-0 h-4 flex justify-between px-4">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="w-3 h-4 bg-transparent border border-white/20 rounded-sm" />
                                ))}
                            </div>

                            {/* The Photo/Video Frame */}
                            <div className="relative w-full h-[85%] bg-black overflow-hidden border border-gray-800 rounded-sm">
                                {photo.type === "video" ? (
                                    <video
                                        src={photo.src}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
                                    />
                                ) : (
                                    <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0" />
                                )}

                                {/* Date Stamp */}
                                <div className="absolute bottom-4 right-4 font-mono text-orange-500 text-xs tracking-widest opacity-80 backdrop-blur-sm px-2 py-1 bg-black/50 rounded">
                                    {photo.date}
                                </div>
                            </div>

                            {/* Frame Number */}
                            <div className="absolute -bottom-8 left-4 text-gray-500 text-xs font-mono">
                                {String(index + 1).padStart(2, '0')}A
                            </div>

                        </div>
                    ))}

                    {/* NEW: END TEXT FRAME - Shifted away from the reel strip */}
                    <div className="relative flex-shrink-0 w-[1000px] h-[400px] flex items-center justify-center pl-60">
                        <motion.h3
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="text-6xl md:text-8xl font-black text-white tracking-tighter text-center uppercase whitespace-nowrap drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            and more to come?
                        </motion.h3>
                    </div>

                </motion.div>

                {/* Overlay Text */}
                <div className="absolute bottom-10 left-10 pointer-events-none">
                    <h2 className="text-white/20 text-9xl font-black uppercase leading-none tracking-tighter">
                        Timeline
                    </h2>
                </div>

            </div>
        </section>
    );
}
