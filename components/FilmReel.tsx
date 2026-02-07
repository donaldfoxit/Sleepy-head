"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const PHOTOS = [
    { id: 1, src: "/videos/reel/1.png", type: "image", date: "DEC 08 2025", caption: "The Beginning" },
    { id: 2, src: "/videos/reel/2.png", type: "image", date: "DEC 23 2025", caption: "Christmas Eve Eve" },
    { id: 3, src: "/videos/reel/3.PNG", type: "image", date: "DEC 24 2025", caption: "Christmas Eve" },
    { id: 4, src: "/videos/reel/4.PNG", type: "image", date: "DEC 26 2025", caption: "Boxing Day" },
    { id: 5, src: "/videos/reel/5.JPG", type: "image", date: "JAN 22 2026", caption: "New Year" },
    { id: 6, src: "/videos/reel/6.jpg", type: "image", date: "ANYTIME ANYDAY", caption: "Forever" },
];

export default function FilmReel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const directionRef = useRef(1); // 1 = Right, -1 = Left
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const scrollContainer = scrollRef.current;

        // Define the animation loop
        const animate = () => {
            if (scrollContainer && !isPaused) {
                // Determine bounds
                const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

                // Flip direction at edges
                if (scrollContainer.scrollLeft >= maxScroll - 1) {
                    directionRef.current = -1;
                } else if (scrollContainer.scrollLeft <= 0) {
                    directionRef.current = 1;
                }

                // Move
                scrollContainer.scrollLeft += directionRef.current * 1.5; // Increased speed for visibility
            }

            // Keep looping
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Start loop
        animationFrameRef.current = requestAnimationFrame(animate);

        // Cleanup on unmount or pause change
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPaused]); // Re-run when pause state changes

    return (
        <section id="film-reel" className="relative h-screen bg-transparent flex flex-col justify-center overflow-hidden">

            {/* Title Overlay */}
            <div className="absolute bottom-10 left-10 pointer-events-none z-20">
                <h2 className="text-white/20 text-9xl font-black uppercase leading-none tracking-tighter">
                    Timeline
                </h2>
            </div>

            {/* Horizontal Scroll Container */}
            <div
                ref={scrollRef}
                className={`
                    flex items-center gap-4 px-20 overflow-x-auto overflow-y-hidden w-full h-full scrollbar-hide
                    ${isPaused ? 'snap-x snap-mandatory cursor-grab active:cursor-grabbing' : 'pointer-events-auto'}
                `}
            >

                {PHOTOS.map((photo, index) => (
                    <div
                        key={index}
                        className="relative flex-shrink-0 w-[500px] h-[400px] bg-black border-y-8 border-dashed border-gray-800 flex flex-col items-center justify-center p-4 snap-center mx-4 select-none hover:scale-105 transition-transform duration-300"
                        // Pause only when hovering a specific frame
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                    >

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

                {/* END TEXT FRAME */}
                <div className="relative flex-shrink-0 w-[600px] h-[400px] flex items-center justify-center snap-center">
                    <h3 className="text-6xl font-black text-white tracking-tighter text-center uppercase whitespace-nowrap drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        and more to come?
                    </h3>
                </div>

            </div>
        </section>
    );
}
