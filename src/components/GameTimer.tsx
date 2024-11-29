import React from 'react';
import { Timer } from 'lucide-react';

interface GameTimerProps {
  timeLeft: number;
  isPlaying: boolean;
}

export function GameTimer({ timeLeft, isPlaying }: GameTimerProps) {
  return (
    <div className="flex items-center justify-center gap-2 bg-yellow-100 px-4 py-2 rounded-full shadow-md mb-[25px]">
      <Timer size={24} className="text-yellow-600" />
      <span className="font-bold text-yellow-800 text-xl">{timeLeft}s</span>
    </div>
  );
}
