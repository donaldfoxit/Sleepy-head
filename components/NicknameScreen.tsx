"use client";

import React from "react";
import { motion } from "framer-motion";

export default function NicknameScreen() {
    return (
        <section className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center p-8 overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/30 via-black to-black opacity-80" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative z-10 max-w-4xl w-full flex flex-col items-center"
            >
                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="text-white/60 font-serif italic text-2xl md:text-3xl mb-12 tracking-wider"
                >
                    The Blueprint
                </motion.h2>

                {/* The Image (Blended) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                >
                    <img
                        src="/images/nickname_note_favour.jpeg"
                        alt="The Nickname Theory - Handwritten Note"
                        className="w-full h-auto max-h-[70vh] object-contain mix-blend-screen brightness-125 contrast-150 saturate-150"
                        style={{
                            maskImage: "radial-gradient(circle at center, black 30%, transparent 95%)",
                            WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 95%)"
                        }}
                    />
                </motion.div>

                {/* Caption */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.5 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-white/30 text-xs tracking-[0.2em] font-mono uppercase"
                >
                    December 30, 2025 • 3:37 PM
                </motion.p>
            </motion.div>
        </section>
    );
}
