"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Board Dimensions
const ROWS = 6;
const COLS = 7;

// Player Constants
const EMPTY = 0;
const P1 = 1; // User (White Witch)
const P2 = 2; // Opponent (Wicked Soul)

// Initial "Almost Won" State
// 0 = Empty, 1 = P1 (User), 2 = P2 (Opponent)
// We'll set up a vertical win in the center column (Col 3, 0-indexed)
// P1 needs to drop one more in Col 3 to win.
const INITIAL_BOARD = [
    [0, 0, 0, 0, 0, 0, 0], // Row 0 (Top)
    [0, 0, 0, 0, 0, 0, 0], // Row 1
    [2, 0, 0, 0, 0, 2, 0], // Row 2
    [2, 0, 0, 1, 0, 1, 0], // Row 3
    [1, 2, 2, 1, 2, 1, 0], // Row 4
    [1, 1, 2, 1, 2, 2, 1], // Row 5 (Bottom)
];

export default function ConnectFour() {
    const [board, setBoard] = useState(INITIAL_BOARD);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);

    // Calculate the lowest empty row for a given column
    const getLowestEmptyRow = (colIndex: number, currentBoard: number[][]) => {
        for (let r = ROWS - 1; r >= 0; r--) {
            if (currentBoard[r][colIndex] === EMPTY) {
                return r;
            }
        }
        return -1; // Column full
    };

    const handleDrop = (colIndex: number) => {
        if (gameOver) return;

        const row = getLowestEmptyRow(colIndex, board);
        if (row === -1) return; // Column full

        // Create new board state
        const newBoard = board.map(r => [...r]);
        newBoard[row][colIndex] = P1;
        setBoard(newBoard);

        // Check for win (We know the setup, but let's do a simple check logic or just force it for the scripted moment)
        // Since we know the setup is for Col 3 to win:
        if (colIndex === 3 && row === 2) {
            // Logic: If they drop in the winning slot (Row 2, Col 3 - which creates 4 vertical)
            setTimeout(() => {
                setGameOver(true);
                setWinner("White Witch");
            }, 500);
        } else {
            // If they drop elsewhere (unlikely to win immediately based on my setup, but let's handle turns?)
            // Actually, for this "scripted" feel, let's just let them place pieces until they hit the win.
            // Opponent doesn't need to move, it's a puzzle moment.

            // Allow other wins?
            if (checkWin(newBoard, row, colIndex, P1)) {
                setTimeout(() => {
                    setGameOver(true);
                    setWinner("White Witch");
                }, 500);
            }
        }
    };

    // Standard Connect 4 Win Check (Horizontal, Vertical, Diagonal)
    const checkWin = (board: number[][], r: number, c: number, player: number) => {
        // Vertical
        if (r + 3 < ROWS &&
            board[r + 1][c] === player &&
            board[r + 2][c] === player &&
            board[r + 3][c] === player) return true;

        // Horizontal
        // (Simplified check for this use case)

        return false;
    };

    return (
        <section className="relative w-full min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center py-20 overflow-hidden font-sans">

            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#16213e] to-[#0f3460] opacity-50" />

            {/* Redemption Text */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="relative z-10 text-center mb-8"
            >
                <h3 className="text-white/60 font-mono text-xs md:text-sm tracking-[0.3em] uppercase">
                    Now's your time for redemption
                </h3>
            </motion.div>

            {/* Header */}
            <div className="relative z-10 flex justify-between w-full max-w-lg mb-8 px-4">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-rose-500 border-4 border-white/10 shadow-lg mb-2" />
                    <span className="text-white font-bold text-sm tracking-widest uppercase">White Witch</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="text-4xl font-black text-white/20">VS</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-teal-500 border-4 border-white/10 shadow-lg mb-2" />
                    <span className="text-white/50 font-bold text-sm tracking-widest uppercase">Wicked Soul</span>
                </div>
            </div>

            {/* The Board */}
            <div className="relative z-10 bg-[#162447] p-4 rounded-3xl shadow-2xl border-4 border-[#1f4068]">
                <div className="grid grid-cols-7 gap-2 md:gap-3 bg-[#0f3460] p-4 rounded-xl border border-white/5">
                    {/* Columns */}
                    {[...Array(COLS)].map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className="relative flex flex-col gap-2 md:gap-3 cursor-pointer hover:bg-white/5 rounded-lg transition-colors p-1 group"
                            onClick={() => handleDrop(colIndex)}
                        >
                            {/* Visual Clue for Winning Column (Index 3) */}
                            {colIndex === 3 && !gameOver && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    className="absolute -top-12 left-0 right-0 flex flex-col items-center z-20 pointer-events-none"
                                >
                                    <motion.div
                                        animate={{ y: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    >
                                        <span className="text-rose-500 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap mb-1">
                                            Win Here
                                        </span>
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 text-rose-500 mx-auto drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                                        >
                                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                                        </svg>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Rows (Top to Bottom visually in DOM, but index 0 is top) */}
                            {board.map((row, rowIndex) => {
                                const cell = row[colIndex];
                                return (
                                    <div key={rowIndex} className="relative w-8 h-8 md:w-16 md:h-16 rounded-full bg-[#1a1a2e] shadow-inner inset-shadow overflow-hidden">
                                        {/* Piece */}
                                        <AnimatePresence>
                                            {cell !== EMPTY && (
                                                <motion.div
                                                    initial={{ y: -300, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                                                    className={`w-full h-full rounded-full shadow-[inset_0_-4px_4px_rgba(0,0,0,0.5)] ${cell === P1 ? "bg-rose-500" : "bg-teal-500"
                                                        }`}
                                                >
                                                    {/* Shine effect */}
                                                    <div className="absolute top-2 left-2 w-1/3 h-1/3 bg-white/20 rounded-full blur-[1px]" />

                                                    {/* Star Icon for P1 */}
                                                    {cell === P1 && (
                                                        <div className="absolute inset-0 flex items-center justify-center text-rose-900/40">
                                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-1/2 h-1/2">
                                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-5.82 3.25L7.36 14.14 2.36 9.27l6.91-1.01L12 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Victory Overlay */}
            <AnimatePresence>
                {gameOver && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <div className="text-center p-8">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-6xl md:text-8xl mb-4"
                            >
                                🏆
                            </motion.div>
                            <h2 className="text-4xl md:text-6xl font-black text-rose-500 uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(244,63,94,0.6)] mb-4 leading-tight">
                                Congrats<br />White Witch!
                            </h2>
                            <p className="text-white text-xl md:text-2xl font-mono tracking-widest">
                                YOU FINALLY WON
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}
