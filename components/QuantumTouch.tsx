"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint } from "lucide-react";
import gsap from "gsap";
import CameraCapture from "./CameraCapture";

// Particle Interface
interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
}

export default function QuantumTouch() {
    const [status, setStatus] = useState<"idle" | "charging" | "complete">("idle");
    const [charge, setCharge] = useState(0); // For UI
    const chargeRef = useRef(0); // For Animation Loop (Latest value)
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const particles = useRef<Particle[]>([]);
    const animationFrame = useRef<number>(0);
    const isHolding = useRef(false);
    const audioRef = useRef<HTMLAudioElement | null>(null); // Pop sound
    const [showTicket, setShowTicket] = useState(false); // Finale State
    const [showCamera, setShowCamera] = useState(false); // Camera modal state
    const [showButterflyMessage, setShowButterflyMessage] = useState(false); // Butterfly delivery message
    const [showCards, setShowCards] = useState(false); // Delayed card entrance

    // --- STATE FOR FLIP CARDS ---
    const [selectedCard, setSelectedCard] = useState<"cinema" | "car" | null>(null);

    // --- CONFIGURATION ---
    const CHARGE_SPEED = 0.25; // SLOWER: More dramatic buildup (was 0.5)
    const DECAY_SPEED = 1.5;  // Faster drain to make holding necessary (was 1.0)

    // Initialize Particles & Animation Loop
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Resize Canvas
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Spawn Initial Ambient Particles
        if (particles.current.length === 0) {
            for (let i = 0; i < 200; i++) {
                particles.current.push(createParticle(canvas));
            }
        }

        const loop = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update Charge Logic
            if (status !== "complete") {
                if (isHolding.current) {
                    const newCharge = Math.min(chargeRef.current + CHARGE_SPEED, 100);
                    chargeRef.current = newCharge;
                    setCharge(newCharge); // Sync UI
                } else {
                    const newCharge = Math.max(chargeRef.current - DECAY_SPEED, 0);
                    chargeRef.current = newCharge;
                    setCharge(newCharge); // Sync UI
                }
            }

            // Check for Completion
            if (chargeRef.current >= 100 && status !== "complete") {
                completeSequence();
            }

            // Render Particles
            particles.current.forEach((p, i) => {
                updateParticle(p, canvas.width, canvas.height, isHolding.current, chargeRef.current);
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Respawn if dead
                if (p.life <= 0) {
                    particles.current[i] = createParticle(canvas);
                }
            });

            animationFrame.current = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrame.current);
        };
    }, [status]); // Only restart if status changes (e.g. to complete), NOT on charge update

    const createParticle = (canvas: HTMLCanvasElement): Particle => {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1, // Tiny dots
            color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`, // White/Transparent
            life: Math.random() * 100 + 100,
        };
    };

    const updateParticle = (p: Particle, w: number, h: number, attracting: boolean, currentCharge: number) => {
        const centerX = w / 2;
        const centerY = h / 2;

        if (attracting) {
            // physics: suck towards center
            const dx = centerX - p.x;
            const dy = centerY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // The closer to 100 charge, the stronger the pull and chaotic energy
            const force = (currentCharge / 100) * 0.15 + 0.02;

            p.vx += dx * 0.0005 * force;
            p.vy += dy * 0.0005 * force; // Orbit/Suction feel

            // Color Shift: Blue -> Pink -> Red/Gold as charge increases
            if (currentCharge > 80) p.color = `rgba(251, 191, 36, 0.8)`; // Gold
            else if (currentCharge > 50) p.color = `rgba(244, 63, 94, 0.6)`; // Pink/Rose
            else p.color = `rgba(147, 197, 253, 0.5)`; // Blueish

        } else {
            // Idle drift
            p.x += p.vx;
            p.y += p.vy;

            // If life is infinite (99999), apply twinkle effect
            if (p.life > 90000) {
                // Twinkle: Randomly change opacity/size slightly
                if (Math.random() > 0.9) {
                    p.size = Math.random() * 3 + 1;
                }
            } else {
                p.life--;
            }
        }

        // Apply Velocity
        p.x += p.vx;
        p.y += p.vy;

        // Friction/Damping logic would go here if needed, but simple is fine
        p.vx *= 0.99;
        p.vy *= 0.99;
    };

    const handleTouchStart = () => {
        if (status === "complete") return;
        isHolding.current = true;
        setStatus("charging");
        // Haptic feedback?
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const handleTouchEnd = () => {
        if (status === "complete") return;
        isHolding.current = false;
        setStatus("idle");
    };

    const completeSequence = () => {
        setStatus("complete");
        isHolding.current = false;
        // Animation handled in render
    };

    const handleExplosionSequence = () => {
        if (!canvasRef.current || !containerRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // 1. IMPLOSION: Suck all particles to center FAST
        // We modify the particles array directly
        particles.current.forEach(p => {
            // Force velocity towards center
            const dx = (canvas.width / 2) - p.x;
            const dy = (canvas.height / 2) - p.y;
            p.vx = dx * 0.1;
            p.vy = dy * 0.1;
            p.life = 100;
            p.color = "white";
        });

        // 2. FLASH & EXPLOSION
        setTimeout(() => {
            gsap.to(containerRef.current, {
                backgroundColor: "#fff", // Bright white flash
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    setShowTicket(true); // Trigger Ticket Reveal

                    // Play pop sound
                    if (audioRef.current) {
                        audioRef.current.volume = 0.3; // Soft volume
                        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
                    }

                    // Explosion: Send particles flying OUT
                    particles.current.forEach(p => {
                        p.x = canvas.width / 2;
                        p.y = canvas.height / 2;
                        p.vx = (Math.random() - 0.5) * 50; // FAST
                        p.vy = (Math.random() - 0.5) * 50;
                        p.color = Math.random() > 0.5 ? "rgba(244, 63, 94, 0.8)" : "rgba(251, 191, 36, 0.8)"; // Pink & Gold
                        p.life = 200;
                        p.size = Math.random() * 4 + 2;
                    });

                    // 3. SPAWN PERMANENT GLITTER
                    for (let i = 0; i < 150; i++) {
                        particles.current.push({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            vx: (Math.random() - 0.5) * 0.5,
                            vy: (Math.random() - 0.5) * 0.5,
                            size: Math.random() * 3,
                            color: Math.random() > 0.5 ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
                            life: 99999,
                        });
                    }

                    // 4. SHOW CAMERA MODAL - After explosion settles
                    setTimeout(() => {
                        setShowCamera(true);
                    }, 2500); // 2.5 second delay after explosion
                }
            });
        }, 800); // Longer implosion time (was 600)
    };

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden touch-none select-none"
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Canvas for Particles */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            {/* Hidden Audio Element for Pop Sound */}
            <audio
                ref={audioRef}
                src="https://cdn.pixabay.com/audio/2022/03/10/audio_4a382a81d6.mp3"
                preload="auto"
            />

            {/* --- SCANNER INTERFACE --- */}
            <AnimatePresence>
                {status !== "complete" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        {/* Fingerprint Icon Container */}
                        <div className="relative mb-8 group cursor-pointer">
                            {/* Pulse Rings */}
                            {isHolding.current && (
                                <>
                                    <motion.div
                                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="absolute inset-0 rounded-full border border-rose-500/50"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                                        transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
                                        className="absolute inset-0 rounded-full border border-rose-500/30"
                                    />
                                </>
                            )}

                            {/* Main Icon */}
                            <Fingerprint
                                size={80}
                                className={`transition-colors duration-300 ${isHolding.current ? "text-rose-500" : "text-white/20 animate-pulse"}`}
                            />
                        </div>

                        {/* Text Instruction */}
                        <div className="text-center h-20">
                            {/* Main instruction */}
                            <p className={`text-base md:text-lg tracking-[0.3em] uppercase transition-all duration-300 font-medium ${isHolding.current ? "text-rose-400 font-bold scale-110" : "text-rose-200/80 animate-pulse ml-1"}`}>
                                {isHolding.current ? "HOLD TO SYNC..." : "INITIATE CONNECTION"}
                            </p>
                            {/* Subtle hint */}
                            {!isHolding.current && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-xs text-white/50 mt-3 tracking-widest uppercase font-mono"
                                >
                                    ( Click & Hold Fingerprint )
                                </motion.p>
                            )}
                            {/* Charge Bar (Optional Visual) */}
                            {isHolding.current && (
                                <div className="w-32 h-1 bg-white/10 mt-4 rounded-full overflow-hidden mx-auto">
                                    <div
                                        className="h-full bg-rose-500 transition-all duration-75 ease-linear"
                                        style={{ width: `${charge}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- THE REVEAL (Post-Explosion) --- */}
            {status === "complete" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute z-20 w-full h-full flex flex-col items-center justify-center pointer-events-none"
                >
                    {/* 1. THE PROPOSAL REVEAL */}
                    <AnimatePresence>
                        {!showTicket && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.5, filter: "blur(30px)" }}
                                transition={{ duration: 0.8 }}
                                className="text-center flex flex-col items-center gap-12 px-4 pointer-events-auto max-w-4xl"
                            >
                                {/* Floating Hearts Background */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ y: "100%", opacity: 0, x: `${Math.random() * 100}%` }}
                                            animate={{
                                                y: "-100%",
                                                opacity: [0, 0.3, 0.3, 0],
                                                x: `${Math.random() * 100}%`
                                            }}
                                            transition={{
                                                duration: 8 + Math.random() * 4,
                                                delay: i * 0.5,
                                                repeat: Infinity
                                            }}
                                            className="absolute text-6xl"
                                        >
                                            💕
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Top Line Accent */}
                                <motion.div
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    animate={{ scaleX: 1, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
                                    className="relative w-32 h-[1px] bg-gradient-to-r from-transparent via-rose-400 to-transparent"
                                />

                                {/* The Question - Word by Word Cascade */}
                                <div className="relative space-y-6">
                                    {/* Radial Glow */}
                                    <div className="absolute inset-0 bg-gradient-radial from-rose-500/30 via-rose-500/10 to-transparent blur-3xl scale-150" />

                                    <div className="relative z-10 space-y-3">
                                        {/* Line 1: Baby */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 30, rotateX: 90 }}
                                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                            transition={{ delay: 0.6, duration: 1, type: "spring", stiffness: 100 }}
                                        >
                                            <span className="block text-4xl md:text-6xl font-serif italic text-rose-300/90 tracking-wide">
                                                Baby
                                            </span>
                                        </motion.div>

                                        {/* Line 2: would you be */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.2, duration: 1 }}
                                        >
                                            <span className="block text-3xl md:text-5xl text-white/80 font-light tracking-wider">
                                                would you be
                                            </span>
                                        </motion.div>

                                        {/* Line 3: my valentine? - THE STAR */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                            transition={{ delay: 1.8, duration: 1.5, type: "spring", bounce: 0.4 }}
                                            className="relative"
                                        >
                                            <motion.span
                                                animate={{
                                                    textShadow: [
                                                        "0 0 20px rgba(244,63,94,0.6)",
                                                        "0 0 40px rgba(244,63,94,0.8)",
                                                        "0 0 20px rgba(244,63,94,0.6)"
                                                    ]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="text-5xl md:text-9xl font-serif italic text-rose-500 tracking-tight"
                                            >
                                                my valentine? 🥺
                                            </motion.span>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Bottom Line + Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 2.5, duration: 1 }}
                                    className="flex flex-col items-center gap-6"
                                >
                                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-rose-400/50 to-transparent" />

                                    <motion.button
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        whileHover={{ scale: 1.08, boxShadow: "0 0 60px rgba(244,63,94,0.5)" }}
                                        whileTap={{ scale: 0.92 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                        className="group relative px-16 py-6 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 text-white font-bold tracking-[0.3em] uppercase text-sm rounded-full overflow-hidden shadow-[0_0_30px_rgba(244,63,94,0.4)] border-2 border-rose-400/30"
                                        onClick={handleExplosionSequence}
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-white/20"
                                            initial={{ x: "-100%" }}
                                            whileHover={{ x: "100%" }}
                                            transition={{ duration: 0.6 }}
                                        />
                                        <span className="relative z-10 flex items-center gap-2">
                                            Yes, Forever
                                            <motion.span
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                ❤️
                                            </motion.span>
                                        </span>
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 2. MESSY FLIP CARDS (Reveals GENTLY after explosion settles) */}
                    {showTicket && showCards && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5 }}
                            className="relative w-full h-screen flex items-center justify-center pointer-events-auto overflow-hidden"
                        >
                            {/* Overlay to deselect */}
                            <div
                                className={`absolute inset-0 bg-black/80 transition-opacity duration-500 ${selectedCard ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                                onClick={() => setSelectedCard(null)}
                            />

                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: selectedCard ? 0 : 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="absolute top-24 md:top-32 text-white/60 text-sm md:text-xl tracking-[0.3em] uppercase font-light text-center z-0"
                            >
                                Your Adventure
                            </motion.h2>



                            {/* --- CARD 2: NEON & NOSTALGIA --- */}
                            <FlipCard
                                id="car"
                                isSelected={selectedCard === "car"}
                                isOtherSelected={selectedCard !== null && selectedCard !== "car"}
                                onClick={() => setSelectedCard(selectedCard === "car" ? null : "car")}
                                initialRotation={0}
                                initialX={0}
                                color="from-rose-950 to-black"
                                borderColor="border-rose-500/50"
                                icon="📸"
                                title="Neon & Nostalgia"
                                subtitle="Car Date + Photo Booth"
                                details={{
                                    time: "7:30 PM",
                                    location: "Drive-In & Arcade",
                                    note: "Bring your craziest photo props! Cool evening, blankets, cool movie, popcorn, food, and much more."
                                }}
                                whatsappMessage="I choose Neon & Nostalgia! 📸🚗 Car date and crazy photo booth time!"
                            />

                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Camera Capture Modal */}
            <CameraCapture
                isOpen={showCamera}
                onClose={() => setShowCamera(false)}
                onPhotoSubmitted={() => {
                    setShowCamera(false);
                    setShowButterflyMessage(true); // Show butterfly message

                    // Hide message and show cards after delay
                    setTimeout(() => {
                        setShowButterflyMessage(false);
                        setShowCards(true);
                    }, 2500); // 2.5 second pause to read message
                }}
            />

            {/* Butterfly Delivery Message */}
            <AnimatePresence>
                {showButterflyMessage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-gradient-to-br from-rose-500 to-pink-600 px-8 py-6 rounded-3xl shadow-2xl border-2 border-white/30 backdrop-blur-sm"
                        >
                            <p className="text-white text-xl md:text-2xl font-serif italic text-center">
                                The butterflies will deliver this to me ❤️
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}

// --- FLIP CARD COMPONENT ---

interface FlipCardProps {
    id: string;
    isSelected: boolean;
    isOtherSelected: boolean;
    onClick: () => void;
    initialRotation: number;
    initialX: number;
    color: string;
    borderColor: string;
    icon: string;
    title: string;
    subtitle: string;
    details: { time: string; location: string; note: string };
    whatsappMessage: string;
}

function FlipCard({
    isSelected,
    isOtherSelected,
    onClick,
    initialRotation,
    initialX,
    color,
    borderColor,
    icon,
    title,
    subtitle,
    details,
    whatsappMessage
}: FlipCardProps) {

    return (
        <div
            className={`absolute transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSelected ? "z-50" : "z-10"}`}
            style={{
                perspective: "1000px",
                transform: isSelected
                    ? "translate(0, 0) rotate(0deg)" // Center
                    : isOtherSelected
                        ? `translate(${initialX * 3}px, 1000px) rotate(${initialRotation}deg)` // Fly away
                        : `translate(${initialX}px, 0) rotate(${initialRotation}deg)` // Messy pile
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick(); // Trigger Flip
            }}
        >
            <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: isSelected ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                className="relative w-[300px] h-[450px] transform-style-3d cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* --- FRONT SIDE --- */}
                <div
                    className={`absolute inset-0 w-full h-full bg-gradient-to-br ${color} border ${borderColor} backdrop-blur-md rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden`}
                    style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
                >
                    {/* Texture */}
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                    <div className="absolute top-2 right-4 text-white/20 text-4xl font-serif italic">"{icon}"</div>

                    <div className="mt-12 z-10">
                        <p className="text-xs text-white/50 tracking-[0.3em] uppercase mb-2">Admit One</p>
                        <h2 className="text-4xl text-white font-serif italic leading-tight">{title}</h2>
                    </div>

                    <div className="z-10">
                        <div className="w-full h-[1px] bg-white/20 mb-4" />
                        <p className="text-white/80 text-sm font-light uppercase tracking-widest">{subtitle}</p>
                    </div>

                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/10 blur-3xl rounded-full pointer-events-none" />
                </div>

                {/* --- BACK SIDE (DETAILS) --- */}
                <div
                    className={`absolute inset-0 w-full h-full bg-black/90 border ${borderColor} rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center`}
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", transformStyle: "preserve-3d" }}
                >
                    <div className="mb-6">
                        <span className="text-4xl">{icon}</span>
                    </div>

                    <h3 className="text-xl text-white font-serif mb-6">{title}</h3>

                    <div className="space-y-4 w-full text-sm text-white/70 font-light mb-8">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span>Time</span>
                            <span className="text-white">{details.time}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span>Location</span>
                            <span className="text-white">{details.location}</span>
                        </div>
                        <p className="text-xs italic text-white/50 pt-2 leading-relaxed">
                            "{details.note}"
                        </p>
                    </div>

                    {/* CLAIM BUTTON - Only this triggers WhatsApp */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent flip
                            const phone = "1234567890";
                            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
                        }}
                        className="w-full py-4 bg-white text-black font-bold tracking-[0.2em] uppercase text-xs rounded-full hover:bg-rose-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        Claim Date
                    </button>

                    <p className="mt-4 text-[10px] text-white/30 uppercase tracking-widest">Tap outside to close</p>
                </div>
            </motion.div>
        </div>
    );
}
