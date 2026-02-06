"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import Gate from "@/components/Gate";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import FilmReel from "@/components/FilmReel";
import LoveLetter from "@/components/LoveLetter";
import VinylPlayer from "@/components/VinylPlayer";

export default function Home() {
    const isUnlocked = useStore((state) => state.isUnlocked);
    const [loadingComplete, setLoadingComplete] = useState(false);

    return (
        <main className="relative min-h-screen bg-black">
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

                    {/* Option A: Timeline */}
                    <FilmReel />

                    {/* Option B: Letter */}
                    <LoveLetter />

                    {/* Option C: Vinyl */}
                    <VinylPlayer />
                </div>
            )}
        </main>
    );
}
