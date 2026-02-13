"use client";

import React from "react";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

export default function SpotifyScanner() {
    return (
        <section className="relative w-full py-20 bg-black flex flex-col items-center justify-center overflow-hidden">

            {/* --- Background Glow --- */}
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/20 via-black to-black pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center gap-12"
            >
                {/* Header */}
                <div className="flex items-center gap-3 text-rose-400">
                    <Music size={24} />
                    <span className="text-sm font-bold tracking-widest uppercase">Our Soundtrack</span>
                </div>

                {/* PLAYERS CONTAINER */}
                <div className="flex flex-col md:flex-row gap-8 w-full justify-center">

                    {/* PLAYER 1: ONE THING */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 bg-white/5 p-4 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm"
                    >
                        <h3 className="text-center text-rose-200 font-serif italic mb-4 text-xl">One Thing</h3>
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-white/5">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/EDv7efxb4No?controls=1&rel=0"
                                title="One Thing - Acoustic"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>

                    {/* PLAYER 2: SELFISH */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex-1 bg-white/5 p-4 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm"
                    >
                        <h3 className="text-center text-rose-200 font-serif italic mb-4 text-xl">Selfish</h3>
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-white/5">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/9nfuaDP2YTg?controls=1&rel=0"
                                title="Selfish - Acoustic Cover"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>

                </div>

            </motion.div>

        </section>
    );
}
