"use client";

import React, { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

interface BackgroundMusicProps {
    shouldPlay?: boolean;
}

export default function BackgroundMusic({ shouldPlay = false }: BackgroundMusicProps) {
    const playerRef = useRef<any>(null);
    const isUnlocked = useStore((state) => state.isUnlocked);
    const hasStartedRef = useRef(false);
    const shouldPlayRef = useRef(shouldPlay);

    const isExternalAudioPlaying = useStore((state) => state.isExternalAudioPlaying);

    // Keep ref in sync
    useEffect(() => {
        shouldPlayRef.current = shouldPlay;
    }, [shouldPlay]);

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
                videoId: '3lHbd8jQUSk',
                playerVars: {
                    'autoplay': 0, // Don't autoplay immediately on load
                    'controls': 0,
                    'loop': 1,
                    'playlist': '3lHbd8jQUSk', // Loop single video
                    'playsinline': 1,
                },
                events: {
                    'onReady': (event: any) => {
                        // Check strict ref value to avoid closure staleness
                        if (shouldPlayRef.current && !isExternalAudioPlaying) {
                            event.target.setVolume(50); // Set to 50% volume
                            event.target.playVideo();
                            hasStartedRef.current = true;
                        }
                    },
                }
            });
        };

        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy(); // Proper cleanup to stop old tracks
            }
        };
    }, []);

    // Helper to fade volume
    const fadeVolume = (targetVol: number, duration: number = 1000) => {
        if (!playerRef.current) return;

        const startVol = playerRef.current.getVolume();
        const steps = 20;
        const stepTime = duration / steps;
        const volStep = (targetVol - startVol) / steps;

        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            const newVol = startVol + (volStep * currentStep);
            playerRef.current.setVolume(newVol);

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                if (targetVol === 0) {
                    playerRef.current.pauseVideo();
                }
            }
        }, stepTime);
    };

    // Watch for External Audio State Changes
    useEffect(() => {
        if (!playerRef.current || !playerRef.current.playVideo) return;

        if (isExternalAudioPlaying) {
            // External audio started -> Pause background music
            fadeVolume(0, 800);
        } else {
            // External audio stopped -> Resume background music (if it should be playing)
            if (shouldPlay) {
                playerRef.current.playVideo();
                fadeVolume(50, 1500); // Fade back in slowly
            }
        }
    }, [isExternalAudioPlaying]);

    // Watch for Start Trigger (or Unlock state for backup)
    useEffect(() => {
        if (shouldPlay && playerRef.current && playerRef.current.playVideo && !isExternalAudioPlaying) {
            attemptPlay();
        }
    }, [shouldPlay]);

    const attemptPlay = () => {
        if (hasStartedRef.current) return;

        if (playerRef.current && playerRef.current.playVideo) {
            playerRef.current.setVolume(50); // Set to 50% volume
            playerRef.current.playVideo();
            hasStartedRef.current = true;
        }
    };

    return (
        <div className="fixed opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
            <div id="bg-music-player" />
        </div>
    );
}
