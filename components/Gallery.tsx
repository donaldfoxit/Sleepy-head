"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// --- CONFIGURATION: MEMORIES ---
const MEMORIES = [
    {
        id: 1,
        src: "/photo1.png", // Using the placeholder images we created
        rotation: -6,
        caption: "The day you said yes",
        tagColor: "bg-purple-200 text-purple-900",
        textPosition: "top-[-20px] right-[-20px]",
    },
    {
        id: 2,
        src: "/photo2.png",
        rotation: 4,
        caption: "We look good together",
        tagColor: "bg-orange-200 text-orange-900",
        textPosition: "bottom-[-20px] left-[-20px]",
    },
    {
        id: 3,
        src: "/photo3.png",
        rotation: -3,
        caption: "Pure happiness",
        tagColor: "bg-lime-200 text-lime-900",
        textPosition: "top-[50%] right-[-60px]",
    },
    {
        id: 4,
        src: "/photo4.png",
        rotation: 8,
        caption: "My favorite view",
        tagColor: "bg-rose-200 text-rose-900",
        textPosition: "bottom-[10px] right-[-40px]",
    },
];

export default function Gallery() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const totalWidth = containerRef.current!.scrollWidth;
            const viewportWidth = window.innerWidth;

            // Horizontal Scroll Logic
            gsap.to(containerRef.current, {
                x: () => -(totalWidth - viewportWidth + 100), // Scroll to the very end
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => `+=${totalWidth}`, // The scroll length matches the content width
                    scrub: 1,
                    pin: true, // Lock the screen
                    anticipatePin: 1,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-[#EFECE6]">

            {/* --- DECORATION: The Big Blue Blob --- */}
            <div className="absolute top-[10%] left-[-10%] w-[60vh] h-[60vh] z-0 opacity-80 pointer-events-none">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#6B90FF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.2,-19.2,95.8,-5.2C93.4,8.9,81.8,22.1,70.8,33.4C59.8,44.7,49.4,54.1,37.6,62.3C25.8,70.5,12.6,77.5,-1.3,79.8C-15.2,82.1,-29.1,79.7,-41.2,71.8C-53.3,63.9,-63.6,50.5,-71.4,36.1C-79.2,21.7,-84.5,6.3,-82.2,-8C-79.9,-22.3,-70,-35.5,-58.5,-45.8C-47,-56.1,-33.9,-63.5,-20.5,-71.2C-7.1,-78.9,6.6,-86.9,20.2,-86.7C33.8,-86.5,47.3,-78.1,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </div>

            {/* --- DECORATION: Black Scribbles --- */}
            <svg className="absolute bottom-20 left-20 w-32 z-0" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="2">
                <path d="M10,50 Q30,80 50,50 T90,50" />
                <path d="M15,60 L25,40 M20,65 L30,45" />
            </svg>

            {/* --- HORIZONTAL CONTAINER --- */}
            <div
                ref={containerRef}
                className="relative h-full flex items-center px-[10vw] gap-[8vw] z-10 w-max"
            >

                {/* Intro Text Block */}
                <div className="flex flex-col justify-center min-w-[300px] mr-10">
                    <h2 className="text-6xl font-bold text-black leading-tight">
                        Our <br />
                        <span className="font-serif italic text-blue-600">Greatest</span> <br />
                        Hits
                    </h2>
                    <p className="mt-6 text-gray-600 max-w-xs leading-relaxed font-medium">
                        Every moment with you feels like a movie scene. Here are a few of my favorites.
                    </p>
                </div>

                {/* --- PHOTOS LOOP --- */}
                {MEMORIES.map((memory) => (
                    <div
                        key={memory.id}
                        className="relative group perspective-1000"
                        style={{ rotate: `${memory.rotation}deg` }} // Initial tilted look
                    >
                        {/* The Photo Card */}
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }} // Hover Effect
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="relative w-[70vw] md:w-[400px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-[8px] border-white bg-white"
                        >
                            {/* Image Placeholder - Replace with Next/Image if preferred */}
                            <img
                                src={memory.src}
                                alt={memory.caption}
                                className="w-full h-full object-cover pointer-events-none"
                            />

                            {/* Glossy Overlay for 'Plastic' Feel */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>

                        {/* The "Sticker" Caption */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className={`
                absolute ${memory.textPosition} 
                px-6 py-3 rounded-full 
                shadow-lg border-2 border-white 
                whitespace-nowrap font-bold text-lg z-20
                ${memory.tagColor}
              `}
                        >
                            {memory.caption}
                        </motion.div>
                    </div>
                ))}

                {/* Final "Call to Action" Card */}
                <div className="relative w-[300px] h-[400px] flex items-center justify-center">
                    <h3 className="text-4xl font-serif italic text-black text-center leading-normal">
                        And so many <br /> more to come...
                    </h3>
                </div>

            </div>
        </section>
    );
}
