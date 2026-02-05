"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import Gate from "@/components/Gate";
import LoadingScreen from "@/components/LoadingScreen";

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
            <div className={`${isUnlocked ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center px-6">
                        <h1 className="text-6xl font-bold text-white mb-4 font-serif">
                            Welcome to the Main Site
                        </h1>
                        <p className="text-xl text-white/70">
                            You&apos;ve unlocked the magic! ✨
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
