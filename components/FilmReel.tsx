"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const PHOTOS = [
    { id: 1, src: "/photo1.png", date: "FEB 14 2024", caption: "Our First Date" },
    { id: 2, src: "/photo2.png", date: "MAR 03 2024", caption: "Movie Night" },
    { id: 3, src: "/photo3.png", date: "APR 21 2024", caption: "Paris Trip" },
    { id: 4, src: "/photo4.png", date: "MAY 15 2024", caption: "Just Us" },
    { id: 5, src: "/photo1.png", date: "JUN 10 2024", caption: "Summer Vibes" },
];

export default function FilmReel() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-neutral-900">
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

                            {/* The Photo Frame */}
                            <div className="relative w-full h-[85%] bg-black overflow-hidden border border-gray-800 rounded-sm">
                                <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0" />

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
