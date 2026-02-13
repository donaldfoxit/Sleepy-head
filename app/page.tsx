"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import Gate from "@/components/Gate";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import FilmReel from "@/components/FilmReel";
import Letter from "@/components/Letter";
import FirstKiss from "@/components/FirstKiss";
import SpotifyScanner from "@/components/SpotifyScanner";
import Stargazer from "@/components/Stargazer";
import Manifesto from "@/components/Manifesto";
import FlankingBanners from "@/components/FlankingBanners";
import ChatFloating from "@/components/ChatFloating";
import ConnectFour from "@/components/ConnectFour";
import StartScreen from "@/components/StartScreen";
import BackgroundMusic from "@/components/BackgroundMusic";
import NicknameScreen from "@/components/NicknameScreen";
import MobileRestriction from "@/components/MobileRestriction";
import QuantumTouch from "@/components/QuantumTouch";

import { useLenis } from "@studio-freight/react-lenis";


// Helper Component for Navigation (Minimal)
const ScrollPrompt = ({ to, label, onClick }: { to: string; label?: string; onClick?: () => void }) => {
    const lenis = useLenis(() => { });

    const handleNavigation = () => {
        if (onClick) {
            onClick();
        } else {
            lenis?.scrollTo(`#${to}`, { duration: 3, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        }
    };

    return (
        <motion.button
            onClick={handleNavigation}
            whileHover={{ backgroundColor: "rgba(244, 114, 182, 0.4)" }} // Rose-400 with opacity
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/60 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors hover:text-white hover:border-rose-400/50 flex items-center justify-center pointer-events-auto shadow-[0_0_15px_rgba(244,114,182,0.2)]"
        >
            {label || "CONTINUE"}
        </motion.button>
    );
};



export default function Home() {
    const isUnlocked = useStore((state) => state.isUnlocked);
    const [startInteraction, setStartInteraction] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [showGallery, setShowGallery] = useState(false); // State for Hero -> Gallery fade
    const [isStargazerComplete, setStargazerComplete] = useState(false);

    return (
        <main className="relative min-h-screen w-full bg-black overflow-x-hidden">

            {/* --- MOBILE RESTRICTION OVERLAY --- */}
            <MobileRestriction />

            <AnimatePresence mode="wait">
                {!startInteraction && (
                    <StartScreen key="start-screen" onStart={() => setStartInteraction(true)} />
                )}

                {startInteraction && !loadingComplete && (
                    <LoadingScreen key="loading-screen" onComplete={() => setLoadingComplete(true)} />
                )}
            </AnimatePresence>

            {/* Password Gate */}
            {loadingComplete && !isUnlocked && <Gate />}

            {/* Main Content */}
            {isUnlocked && (
                <AnimatePresence mode="wait">
                    {!showGallery ? (
                        <motion.div
                            key="hero-section"
                            className="relative z-10 min-h-screen"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
                            transition={{ duration: 3, ease: "easeOut" }}
                        >
                            {/* 1. HERO (The Hook) */}
                            <div id="hero" className="relative">
                                <Hero />
                                <ScrollPrompt
                                    to="manifesto"
                                    label="Begin"
                                    onClick={() => setShowGallery(true)}
                                />

                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="main-content"
                            className="relative z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        >
                            {/* 2. MANIFESTO (The Spark) */}
                            <div id="manifesto" className="relative">
                                <Manifesto onComplete={() => setStargazerComplete(true)} />
                                <ScrollPrompt to="gallery" />
                            </div>

                            {/* 3. GALLERY (The Gallery) */}
                            <div id="gallery" className="relative">
                                <Gallery />
                                <ScrollPrompt to="banners" />
                            </div>

                            {/* 4. FLANKING BANNERS (The Flanking Banner) */}
                            <div id="banners" className="relative">
                                <FlankingBanners />
                                <ScrollPrompt to="connect-four" />
                            </div>

                            {/* 5. CONNECT FOUR (The Game) */}
                            <div id="connect-four" className="relative">
                                <ConnectFour />
                                {/* Game handling its own flow, but we provide a prompt just in case or rely on "Proceed" */}
                                <ScrollPrompt to="chat-floating" />
                            </div>

                            {/* 6. CHAT MESSAGES (Chat Messages) */}
                            <div id="chat-floating" className="relative">
                                <ChatFloating />
                                <ScrollPrompt to="film-reel" />
                            </div>

                            {/* 7. FILM REEL (The Reel) */}
                            <div id="film-reel" className="relative">
                                <FilmReel />
                                <ScrollPrompt to="first-kiss" />
                            </div>

                            {/* 8. FIRST KISS (First Kiss) */}
                            <div id="first-kiss" className="relative">
                                <FirstKiss />
                                <ScrollPrompt to="nickname-screen" />
                            </div>

                            {/* 9. NICKNAME (Nickname) */}
                            <div id="nickname-screen" className="relative">
                                <NicknameScreen />
                                <ScrollPrompt to="letter" />
                            </div>

                            {/* 10. LETTER (Letter) */}
                            <div id="letter" className="relative">
                                <Letter />
                                <ScrollPrompt to="proposal" label="Forever" />
                            </div>

                            {/* 11. QUANTUM TOUCH (Quantum Touch) */}
                            <div id="proposal" className="relative">
                                <QuantumTouch />
                                <ScrollPrompt to="spotify" />
                            </div>

                            {/* 12. SPOTIFY SCANNER (Spotify) */}
                            <div id="spotify" className="relative">
                                <SpotifyScanner />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* Grain Overlay */}
            <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.08] mix-blend-overlay"
                style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
            />

            {/* Background Music */}
            <BackgroundMusic shouldPlay={startInteraction} />
        </main>
    );
}
