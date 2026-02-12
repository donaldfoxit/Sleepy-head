"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, RefreshCw, Send } from "lucide-react";

interface CameraCaptureProps {
    isOpen: boolean;
    onClose: () => void;
    onPhotoSubmitted: () => void;
}

export default function CameraCapture({ isOpen, onClose, onPhotoSubmitted }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);

    // Start camera when modal opens
    useEffect(() => {
        if (isOpen && !stream) {
            startCamera();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isOpen]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: 1280, height: 720 }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setPermissionDenied(false);
        } catch (error) {
            console.error("Camera access denied:", error);
            setPermissionDenied(true);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Flip horizontally for mirror effect
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(imageData);

        // Stop camera after capture
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const retake = () => {
        setCapturedImage(null);
        startCamera();
    };

    const submitPhoto = async () => {
        if (!capturedImage) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/send-acceptance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ photo: capturedImage })
            });

            if (response.ok) {
                onPhotoSubmitted();
                onClose();
            } else {
                alert("Failed to send photo. Please try again!");
            }
        } catch (error) {
            console.error("Error submitting photo:", error);
            alert("Network error. Please check your connection!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="relative w-full max-w-2xl bg-gradient-to-br from-rose-950 to-black rounded-3xl overflow-hidden shadow-2xl border border-rose-500/30"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Header */}
                        <div className="p-6 pb-4 text-center border-b border-rose-500/20">
                            <h2 className="text-2xl md:text-3xl font-serif italic text-rose-400 mb-2">
                                Seal it with a Kiss 💋
                            </h2>
                            <p className="text-white/60 text-sm">
                                Blow me a kiss so I can keep this moment forever!
                            </p>
                        </div>

                        {/* Camera Preview / Captured Image */}
                        <div className="relative aspect-video bg-black">
                            {permissionDenied ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 p-8 text-center">
                                    <Camera className="w-16 h-16 mb-4 text-rose-500/50" />
                                    <p className="mb-2">Camera access is required to capture your photo.</p>
                                    <button
                                        onClick={startCamera}
                                        className="mt-4 px-6 py-2 bg-rose-600 rounded-full text-white text-sm hover:bg-rose-500 transition-colors"
                                    >
                                        Grant Permission
                                    </button>
                                </div>
                            ) : capturedImage ? (
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover scale-x-[-1]"
                                />
                            )}

                            {/* Floating hearts decoration */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ y: "100%", opacity: 0 }}
                                        animate={{
                                            y: "-100%",
                                            opacity: [0, 0.4, 0.4, 0],
                                            x: `${Math.random() * 100}%`
                                        }}
                                        transition={{
                                            duration: 6 + Math.random() * 3,
                                            delay: i * 0.8,
                                            repeat: Infinity
                                        }}
                                        className="absolute text-4xl"
                                    >
                                        💕
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Hidden canvas for capture */}
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Action Buttons */}
                        <div className="p-6 flex gap-4 justify-center">
                            {!capturedImage ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={capturePhoto}
                                    disabled={permissionDenied}
                                    className="px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold tracking-wider uppercase text-sm rounded-full shadow-[0_0_30px_rgba(244,63,94,0.4)] border-2 border-rose-400/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Camera className="w-5 h-5" />
                                    Capture
                                </motion.button>
                            ) : (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={retake}
                                        className="px-6 py-3 bg-white/10 text-white font-semibold tracking-wide uppercase text-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-2"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Retake
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={submitPhoto}
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold tracking-wider uppercase text-sm rounded-full shadow-[0_0_30px_rgba(244,63,94,0.4)] border-2 border-rose-400/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Send Kiss
                                            </>
                                        )}
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
