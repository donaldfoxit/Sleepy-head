"use client";

import React, { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

export default function BackgroundMusic() {
    const playerRef = useRef<any>(null);
    const isUnlocked = useStore((state) => state.isUnlocked);
    const hasStartedRef = useRef(false);

    useEffect(() => {
        // 1. Load the IFrame Player API code asynchronously.
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        } else if (window.onYouTubeIframeAPIReady) {
            window.onYouTubeIframeAPIReady();
        }

        // 2. This function creates an <iframe> (and YouTube player)
        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('bg-music-player', {
                height: '0',
                width: '0',
                videoId: 'CwtrzMn1BzE',
                playerVars: {
                    'autoplay': 0, // Don't autoplay immediately on load
                    'controls': 0,
                    'loop': 1,
                    'playlist': 'CwtrzMn1BzE',
                    'playsinline': 1,
                },
                events: {
                    'onReady': onPlayerReady,
                }
            });
        };

        return () => {
            if (playerRef.current) {
                // optional cleanup
            }
        };
    }, []);

    // Watch for Unlock State
    useEffect(() => {
        if (isUnlocked && playerRef.current && playerRef.current.playVideo) {
            attemptPlay();
        }
    }, [isUnlocked]);

    const attemptPlay = () => {
        if (hasStartedRef.current) return;

        if (playerRef.current && playerRef.current.playVideo) {
            playerRef.current.setVolume(15);
            playerRef.current.playVideo();
            hasStartedRef.current = true;
        }
    };

    const onPlayerReady = (event: any) => {
        // If already unlocked when ready (race condition), play
        if (useStore.getState().isUnlocked) {
            attemptPlay();
        }

        // Fallback: iOS often blocks async play(). 
        // We attach a one-time listener to the document to force play on next touch.
        const forcePlayOnInteraction = () => {
            if (useStore.getState().isUnlocked && playerRef.current && playerRef.current.playVideo) {
                playerRef.current.playVideo();
                // Only remove if it actually started playing? 
                // We'll trust the API for now.
                document.removeEventListener('click', forcePlayOnInteraction);
                document.removeEventListener('touchstart', forcePlayOnInteraction);
            }
        };

        document.addEventListener('click', forcePlayOnInteraction);
        document.addEventListener('touchstart', forcePlayOnInteraction);
    };

    return (
        <div className="fixed opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
            <div id="bg-music-player" />
        </div>
    );
}
