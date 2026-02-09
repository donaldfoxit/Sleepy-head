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
import FlankingBanners from "@/components/FlankingBanners";
import ChatFloating from "@/components/ChatFloating";
import ConnectFour from "@/components/ConnectFour";
import WallArt from "@/components/WallArt";
import BackgroundMusic from "@/components/BackgroundMusic";
import NicknameScreen from "@/components/NicknameScreen";
import MobileRestriction from "@/components/MobileRestriction";

export default function Home() {
    const isUnlocked = useStore((state) => state.isUnlocked);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [isStargazerComplete, setStargazerComplete] = useState(false); // Tracks constellation completion

    return (
        <main className="relative min-h-screen w-full bg-black overflow-x-hidden">

            {/* --- MOBILE RESTRICTION OVERLAY --- */}
            <MobileRestriction />

            {/* Loading Screen */}
            {!loadingComplete && (
                <LoadingScreen onComplete={() => setLoadingComplete(true)} />
            )}

            {/* Password Gate */}
            {loadingComplete && !isUnlocked && <Gate />}

            {/* Main Content */}
            {isUnlocked && (
                <div className="transition-opacity duration-1000 animate-fadeIn">
                    {/* 1. HERO (The Hook) */}
                    <Hero />

                    {/* 2. GALLERY (The Vibe - "Messy Sticker" Videos) */}
                    <Gallery />

                    {/* 3. MANIFESTO (The Poetry - Deep Romance) */}
                    {/* Bridge: The Manifesto (No longer gates content) */}
                    <Manifesto onComplete={() => setStargazerComplete(true)} />

                    {/* RESTORED: Flanking Banners (Testimonial Style) */}
                    <FlankingBanners />

                    {/* 4. CONNECT FOUR (The Game - "Redemption" / Intermission) */}
                    {/* Breaks up the reading sections */}
                    <ConnectFour />

                    {/* 5. CHAT MESSAGES (The Reality - "Receipts") */}
                    <ChatFloating />

                    {/* 6. NICKNAME NOTE (The Secret - Intimate) */}
                    <NicknameScreen />

                    {/* 7. FILM REEL (The History - Timeline) */}
                    <FilmReel />

                    {/* 8. LETTER (The Finale - Emotional Climax) */}
                    <Letter />

                    {/* REMOVED: FlankingBanners (Testimonial overlap), WallArt (Redundant), VinylPlayer (Integrated music) */}
                    <VinylPlayer /> {/* Keeping Vinyl Player logic if needed, or is it visual? It was hidden/optional before but kept in list. Checking... It renders a player. The user list said "Option C: Vinyl". Let's keep it at the end or remove based on "Video/Music" updates. User checklist said "Keep Letter & Vinyl active". Use Vinyl as footer control?
                    Actually, VinylPlayer is likely the visual player interface. Let's keep it at the end as a footer element if it fits, or just leave it where it was relative to Letter.
                    Original order had Vinyl after Letter. I'll keep it there. */}
                </div>
            )}
            {/* --- GLOBAL FILM GRAIN OVERLAY --- */}
            <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.08] mix-blend-overlay"
                style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
            />

            {/* --- BACKGROUND MUSIC PLAYER (Unlocks with Site - Controlled internally) --- */}
            <BackgroundMusic />
        </main>
    );
}
