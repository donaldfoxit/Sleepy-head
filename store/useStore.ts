import { create } from 'zustand';

interface AppState {
    isUnlocked: boolean;
    setIsUnlocked: (value: boolean) => void;
    isExternalAudioPlaying: boolean;
    setIsExternalAudioPlaying: (value: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
    isUnlocked: false,
    setIsUnlocked: (value) => set({ isUnlocked: value }),
    isExternalAudioPlaying: false,
    setIsExternalAudioPlaying: (value) => set({ isExternalAudioPlaying: value }),
}));
