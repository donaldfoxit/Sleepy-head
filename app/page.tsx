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

// Helper Component for Navigation
const ScrollPrompt = ({ to, label = "Continue" }: { to: string; label?: string }) => {
    const lenis = useLenis(() => {
        // called every scroll
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none"
        >
            <motion.button
                onClick={() => lenis?.scrollTo(`#${to}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                    boxShadow: [
                        "0 0 20px rgba(251,207,232,0.3)",
                        "0 0 30px rgba(251,207,232,0.5)",
                        "0 0 20px rgba(251,207,232,0.3)"
                    ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="pointer-events-auto px-8 py-4 bg-gradient-to-r from-rose-300/15 to-rose-400/15 backdrop-blur-sm border-2 border-rose-300/40 rounded-full text-rose-300 font-bold tracking-wider hover:bg-rose-300/25 transition-colors cursor-pointer drop-shadow-[0_0_12px_rgba(251,207,232,0.5)]"
            >
                Scroll or Tap to Continue
            </motion.button>
        </motion.div>
    );
};

export default function Home() {
    const isUnlocked = useStore((state) => state.isUnlocked);
    const [startInteraction, setStartInteraction] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);
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
                <motion.div
                    className="relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* 1. HERO (The Hook) */}
                    <div id="hero" className="relative">
                        <Hero />
                        <ScrollPrompt to="gallery" label="Begin" />
                    </div>

                    {/* 2. GALLERY (The Vibe) */}
                    <div id="gallery" className="relative">
                        <Gallery />
                        <ScrollPrompt to="manifesto" />
                    </div>

                    {/* 3. MANIFESTO (The Poetry) */}
                    <div id="manifesto" className="relative">
                        <Manifesto onComplete={() => setStargazerComplete(true)} />
                        <ScrollPrompt to="banners" label="Read On" />
                    </div>

                    {/* RESTORED: FlankingBanners */}
                    <div id="banners" className="relative">
                        <FlankingBanners />
                        <ScrollPrompt to="connect-four" label="Redemption" />
                    </div>

                    {/* 4. CONNECT FOUR (The Game) */}
                    <div id="connect-four" className="relative">
                        {/* ConnectFour has internal logic, but we wrap it for ID */}
                        <ConnectFour />
                        {/* ConnectFour has its own 'Proceed' button on win, but a skip might be nice? 
                             User said: "make sure she can only play in the winning position".
                             I'll leave the 'Proceed' button inside ConnectFour to handle the 'Win' state logic,
                             but maybe add a subtle skip just in case? No, let forced win happen.
                         */}
                    </div>

                    {/* 5. CHAT MESSAGES (The Reality) */}
                    <div id="chat-floating" className="relative">
                        <ChatFloating />
                        <ScrollPrompt to="nickname" label="The Secret" />
                    </div>

                    {/* 6. NICKNAME NOTE (The Secret) */}
                    <div id="nickname" className="relative">
                        <NicknameScreen />
                        <ScrollPrompt to="film-reel" label="Our History" />
                    </div>

                    {/* 7. FILM REEL (The Timeline) */}
                    <div id="film-reel" className="relative">
                        <FilmReel />
                        <ScrollPrompt to="first-kiss" label="The Spark" />
                    </div>

                    {/* 7.5. FIRST KISS */}
                    <div id="first-kiss" className="relative">
                        <FirstKiss />
                        <ScrollPrompt to="letter" label="Open Letter" />
                    </div>

                    {/* 8. LETTER (The Finale) */}
                    <div id="letter" className="relative">
                        <Letter />
                        <ScrollPrompt to="proposal" label="Forever" />
                    </div>

                    {/* 9. THE PROPOSAL (Quantum Touch) */}
                    <div id="proposal" className="relative">
                        <QuantumTouch />
                        {/* No next prompt, this is the end (mostly) */}
                    </div>

                    {/* 10. SPOTIFY SCANNER (The Soundtrack) */}
                    <div id="spotify" className="relative">
                        <SpotifyScanner />
                    </div>
                </motion.div>
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
