"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface StartScreenProps {
    onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
    return (
        <motion.div
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 3, ease: "easeInOut" } }} // Very slow fade out
            transition={{ duration: 3, ease: "easeOut" }} // Very slow cinematic fade in
        >
            {/* --- TEXTURES --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-black to-black" />
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
                />
            </div>

            {/* --- PULSING HEART BUTTON (No Box) --- */}
            <motion.button
                onClick={onStart}
                className="relative z-10 group flex flex-col items-center justify-center outline-none border-none ring-0 bg-transparent"
                style={{ WebkitTapHighlightColor: "transparent" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Heart Icon - Glow is applied via drop-shadow, no background div */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex items-center justify-center w-48 h-48"
                >
                    <Heart
                        fill="currentColor"
                        className="w-24 h-24 md:w-32 md:h-32 text-rose-300 transition-all duration-500 
                        drop-shadow-[0_0_20px_rgba(251,207,232,0.25)] 
                        group-hover:text-rose-200 group-hover:drop-shadow-[0_0_35px_rgba(251,207,232,0.4)]"
                    />
                </motion.div>

                {/* Text Prompt */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="mt-10 flex flex-col items-center text-center space-y-2"
                >
                    <span className="text-white/80 text-lg md:text-xl tracking-[0.2em] font-serif italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Begin the Journey
                    </span>
                    <span className="text-white/30 text-[10px] uppercase tracking-widest font-sans">
                        (Tap Heart to Proceed)
                    </span>
                </motion.div>
            </motion.button>

        </motion.div>
    );
}
