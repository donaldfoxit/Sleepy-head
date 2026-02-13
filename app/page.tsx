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

            {/* --- MOBILE RESTRICTION OVERLAY (DISABLED PER USER REQUEST) --- */}
            {/* <MobileRestriction /> */}

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
                                    to="gallery"
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
                            {/* 2. THE SPARK (Manifesto) - Moved up */}
                            <div id="manifesto" className="relative">
                                <Manifesto onComplete={() => setStargazerComplete(true)} />
                                <ScrollPrompt to="gallery" label="View Gallery" />
                            </div>

                            {/* 3. THE GALLERY (Vibe) - Moved down */}
                            <div id="gallery" className="relative">
                                <Gallery />
                                <ScrollPrompt to="banners" />
                            </div>

                            {/* 4. FLANKING BANNER */}
                            <div id="banners" className="relative">
                                <FlankingBanners />
                                <ScrollPrompt to="connect-four" />
                            </div>

                            {/* 5. THE GAME (Connect Four) */}
                            <div id="connect-four" className="relative">
                                <ConnectFour />
                                {/* Game usually has its own flow, but adding prompt just in case */}
                                <ScrollPrompt to="chat-floating" label="Next Chapter" />
                            </div>

                            {/* 6. CHAT MESSAGE FLOATING */}
                            <div id="chat-floating" className="relative">
                                <ChatFloating />
                                <ScrollPrompt to="film-reel" />
                            </div>

                            {/* 7. REEL (Film Reel) */}
                            <div id="film-reel" className="relative">
                                <FilmReel />
                                <ScrollPrompt to="first-kiss" />
                            </div>

                            {/* 8. FIRST KISS */}
                            <div id="first-kiss" className="relative">
                                <FirstKiss />
                                <ScrollPrompt to="nickname" />
                            </div>

                            {/* 9. NICKNAME */}
                            <div id="nickname" className="relative">
                                <NicknameScreen />
                                <ScrollPrompt to="letter" />
                            </div>

                            {/* 10. LETTER */}
                            <div id="letter" className="relative">
                                <Letter />
                                <ScrollPrompt to="proposal" label="Forever" />
                            </div>

                            {/* 11. QUANTUM TOUCH (The Proposal) */}
                            <div id="proposal" className="relative">
                                <QuantumTouch />
                                <ScrollPrompt to="spotify" label="Soundtrack" />
                            </div>

                            {/* 12. SPOTIFY */}
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
