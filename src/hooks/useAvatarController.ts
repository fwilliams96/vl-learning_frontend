import { Lipsync } from '@/models/message';
import create from 'zustand';

interface AvatarMessage {
  animation: string;
  facialExpression: string;
  lipsync: Lipsync;
  audio: string;
}

interface AvatarState {
  message: AvatarMessage | undefined;
  setMessage: (message: AvatarMessage | undefined) => void;
  onMessagePlayed: (() => void) | undefined;
  setOnMessagePlayed: (callback: (() => void) | undefined) => void;
}

const useAvatarController = create<AvatarState>((set) => ({
  message: undefined,
  setMessage: (message: AvatarMessage | undefined) => set({ message }),
  onMessagePlayed: undefined,
  setOnMessagePlayed: (callback: (() => void) | undefined) => set({ onMessagePlayed: callback }),
}));

export { useAvatarController }; 