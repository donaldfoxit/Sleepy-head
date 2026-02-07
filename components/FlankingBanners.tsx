"use client";

import React from "react";
import { motion } from "framer-motion";

export default function FlankingBanners() {
    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-0">

            {/* --- LEFT FLANK (The Panda) --- */}
            <motion.div
                initial={{ x: -100, opacity: 0, rotate: -5 }}
                whileInView={{ x: 0, opacity: 1, rotate: 3 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute left-[-5%] md:left-0 top-[10%] md:top-auto h-[50vh] md:h-[80vh] w-[40vw] md:w-[25vw] z-10 hidden md:block"
            >
                <div className="w-full h-full relative transform -skew-y-3 hover:skew-y-0 transition-transform duration-700">
                    <img
                        src="/memories/regenerated-panda.png"
                        alt="Panda Memory"
                        className="w-full h-full object-cover rounded-tr-[50px] rounded-bl-[50px] opacity-80 hover:opacity-100 transition-opacity duration-500 shadow-2xl"
                    />
                    {/* Tape/Sticker Effect */}
                    <div className="absolute -top-10 left-10 w-20 h-40 bg-white/10 blur-xl rotate-45" />
                </div>
            </motion.div>

            {/* --- MOBILE LEFT FLANK (Visible only on small screens, positioned differently) --- */}
            <div className="md:hidden absolute -left-10 top-20 w-40 h-60 opacity-40 rotate-12 z-0 pointer-events-none">
                <img src="/memories/regenerated-panda.png" alt="Panda decoration" className="w-full h-full object-cover rounded-lg" />
            </div>

            {/* --- CENTER CONTENT (The "Testimonial" / Love Note) --- */}
            <div className="relative z-20 max-w-2xl px-8 text-center flex flex-col items-center gap-8">

                {/* 5-Star Rating */}
                <div className="flex gap-2 text-[#facc15] drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                    {[...Array(5)].map((_, i) => (
                        <motion.svg
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 + 0.5 }}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 md:w-8 md:h-8"
                        >
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </motion.svg>
                    ))}
                </div>

                {/* Location / Date / Context */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-white/50"
                >
                    Since Day One • Forever
                </motion.div>

                {/* The Quote */}
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-3xl md:text-5xl font-serif leading-tight md:leading-snug text-white/90"
                    style={{ fontFamily: "'Bodoni Moda', serif" }}
                >
                    "It was such a joyful and affirming journey. Thank you for making life such a memorable and enriching masterpiece. I can't recommend you highly enough!"
                </motion.h2>

                {/* CTA Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: 1.2 }}
                    onClick={() => {
                        document.getElementById('film-reel')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-4 px-8 py-4 bg-white text-black font-bold tracking-widest uppercase text-xs md:text-sm rounded-full hover:bg-rose-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                    View Time Capsule ↗
                </motion.button>
            </div>

            {/* --- RIGHT FLANK (The Character) --- */}
            <motion.div
                initial={{ x: 100, opacity: 0, rotate: 5 }}
                whileInView={{ x: 0, opacity: 1, rotate: -3 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute right-[-5%] md:right-0 bottom-[10%] md:bottom-auto h-[50vh] md:h-[80vh] w-[40vw] md:w-[25vw] z-10 hidden md:block"
            >
                <div className="w-full h-full relative transform skew-y-3 hover:skew-y-0 transition-transform duration-700">
                    <img
                        src="/memories/regenerated-character.png"
                        alt="Character Memory"
                        className="w-full h-full object-cover rounded-tl-[50px] rounded-br-[50px] opacity-80 hover:opacity-100 transition-opacity duration-500 shadow-2xl"
                    />
                    {/* Tape/Sticker Effect */}
                    <div className="absolute -bottom-10 right-10 w-20 h-40 bg-white/10 blur-xl -rotate-45" />
                </div>
            </motion.div>

            {/* --- MOBILE RIGHT FLANK --- */}
            <div className="md:hidden absolute -right-10 bottom-20 w-40 h-60 opacity-40 -rotate-12 z-0 pointer-events-none">
                <img src="/memories/regenerated-character.png" alt="Character decoration" className="w-full h-full object-cover rounded-lg" />
            </div>

        </section>
    );
}
