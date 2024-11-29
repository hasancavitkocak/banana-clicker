import React from 'react';
import { Banana } from 'lucide-react';

interface BananaButtonProps {
  onClick: () => void;
  isPlaying: boolean;
  isWinning?: boolean;
  showWinEffect?: boolean;
}

export function BananaButton({ onClick, isPlaying, isWinning, showWinEffect }: BananaButtonProps) {
  const handleClick = () => {
    if (!isPlaying) return;
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isPlaying}
      className={`transform transition-all duration-150 ${
        isPlaying ? 'hover:scale-105 active:scale-90' : 'opacity-50'
      } focus:outline-none relative`}
    >
      <Banana
        size={120}
        className={`text-yellow-400 drop-shadow-lg transition-all duration-150 ${
          isPlaying ? 'animate-pulse' : ''
        } ${isWinning ? 'text-yellow-500' : ''} ${
          showWinEffect ? 'animate-bounce text-yellow-500' : ''
        }`}
      />
      {showWinEffect && isWinning && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="text-4xl font-black text-yellow-500 animate-bounce tracking-wider drop-shadow-lg"
               style={{ textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' }}>
            WIN!
          </div>
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            Winner!
          </div>
        </div>
      )}
    </button>
  );
}