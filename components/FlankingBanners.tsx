"use client";

import React from "react";
import { motion } from "framer-motion";

export default function FlankingBanners() {
    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-0 group">

            {/* --- LEFT FLANK (The Panda) --- */}
            <motion.div
                initial={{ x: -100, opacity: 0, rotate: -5 }}
                whileInView="closed"
                whileHover="open" // Triggers via parent hover propagation or direct hover if needed, but we want section hover
                variants={{
                    closed: { x: "90%", rotate: 0, opacity: 1 }, // Moves ~90% inward to cover text
                    open: { x: "0%", rotate: 3, opacity: 1 }      // Moves back to original flank position
                }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // smooth ease
                viewport={{ once: true }}
                className="absolute left-[-5%] md:left-0 top-[10%] md:top-auto h-[50vh] md:h-[80vh] w-[40vw] md:w-[25vw] z-10 hidden md:block pointer-events-none md:pointer-events-auto"
            >
                <div className="w-full h-full relative transform -skew-y-3 transition-transform duration-700 ease-out">
                    <img
                        src="/memories/regenerated-panda.png"
                        alt="Panda Memory"
                        className="w-full h-full object-cover rounded-tr-[50px] rounded-bl-[50px] shadow-2xl"
                    />
                    {/* Tape/Sticker Effect */}
                    <div className="absolute -top-10 left-10 w-20 h-40 bg-white/10 blur-xl rotate-45" />
                </div>
            </motion.div>

            {/* --- MOBILE LEFT FLANK --- */}
            <div className="md:hidden absolute -left-10 top-20 w-40 h-60 opacity-40 rotate-12 z-0 pointer-events-none">
                <img src="/memories/regenerated-panda.png" alt="Panda decoration" className="w-full h-full object-cover rounded-lg" />
            </div>

            {/* --- CENTER CONTENT (The "Testimonial" / Love Note) --- */}
            {/* Added a container specifically for the hover trigger if we want it isolated, 
                but user said "on that screen", so relying on the section hover (handled by parent variants propagation) is best.
                However, to make propagation work automatically, we need the parent to hold the state or use 'whileHover' on parent. 
                I will add 'whileHover="open"' to the main section wrapper in the returned JSX above if strict propagation is needed, 
                but actually 'whileHover' on the specific elements is safer if we just want them to open when hovered *directly*?
                No, user said "once she is on that screen and hovers OVER IT [the screen/section]".
            */}

            <div className="relative z-0 max-w-2xl px-8 text-center flex flex-col items-center gap-8 transition-opacity duration-500 delay-300">
                {/* Note: z-0 puts it BEHIND the wings (z-10) so they can cover it. */}

                {/* 5-Star Rating */}
                <div className="flex gap-2 text-[#facc15] drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                    {[...Array(5)].map((_, i) => (
                        <motion.svg
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 200, damping: 10 }}
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
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-white/50"
                >
                    Since Day One • Forever
                </motion.div>

                {/* The Quote / Poem */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                    whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                    className="text-lg md:text-2xl font-serif leading-relaxed text-white/90 whitespace-pre-line"
                    style={{ fontFamily: "'Bodoni Moda', serif", willChange: "transform, opacity, filter" }}
                >
                    &quot;Every moment with you feels good in a quiet way.
                    Not because we’re doing a lot.... but because it’s you, baby.

                    I find myself wanting more time just to be around you.
                    To take little snapshots of your smile… your laugh… your eyes when they soften.
                    The way you sit close.

                    Even the simplest times with you stay with me.
                    The random conversations.
                    Every hour we’ve spent together has felt easy. Real.

                    And that means more to me than you know. And even if i have defeated you too many times, this is your chance for redemption&quot;
                </motion.div>

                {/* CTA Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => {
                        document.getElementById('redemption-game')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-4 px-8 py-4 bg-white text-black font-bold tracking-widest uppercase text-xs md:text-sm rounded-full hover:bg-rose-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                    Click for Redemption ↗
                </motion.button>
            </div>

            {/* --- RIGHT FLANK (The Character) --- */}
            <motion.div
                initial={{ x: 100, opacity: 0, rotate: 5 }}
                whileInView="closed"
                whileHover="open"
                variants={{
                    closed: { x: "-90%", rotate: 0, opacity: 1 }, // Moves ~90% inward to cover text
                    open: { x: "0%", rotate: -3, opacity: 1 }     // Moves back to original flanking position
                }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="absolute right-[-5%] md:right-0 bottom-[10%] md:bottom-auto h-[50vh] md:h-[80vh] w-[40vw] md:w-[25vw] z-10 hidden md:block pointer-events-none md:pointer-events-auto"
            >
                <div className="w-full h-full relative transform skew-y-3 transition-transform duration-700 ease-out">
                    <img
                        src="/memories/regenerated-character.png"
                        alt="Character Memory"
                        className="w-full h-full object-cover rounded-tl-[50px] rounded-br-[50px] shadow-2xl"
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
