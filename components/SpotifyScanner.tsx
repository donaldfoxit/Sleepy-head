"use client";

import React from "react";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

export default function SpotifyScanner() {
    const [playing, setPlaying] = React.useState<string | null>(null);

    return (
        <section className="relative w-full py-20 bg-black flex flex-col items-center justify-center overflow-hidden">

            {/* --- Background Glow --- */}
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/20 via-black to-black pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center gap-12">
                {/* Header */}
                <div className="flex items-center gap-3 text-rose-400">
                    <Music size={24} />
                    <span className="text-sm font-bold tracking-widest uppercase">Our Soundtrack</span>
                </div>

                {/* PLAYERS CONTAINER */}
                <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
                    <AudioCard
                        id="EDv7efxb4No"
                        title="One Thing"
                        artist="Acoustic Version"
                        currentPlaying={playing}
                        onPlay={(id) => setPlaying(id)}
                    />
                    <AudioCard
                        id="9nfuaDP2YTg"
                        title="Selfish"
                        artist="Acoustic Cover"
                        currentPlaying={playing}
                        onPlay={(id) => setPlaying(id)}
                    />
                </div>
            </div>
        </section>
    );
}

// --- CUSTOM AUDIO CARD COMPONENT ---
function AudioCard({ id, title, artist, currentPlaying, onPlay }: { id: string, title: string, artist: string, currentPlaying: string | null, onPlay: (id: string | null) => void }) {
    const isPlaying = currentPlaying === id;
    const playerRef = React.useRef<any>(null);

    // Initialize Player
    React.useEffect(() => {
        if (!window.YT) return;

        playerRef.current = new window.YT.Player(`player-${id}`, {
            height: '0',
            width: '0',
            videoId: id,
            playerVars: {
                autoplay: 0,
                controls: 0,
                modestbranding: 1,
            },
            events: {
                onStateChange: (event: any) => {
                    if (event.data === window.YT.PlayerState.ENDED) {
                        onPlay(null);
                    }
                }
            }
        });

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [id]);

    // Handle External State Changes
    React.useEffect(() => {
        if (!playerRef.current || !playerRef.current.playVideo) return;

        if (isPlaying) {
            playerRef.current.playVideo();
        } else {
            playerRef.current.pauseVideo();
        }
    }, [isPlaying]);

    return (
        <div className={`flex-1 bg-white/5 p-6 rounded-3xl border transition-all duration-300 ${isPlaying ? "border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.2)]" : "border-white/10 shadow-lg"}`}>
            <div className="flex items-center gap-4">
                {/* Play Button */}
                <button
                    onClick={() => onPlay(isPlaying ? null : id)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isPlaying ? "bg-rose-500 text-white scale-110" : "bg-white/10 text-white hover:bg-white/20"}`}
                >
                    {isPlaying ? (
                        <div className="flex gap-1">
                            <motion.div animate={{ height: [10, 20, 10] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
                            <motion.div animate={{ height: [15, 25, 15] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 bg-white rounded-full" />
                            <motion.div animate={{ height: [10, 20, 10] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 bg-white rounded-full" />
                        </div>
                    ) : (
                        <Music size={24} />
                    )}
                </button>

                {/* Metadata */}
                <div>
                    <h3 className={`font-serif italic text-xl ${isPlaying ? "text-rose-200" : "text-white/80"}`}>{title}</h3>
                    <p className="text-xs text-white/40 uppercase tracking-widest">{artist}</p>
                </div>
            </div>

            {/* Hidden Player Div */}
            <div id={`player-${id}`} className="hidden" />
        </div>
    );
}


