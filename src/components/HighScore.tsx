import React, { useState } from 'react';
import { Medal, ChevronUp, ChevronDown } from 'lucide-react';

interface HighScoreProps {
  highScore: number;
}

export function HighScore({ highScore }: HighScoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 shadow-lg transition-all duration-300"
         style={{ transform: `translateY(${isExpanded ? '0' : 'calc(100% - 3rem)'})`}}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-2 hover:bg-yellow-200 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Medal size={20} className="text-yellow-600" />
          <span className="font-semibold text-yellow-800">High Score</span>
        </div>
        {isExpanded ? (
          <ChevronDown size={20} className="text-yellow-600" />
        ) : (
          <ChevronUp size={20} className="text-yellow-600" />
        )}
      </button>
      <div className="p-6">
        <div className="text-center">
          <span className="text-4xl font-bold text-yellow-800">{highScore}</span>
          <p className="text-yellow-600 mt-2">Your best score yet!</p>
        </div>
      </div>
    </div>
  );
}