"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import Gate from "@/components/Gate";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import FilmReel from "@/components/FilmReel";
import Letter from "@/components/Letter";
import VinylPlayer from "@/components/VinylPlayer";
import Stargazer from "@/components/Stargazer";
import Manifesto from "@/components/Manifesto";
import WallArt from "@/components/WallArt";

export default function Home() {
    const isUnlocked = useStore((state) => state.isUnlocked);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [isStargazerComplete, setStargazerComplete] = useState(false); // Tracks constellation completion

    return (
        <main className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden">
            {/* Loading Screen */}
            {!loadingComplete && (
                <LoadingScreen onComplete={() => setLoadingComplete(true)} />
            )}

            {/* Password Gate */}
            {loadingComplete && !isUnlocked && <Gate />}

            {/* Main Content */}
            {isUnlocked && (
                <div className="transition-opacity duration-1000 animate-fadeIn">
                    {/* Hero Manifesto Section */}
                    <Hero />

                    {/* Gallery Section */}
                    <Gallery />

                    {/* --- PROPOSAL SECTIONS (FOR REVIEW) --- */}


                    {/* Bridge: The Manifesto (No longer gates content) */}
                    <Manifesto onComplete={() => setStargazerComplete(true)} />

                    {/* REVEALED CONTENT (Always Visible for Free Scroll) */}
                    <div className="animate-fadeIn transition-opacity duration-1000">
                        {/* Option A: Timeline */}
                        <FilmReel />

                        {/* Option B: Letter (Unified Experience) */}
                        <Letter />

                        {/* Option C: Vinyl & Soundtrack */}
                        <VinylPlayer />

                        {/* Final Wall Art Mashup */}
                        <WallArt />
                    </div>
                </div>
            )}
            {/* --- GLOBAL FILM GRAIN OVERLAY --- */}
            <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.08] mix-blend-overlay"
                style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
            />
        </main>
    );
}
