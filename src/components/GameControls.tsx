import React from 'react';
import { Flag } from 'lucide-react';
import { MatchButton } from './MatchButton';

interface GameControlsProps {
  onSurrender: () => void;
  onMatch: () => void;
  onCancelMatch: () => void;
  isPlaying: boolean;
  isMatchmaking: boolean;
}

export function GameControls({ 
  onSurrender, 
  onMatch, 
  onCancelMatch,
  isPlaying, 
  isMatchmaking 
}: GameControlsProps) {
  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      {!isPlaying && (
        <MatchButton 
          onMatch={onMatch}
          onCancel={onCancelMatch}
          isMatchmaking={isMatchmaking}
          disabled={isPlaying}
        />
      )}
      
      {isPlaying && isMatchmaking && (
        <button
          onClick={onSurrender}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full
            flex items-center justify-center gap-2 transform transition-all
            hover:scale-105 active:scale-95 focus:outline-none shadow-lg"
        >
          <Flag size={16} />
          <span>Surrender</span>
        </button>
      )}
    </div>
  );
}